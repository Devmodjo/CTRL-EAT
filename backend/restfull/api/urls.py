from django.urls import include, path
from ..services.clients_views import ClientView

urlpatterns = [
    path('clients/', ClientView.as_view())
]