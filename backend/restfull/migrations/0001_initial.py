import uuid
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, verbose_name='Nom')),
                ('surname', models.CharField(max_length=100, verbose_name='Prénom')),
                ('classe', models.CharField(default='IAI-Cameroun', max_length=100, verbose_name='Classe / Filière (ex: L3 GL)')),
                ('phone', models.CharField(max_length=20, verbose_name='Numéro de téléphone / Mobile Money')),
                ('role', models.CharField(choices=[('ETUDIANT', 'Étudiant'), ('CUISINIERE', 'Cuisinière'), ('ADMINISTRATEUR', 'Administrateur')], default='ETUDIANT', max_length=30, verbose_name="Rôle dans l'application")),
                ('date_creation', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Plat',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100, verbose_name='Nom du plat')),
                ('details', models.TextField(blank=True, null=True, verbose_name='Description / Ingrédients')),
                ('image', models.ImageField(blank=True, default=None, null=True, upload_to='plats/', verbose_name='Photo du plat')),
                ('price', models.FloatField(verbose_name='Prix en FCFA')),
                ('disponibility', models.BooleanField(default=True, verbose_name='Disponible à la commande')),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Commande',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('quantity', models.PositiveIntegerField(default=1, verbose_name='Quantité totale de plats')),
                ('total_price', models.FloatField(default=0.0, verbose_name='Montant total (FCFA)')),
                ('date_creation', models.DateTimeField(auto_now_add=True, verbose_name="Date d'enregistrement")),
                ('date_livraison', models.DateField(verbose_name='Date de livraison prévue (12h00)')),
                ('status', models.CharField(choices=[('EN_ATTENTE', 'En attente de validation'), ('CONFIRMER', 'Confirmée'), ('EN_PREPARATION', 'En préparation'), ('PRETE', 'Prête à livrer'), ('LIVREE', 'Livrée'), ('ANNULEE', 'Annulée')], default='EN_ATTENTE', max_length=20, verbose_name='Statut de la commande')),
                ('payment_proof', models.ImageField(blank=True, null=True, upload_to='paiements/', verbose_name='Preuve de paiement Mobile Money')),
                ('payment_verified', models.BooleanField(default=False, verbose_name="Paiement vérifié par l'admin")),
                ('notes', models.TextField(blank=True, null=True, verbose_name='Instructions de livraison / Remarques')),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commandes', to='restfull.client', verbose_name='Étudiant')),
            ],
        ),
        migrations.CreateModel(
            name='CommandePlat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(default=1, verbose_name='Quantité de ce plat')),
                ('unit_price', models.FloatField(default=0.0, verbose_name='Prix unitaire au moment de la commande')),
                ('commande', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='restfull.commande')),
                ('plat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='commande_items', to='restfull.plat')),
            ],
        ),
    ]
