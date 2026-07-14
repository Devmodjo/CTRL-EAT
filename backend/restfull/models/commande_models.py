from django.db import models
from ..enums import command_status
import uuid

class Commande(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quantity = models.PositiveIntegerField(null=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    date_livraision = models.DateTimeField()
    #status = models.TextChoices(value=command_status, name='CommandStatus')
    
    def get_id(self):
        return str(self.id)
    
    def get_quantity(self):
        return self.quantity
    
    def get_date_creation(self):
        return self.date_creation
    
    def get_date_livraison(self):
        return self.date_livraision
    
    def get_status(self):
        return self.status