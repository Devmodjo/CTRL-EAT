from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from django.db.models import Sum
import datetime

from ..serializer.command_serializer import CommandSerializer
from ..models.commande_models import Commande, CommandePlat, CommandeStatus
from ..models.plat_models import Plat
from ..models.clients_models import Client

class CommandListCreateView(generics.ListCreateAPIView):
    """
    GET /api/commandes/ : Liste des commandes (filtrable par client_id, statut, ou date_livraison).
    POST /api/commandes/ : Passer une nouvelle commande.
    Règle importante Ctrl+Eat (Section 8 et 13) :
    - Commande avant 22h00 => Livraison demain à 12h00.
    - Commande après 22h00 => Message d'information + livraison prévue pour après-demain.
    """
    queryset = Commande.objects.all().order_by('-date_creation')
    serializer_class = CommandSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_queryset(self):
        queryset = Commande.objects.all().order_by('-date_creation')
        client_id = self.request.query_params.get('client_id', None)
        status_param = self.request.query_params.get('status', None)
        date_livraison = self.request.query_params.get('date_livraison', None)

        if client_id:
            queryset = queryset.filter(client__id=client_id)
        if status_param:
            queryset = queryset.filter(status=status_param)
        if date_livraison == 'demain':
            demain = timezone.now().date() + datetime.timedelta(days=1)
            queryset = queryset.filter(date_livraison=demain)
        elif date_livraison:
            queryset = queryset.filter(date_livraison=date_livraison)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        commande = serializer.save()
        
        headers = self.get_success_headers(serializer.data)
        response_data = serializer.data
        
        # Message personnalisé explicatif sur la livraison selon l'heure
        heure_actuelle = timezone.now().hour
        if heure_actuelle >= 22:
            response_data['note_limite_heure'] = (
                "Attention : Il est plus de 22h00. Votre commande a été enregistrée avec succès pour la livraison D'APRÈS-DEMAIN à 12h00."
            )
        else:
            response_data['note_limite_heure'] = (
                "Commande enregistrée avec succès pour la livraison de DEMAIN à 12h00."
            )

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)


class CommandRetreiveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/commandes/<id>/ : Détail d'une commande.
    PUT/PATCH /api/commandes/<id>/ : Mettre à jour le statut de la commande (ex: passer de CONFIRMER à EN_PREPARATION puis PRETE).
    DELETE /api/commandes/<id>/ : Annuler / Supprimer la commande.
    """
    queryset = Commande.objects.all()
    serializer_class = CommandSerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]


class UploadPaymentProofView(APIView):
    """
    POST /api/commandes/<id>/upload-preuve/
    Permet à l'étudiant de téléverser la capture d'écran du transfert Mobile Money (MTN / Orange).
    """
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, id):
        try:
            commande = Commande.objects.get(id=id)
        except Commande.DoesNotExist:
            return Response({'detail': 'Commande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        if 'payment_proof' not in request.FILES:
            return Response({'detail': 'Veuillez joindre le fichier de capture d\'écran (payment_proof).'}, status=status.HTTP_400_BAD_REQUEST)

        commande.payment_proof = request.FILES['payment_proof']
        commande.status = CommandeStatus.EN_ATTENTE
        commande.save()

        return Response({
            'message': 'Preuve de paiement reçue ! En attente de vérification par l\'administrateur.',
            'commande': CommandSerializer(commande, context={'request': request}).data
        }, status=status.HTTP_200_OK)


class ValiderPaiementView(APIView):
    """
    POST /api/commandes/<id>/valider-paiement/
    Permet à l'administrateur de valider le paiement d'une commande.
    Passe le statut à 'CONFIRMER' et incrémente automatiquement le compteur de repas pour demain.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request, id):
        try:
            commande = Commande.objects.get(id=id)
        except Commande.DoesNotExist:
            return Response({'detail': 'Commande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        commande.payment_verified = True
        commande.status = CommandeStatus.CONFIRMER
        commande.save()

        return Response({
            'message': f'Paiement validé avec succès pour la commande {str(commande.id)[:8]}. Le compteur a été mis à jour.',
            'commande': CommandSerializer(commande, context={'request': request}).data
        }, status=status.HTTP_200_OK)


class CuisiniereRecapView(APIView):
    """
    GET /api/cuisiniere/recap/
    Fournit l'interface cuisinière avec les quantités exactes cumulées par plat à préparer pour demain 12h00.
    Cahier des charges (Section 6 & 12) : Visualisation des commandes groupées par plat.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        demain = timezone.now().date() + datetime.timedelta(days=1)
        
        # Récupérer tous les items commandés pour demain avec statut non annulé
        commandes_demain = Commande.objects.filter(
            date_livraison=demain
        ).exclude(status=CommandeStatus.ANNULEE)

        total_commandes_count = commandes_demain.count()
        total_repas_count = sum(c.quantity for c in commandes_demain)

        recap_par_plat = []
        plats = Plat.objects.all()

        for plat in plats:
            items = CommandePlat.objects.filter(
                plat=plat,
                commande__in=commandes_demain
            )
            quantite_totale = sum(item.quantity for item in items)
            
            if quantite_totale > 0 or request.query_params.get('all') == 'true':
                recap_par_plat.append({
                    'plat_id': str(plat.id),
                    'plat_nom': plat.name,
                    'plat_prix': plat.price,
                    'plat_image': request.build_absolute_uri(plat.image.url) if plat.image else None,
                    'quantite_totale_a_preparer': quantite_totale
                })

        return Response({
            'date_livraison': demain.strftime("%Y-%m-%d"),
            'date_livraison_formatee': demain.strftime("%d/%m/%Y"),
            'total_commandes': total_commandes_count,
            'total_portion_repas': total_repas_count,
            'plats_a_preparer': recap_par_plat
        }, status=status.HTTP_200_OK)