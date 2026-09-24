from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
import datetime

from ..serializer.plat_serializer import PlatSerializer
from ..models.plat_models import Plat
from ..models.commande_models import Commande, CommandePlat

class PlatListCreateView(generics.ListCreateAPIView):
    """
    GET /api/plats/ : Liste de tous les plats avec le compteur de commandes pour demain.
    POST /api/plats/ : Création d'un nouveau plat (Backoffice Admin).
    """
    queryset = Plat.objects.all().order_by('-createdAt')
    serializer_class = PlatSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Plat.objects.all().order_by('-createdAt')
        disponibility = self.request.query_params.get('disponibility', None)
        if disponibility is not None:
            is_disp = disponibility.lower() in ['true', '1', 'yes']
            queryset = queryset.filter(disponibility=is_disp)
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset


class PlatRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/plats/<id>/ : Détail d'un plat.
    PUT/PATCH /api/plats/<id>/ : Modification (prix, disponibilité, image...).
    DELETE /api/plats/<id>/ : Suppression d'un plat.
    """
    queryset = Plat.objects.all()
    serializer_class = PlatSerializer
    lookup_field = 'id'
    permission_classes = [permissions.AllowAny]


class PlatCompteurView(APIView):
    """
    GET /api/plats/compteurs/
    Retourne la liste des plats avec les compteurs exacts de commandes confirmées pour demain.
    Règle du cahier des charges (Section 9) :
    Compteur = somme des quantités commandées pour un plat avec date_livraison = demain et paiement vérifié.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        demain = timezone.now().date() + datetime.timedelta(days=1)
        plats = Plat.objects.all()
        resultats = []

        for plat in plats:
            total_commandes = plat.get_commandes_demain_count()
            resultats.append({
                'id': str(plat.id),
                'name': plat.name,
                'price': plat.price,
                'image': request.build_absolute_uri(plat.image.url) if plat.image else None,
                'disponibility': plat.disponibility,
                'commandes_demain_count': total_commandes,
                'date_livraison_cible': demain.strftime("%Y-%m-%d")
            })

        return Response(resultats, status=status.HTTP_200_OK)