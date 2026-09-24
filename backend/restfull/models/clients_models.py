import uuid
from django.db import models
from django.contrib.auth.models import User

class RoleChoices(models.TextChoices):
    """
    Rôles des utilisateurs dans la plateforme Ctrl+Eat:
    - ETUDIANT: Peut consulter les plats, passer des commandes et suivre l'état.
    - CUISINIERE: Prépare les repas, consulte le récapitulatif cumulé par plat.
    - ADMINISTRATEUR: Gère la plateforme, les plats, et valide les paiements Mobile Money.
    """
    ETUDIANT = "ETUDIANT", "Étudiant"
    CUISINIERE = "CUISINIERE", "Cuisinière"
    ADMINISTRATEUR = "ADMINISTRATEUR", "Administrateur"


class Client(models.Model):
    """
    Profil d'utilisateur étendu pour Ctrl+Eat.
    Lié au modèle User natif de Django pour l'authentification et les mots de passe.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', null=True, blank=True)
    name = models.CharField(max_length=100, verbose_name="Nom")
    surname = models.CharField(max_length=100, verbose_name="Prénom")
    classe = models.CharField(max_length=100, verbose_name="Classe / Filière (ex: L3 GL)", default="IAI-Cameroun")
    phone = models.CharField(max_length=20, verbose_name="Numéro de téléphone / Mobile Money")
    role = models.CharField(
        max_length=30,
        choices=RoleChoices.choices,
        default=RoleChoices.ETUDIANT,
        verbose_name="Rôle dans l'application"
    )
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} {self.surname} ({self.get_role_display()})"