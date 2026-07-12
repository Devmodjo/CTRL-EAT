from ..models.clients_models import Client
from rest_framework import serializers


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        # champs dans le JSON
        fields = ["id", "name", "surname", "classe", "phone"]
        # champs a ne pas inclure dans le json
        read_only_fields = ["id"]
        