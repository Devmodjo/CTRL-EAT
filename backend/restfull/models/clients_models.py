from django.db import models
import uuid

class Client(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, auto_created=True, unique=True, editable=False)
    name = models.CharField(max_length=100, null=False)
    surname = models.CharField(max_length=100, null=False)
    classe = models.CharField(max_length=100, null=False)
    phone = models.CharField(max_length=20, null=False)