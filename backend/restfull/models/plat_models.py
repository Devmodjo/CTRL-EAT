import uuid
from django.db import models
from django.utils import timezone
import datetime

class Plat(models.Model):
    """
    Modèle représentant un plat disponible au menu de Ctrl+Eat.
    Chaque plat possède un nom, un prix en FCFA, une description, une image et son statut de disponibilité.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Nom du plat")
    details = models.TextField(null=True, blank=True, verbose_name="Description / Ingrédients")
    image = models.ImageField(upload_to='plats/', null=True, blank=True, default=None, verbose_name="Photo du plat")
    price = models.FloatField(verbose_name="Prix en FCFA")
    disponibility = models.BooleanField(default=True, verbose_name="Disponible à la commande")
    createdAt = models.DateTimeField(auto_now_add=True)

    def get_commandes_demain_count(self):
        """
        Calcule le compteur de commandes confirmées/payées pour ce plat pour la livraison de demain.
        Règle du cahier des charges :
        Le compteur = somme des quantités commandées pour un plat
        avec date_livraison = demain (ou date ciblée) et paiement vérifié (ou statut non annulé).
        """
        demain = timezone.now().date() + datetime.timedelta(days=1)
        # Import local pour éviter les imports circulaires
        from .commande_models import Commande, CommandePlat
        
        items = CommandePlat.objects.filter(
            plat=self,
            commande__date_livraison=demain,
            commande__status__in=['CONFIRMER', 'EN_PREPARATION', 'PRETE', 'LIVREE']
        )
        total = sum(item.quantity for item in items)
        return total

    def __str__(self):
        return f"{self.name} - {self.price} FCFA"