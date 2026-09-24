from rest_framework import serializers
from django.contrib.auth.models import User
from ..models.clients_models import Client, RoleChoices

class UserSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour la lecture des informations utilisateur.
    Contient le nom, prénom, classe, rôle et numéro de téléphone du profil Client associé.
    """
    client_id = serializers.UUIDField(source='profile.id', read_only=True)
    name = serializers.CharField(source='profile.name', read_only=True)
    surname = serializers.CharField(source='profile.surname', read_only=True)
    classe = serializers.CharField(source='profile.classe', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    role = serializers.CharField(source='profile.role', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'client_id', 'name', 'surname', 'classe', 'phone', 'role', 'is_staff', 'is_superuser']


class RegisterSerializer(serializers.Serializer):
    """
    Sérialiseur d'inscription publique pour les étudiants.
    Sécurité : Tout nouvel inscrit se voit attribuer UNIQUEMENT le rôle ETUDIANT.
    Impossible de devenir Administrateur ou Cuisinière via l'inscription publique.
    """
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=4)
    name = serializers.CharField(max_length=100)
    surname = serializers.CharField(max_length=100)
    classe = serializers.CharField(max_length=100, default="IAI-Cameroun")
    phone = serializers.CharField(max_length=20)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data['name'],
            last_name=validated_data['surname']
        )

        # Force le rôle ETUDIANT pour des raisons de sécurité
        client = Client.objects.create(
            user=user,
            name=validated_data['name'],
            surname=validated_data['surname'],
            classe=validated_data['classe'],
            phone=validated_data['phone'],
            role=RoleChoices.ETUDIANT
        )
        return client
