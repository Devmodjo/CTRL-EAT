from django.db import models
from ..enums import command_status
import uuid

class Commande(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    quantity = models.PositiveIntegerField(null=False)
    date_creation = models.DateTimeField()
    date_livraision = models.DateTimeField()
    status = models.TextChoices(value=command_status, name='CommandStatus')