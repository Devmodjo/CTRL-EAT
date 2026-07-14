from ..serializer.plat_serializer import PlatSerializer
from ..models.plat_models import Plat
from rest_framework import generics


class PlatListCreateView(generics.ListCreateAPIView):
    queryset = Plat.objects.all()
    serializer_class = PlatSerializer
    
class PlatRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Plat.objects.all()
    serializer_class = PlatSerializer 
    lookup_field = 'id'