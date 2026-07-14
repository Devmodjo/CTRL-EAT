from django.urls import include, path
from ..services.clients_views import ClientListCreateView, ClientRetrieveUpdateDestroyView
from ..services.plats_views import PlatListCreateView, PlatRetrieveUpdateDestroyView

urlpatterns = [
    path('clients/', ClientListCreateView.as_view()),
    path('clients/<uuid:id>/', ClientRetrieveUpdateDestroyView.as_view()),
    path('plats/', PlatListCreateView.as_view()),
    path('plats/<uuid:id>/', PlatRetrieveUpdateDestroyView.as_view())
]