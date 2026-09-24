from rest_framework import serializers
from ..models.clients_models import Client

class ClientSerializer(serializers.ModelSerializer):
    """
    Sérialiseur complet pour le modèle Client.
    """
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = Client
        fields = ['id', 'user', 'username', 'email', 'name', 'surname', 'classe', 'phone', 'role', 'role_display', 'date_creation']
        read_only_fields = ['id', 'date_creation']