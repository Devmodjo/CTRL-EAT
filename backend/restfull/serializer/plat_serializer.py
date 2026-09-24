from rest_framework import serializers
from ..models.plat_models import Plat

class PlatSerializer(serializers.ModelSerializer):
    """
    Sérialiseur du modèle Plat.
    Inclut le compteur de commandes confirmées pour la livraison de demain.
    """
    commandes_demain = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Plat
        fields = ['id', 'name', 'details', 'image', 'image_url', 'price', 'disponibility', 'commandes_demain', 'createdAt']
        read_only_fields = ['id', 'createdAt', 'commandes_demain', 'image_url']

    def get_commandes_demain(self, obj):
        return obj.get_commandes_demain_count()

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None