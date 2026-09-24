import uuid
from django.db import models
from .clients_models import Client
from .plat_models import Plat

class CommandeStatus(models.TextChoices):
    """
    Statuts d'une commande selon le cahier des charges :
    1. EN_ATTENTE : Commande créée, capture d'écran du paiement Mobile Money reçue mais non vérifiée.
    2. CONFIRMER : Paiement vérifié par l'administrateur. La commande entre dans le compteur.
    3. EN_PREPARATION : La cuisinière a démarré la préparation.
    4. PRETE : Le repas est prêt et emballé pour la livraison de 12h00.
    5. LIVREE : L'étudiant a récupéré son repas.
    6. ANNULEE : Commande annulée (ex: preuve de paiement invalide).
    """
    EN_ATTENTE = "EN_ATTENTE", "En attente de validation"
    CONFIRMER = "CONFIRMER", "Confirmée"
    EN_PREPARATION = "EN_PREPARATION", "En préparation"
    PRETE = "PRETE", "Prête à livrer"
    LIVREE = "LIVREE", "Livrée"
    ANNULEE = "ANNULEE", "Annulée"


class Commande(models.Model):
    """
    Représente une commande effectuée par un étudiant.
    Contient la date de livraison (calculée selon la règle de 22h00),
    la preuve de paiement Mobile Money et le statut du traitement.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='commandes', verbose_name="Étudiant")
    quantity = models.PositiveIntegerField(default=1, verbose_name="Quantité totale de plats")
    total_price = models.FloatField(default=0.0, verbose_name="Montant total (FCFA)")
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date d'enregistrement")
    date_livraison = models.DateField(verbose_name="Date de livraison prévue (12h00)")
    
    status = models.CharField(
        max_length=20,
        choices=CommandeStatus.choices,
        default=CommandeStatus.EN_ATTENTE,
        verbose_name="Statut de la commande"
    )
    
    payment_proof = models.ImageField(upload_to='paiements/', null=True, blank=True, verbose_name="Preuve de paiement Mobile Money")
    payment_verified = models.BooleanField(default=False, verbose_name="Paiement vérifié par l'admin")
    notes = models.TextField(null=True, blank=True, verbose_name="Instructions de livraison / Remarques")

    def __str__(self):
        return f"Commande {str(self.id)[:8]} - {self.client.name} ({self.get_status_display()})"


class CommandePlat(models.Model):
    """
    Table de liaison entre Commande et Plat pour gérer les quantités par plat.
    """
    commande = models.ForeignKey(Commande, on_delete=models.CASCADE, related_name='items')
    plat = models.ForeignKey(Plat, on_delete=models.CASCADE, related_name='commande_items')
    quantity = models.PositiveIntegerField(default=1, verbose_name="Quantité de ce plat")
    unit_price = models.FloatField(default=0.0, verbose_name="Prix unitaire au moment de la commande")

    def get_subtotal(self):
        return self.quantity * self.unit_price

    def __str__(self):
        return f"{self.quantity}x {self.plat.name} (Commande {str(self.commande.id)[:8]})"