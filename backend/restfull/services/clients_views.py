from django.shortcuts import render
from rest_framework import generics
from ..serializer.client_serializer import ClientSerializer
from ..models.clients_models import Client

# Create your views here.
class ClientView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
