import uuid
from django.db import models


class Plat(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4(), editable=False)
    name = models.CharField(max_length=100, null=False)
    details = models.TextField(null=True)
    image = models.ImageField(upload_to='plats/', null=True, blank=True, default=None)
    price = models.FloatField(null=False)
    disponibility = models.BooleanField(default=True)

    
    def get_id(self):
        return str(self.id)
    
    def get_name(self):
        return self.name
    
    def get_details(self):
        return self.details
    
    def get_image(self):
        return self.image.url if self.image else None
    
    def get_price(self):
        return self.price
    
    def get_disponibility(self):
        return self.disponibility