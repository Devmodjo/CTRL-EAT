from django.db import models
import uuid

class Commande(models.Model):
    class CommandStatus(models.TextChoices):
        LIVREE = "LIVREE", "Livrée"
        ANNULEE = "ANNULEE", "Annulée"
        EN_ATTENTE = "EN_ATTENTE", "En attente"
        EN_PREPARATION = "EN_PREPARATION", "En préparation"
        PRETE = "PRETE", "Prête"
        CONFIRMER = "CONFIRMER", "Confirmer"
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quantity = models.PositiveIntegerField(null=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_livraison = models.DateTimeField() 
    status = models.CharField(
        max_length=20,
        choices=CommandStatus.choices,
        default=CommandStatus.EN_ATTENTE
    )
    
    def get_id(self):
        return str(self.id)
    
    def get_quantity(self):
        return self.quantity
    
    def get_date_creation(self):
        return self.date_creation
    
    def get_date_livraison(self):
        return self.date_livraison
    
    def get_status(self):
        return self.status
    
    def __str__(self):
        return f"Commande {self.id} - {self.get_status_display()}"