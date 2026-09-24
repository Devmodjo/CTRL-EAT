from rest_framework import serializers
from django.utils import timezone
import datetime
from ..models.commande_models import Commande, CommandePlat, CommandeStatus
from ..models.plat_models import Plat
from ..models.clients_models import Client, RoleChoices
from .plat_serializer import PlatSerializer
from .client_serializer import ClientSerializer

class CommandePlatSerializer(serializers.ModelSerializer):
    """
    Sérialiseur d'un plat à l'intérieur d'une commande.
    """
    plat_detail = PlatSerializer(source='plat', read_only=True)
    subtotal = serializers.FloatField(source='get_subtotal', read_only=True)

    class Meta:
        model = CommandePlat
        fields = ['id', 'plat', 'plat_detail', 'quantity', 'unit_price', 'subtotal']


class CommandeItemInputSerializer(serializers.Serializer):
    """
    Format d'entrée pour ajouter un plat dans le panier de commande.
    """
    plat_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)


class CommandSerializer(serializers.ModelSerializer):
    """
    Sérialiseur principal pour les commandes.
    Gère la création avec la liste d'articles, le calcul automatique du prix total,
    la détermination de la date de livraison (règle des 22h00) et les détails du client.
    """
    items = CommandePlatSerializer(many=True, read_only=True)
    client_detail = ClientSerializer(source='client', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_proof_url = serializers.SerializerMethodField()
    message_livraison = serializers.SerializerMethodField()
    
    # Champ d'entrée pour la création
    items_input = CommandeItemInputSerializer(many=True, write_only=True, required=False)
    client_id = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = Commande
        fields = [
            'id', 'client', 'client_id', 'client_detail', 'quantity', 'total_price',
            'date_creation', 'date_livraison', 'status', 'status_display',
            'payment_proof', 'payment_proof_url', 'payment_verified',
            'notes', 'items', 'items_input', 'message_livraison'
        ]
        read_only_fields = [
            'id', 'client', 'date_creation', 'date_livraison', 'quantity', 'total_price',
            'status', 'status_display', 'payment_proof_url', 'message_livraison'
        ]

    def get_payment_proof_url(self, obj):
        if obj.payment_proof:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.payment_proof.url)
            return obj.payment_proof.url
        return None

    def get_message_livraison(self, obj):
        now = obj.date_creation if obj.date_creation else timezone.now()
        heure = now.hour
        if heure >= 22:
            return "Attention : Commande enregistrée après 22h00. Livraison prévue pour après-demain à 12h00."
        return "Commande validée ! Livraison prévue pour demain à 12h00 sur le campus."

    def create(self, validated_data):
        items_data = validated_data.pop('items_input', [])
        client_id = validated_data.pop('client_id', None)
        
        # Récupération sécurisée du profil Client
        client = None
        if client_id:
            try:
                client = Client.objects.get(id=client_id)
            except Client.DoesNotExist:
                client = None

        if not client:
            request = self.context.get('request')
            if request and hasattr(request, 'user') and request.user and request.user.is_authenticated:
                if hasattr(request.user, 'profile'):
                    client = request.user.profile
                else:
                    client = Client.objects.create(
                        user=request.user,
                        name=request.user.first_name or request.user.username,
                        surname=request.user.last_name or '',
                        classe='IAI-Cameroun',
                        phone='699000000',
                        role=RoleChoices.ETUDIANT
                    )
            else:
                client = Client.objects.first()
                if not client:
                    client = Client.objects.create(
                        name="Étudiant",
                        surname="IAI Cameroun",
                        classe="L3 GL IAI",
                        phone="699000000",
                        role=RoleChoices.ETUDIANT
                    )

        # Règle métier Ctrl+Eat pour la date de livraison :
        # Commande passée avant 22h => Livraison demain
        # Commande passée après 22h => Livraison après-demain
        now = timezone.now()
        if now.hour >= 22:
            date_livraison = now.date() + datetime.timedelta(days=2)
        else:
            date_livraison = now.date() + datetime.timedelta(days=1)

        commande = Commande.objects.create(
            client=client,
            date_livraison=date_livraison,
            status=CommandeStatus.EN_ATTENTE,
            **validated_data
        )

        total_price = 0.0
        total_quantity = 0

        for item in items_data:
            try:
                plat = Plat.objects.get(id=item['plat_id'])
                qty = item['quantity']
                unit_price = plat.price
                
                CommandePlat.objects.create(
                    commande=commande,
                    plat=plat,
                    quantity=qty,
                    unit_price=unit_price
                )
                total_price += unit_price * qty
                total_quantity += qty
            except Plat.DoesNotExist:
                continue

        commande.total_price = total_price
        commande.quantity = total_quantity if total_quantity > 0 else 1
        commande.save()

        return commande