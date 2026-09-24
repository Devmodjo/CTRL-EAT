from django.contrib import admin
from .models import Client, Plat, Commande, CommandePlat

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'surname', 'classe', 'phone', 'role', 'date_creation')
    list_filter = ('role', 'classe')
    search_fields = ('name', 'surname', 'phone', 'classe')


@admin.register(Plat)
class PlatAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'disponibility', 'createdAt')
    list_filter = ('disponibility',)
    search_fields = ('name', 'details')


class CommandePlatInline(admin.TabularInline):
    model = CommandePlat
    extra = 1


@admin.register(Commande)
class CommandeAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'quantity', 'total_price', 'date_livraison', 'status', 'payment_verified', 'date_creation')
    list_filter = ('status', 'payment_verified', 'date_livraison')
    search_fields = ('client__name', 'client__surname', 'client__phone')
    inlines = [CommandePlatInline]
