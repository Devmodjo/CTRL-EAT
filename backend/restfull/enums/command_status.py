from enum import Enum

class CommandStatus(Enum):
    LIVREE = "Livrée"
    ANNULEE = "Annulée"
    EN_ATTENTE = "En attente"
    EN_PREPARATION = "En préparation"
    PRETE = "Prête"
    CONFIRMER = "Confirmer"