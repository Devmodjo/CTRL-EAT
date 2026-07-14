from ..models.plat_models import Plat
from rest_framework import serializers


class PlatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plat
        fields = ['id', 'name', 'details', 'image', 'price', 'disponibility']
        read_only_fields = ["id"]