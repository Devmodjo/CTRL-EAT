from django.apps import AppConfig


class RestfullConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'restfull'

    
    def ready(self):
        from .models import plat_models, clients_models, commande_models