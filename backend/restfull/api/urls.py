from django.urls import path
from ..services.clients_views import ClientListCreateView, ClientRetrieveUpdateDestroyView
from ..services.plats_views import PlatListCreateView, PlatRetrieveUpdateDestroyView, PlatCompteurView
from ..services.command_views import (
    CommandListCreateView,
    CommandRetreiveUpdateDestroyView,
    UploadPaymentProofView,
    ValiderPaiementView,
    CuisiniereRecapView
)
from ..services.auth_views import RegisterView, BackofficeRegisterView, LoginView, MeView

urlpatterns = [
    # Authentification & Utilisateurs
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/backoffice-register/', BackofficeRegisterView.as_view(), name='auth-backoffice-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/me/', MeView.as_view(), name='auth-me'),

    # Gestion des clients / profils
    path('clients/', ClientListCreateView.as_view(), name='client-list-create'),
    path('clients/<uuid:id>/', ClientRetrieveUpdateDestroyView.as_view(), name='client-detail'),

    # Menu & Plats
    path('plats/', PlatListCreateView.as_view(), name='plat-list-create'),
    path('plats/compteurs/', PlatCompteurView.as_view(), name='plat-compteurs'),
    path('plats/<uuid:id>/', PlatRetrieveUpdateDestroyView.as_view(), name='plat-detail'),

    # Commandes
    path('commande/', CommandListCreateView.as_view(), name='commande-list-create'),
    path('commande/<uuid:id>/', CommandRetreiveUpdateDestroyView.as_view(), name='commande-detail'),
    path('commande/<uuid:id>/upload-preuve/', UploadPaymentProofView.as_view(), name='commande-upload-preuve'),
    path('commande/<uuid:id>/valider-paiement/', ValiderPaiementView.as_view(), name='commande-valider-paiement'),

    # Espace Cuisinière
    path('cuisiniere/recap/', CuisiniereRecapView.as_view(), name='cuisiniere-recap'),
]