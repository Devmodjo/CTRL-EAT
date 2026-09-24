from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from ..serializer.auth_serializer import RegisterSerializer, UserSerializer
from ..models.clients_models import Client, RoleChoices

def ensure_demo_users_exist():
    """
    Fonction utilitaire qui initialise automatiquement les comptes de test demo pour le back-office:
    - Admin: admin / admin123 (Rôle: ADMINISTRATEUR)
    - Cuisinière: cuisiniere / cuisiniere123 (Rôle: CUISINIERE)
    - Étudiant: etudiant / etudiant123 (Rôle: ETUDIANT)
    """
    # 1. Compte Administrateur Demo
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@ctrleat.cm',
            password='admin',
            first_name='Jodelle',
            last_name='Baleng (Admin)'
        )
        Client.objects.get_or_create(
            user=admin_user,
            defaults={
                'name': 'Jodelle',
                'surname': 'Baleng (Admin)',
                'classe': 'Administration IAI',
                'phone': '699000000',
                'role': RoleChoices.ADMINISTRATEUR
            }
        )

    # 2. Compte Cuisinière Demo
    if not User.objects.filter(username='cuisiniere').exists():
        cook_user = User.objects.create_user(
            username='cuisiniere',
            email='cuisiniere@ctrleat.cm',
            password='cuisiniere',
            first_name='Cuisinière',
            last_name='Chef Ctrl+Eat'
        )
        cook_user.is_staff = True
        cook_user.save()
        Client.objects.get_or_create(
            user=cook_user,
            defaults={
                'name': 'Cuisinière',
                'surname': 'Chef Ctrl+Eat',
                'classe': 'Cuisine Centralisée',
                'phone': '677000000',
                'role': RoleChoices.CUISINIERE
            }
        )

    # 3. Compte Étudiant Demo
    if not User.objects.filter(username='etudiant').exists():
        student_user = User.objects.create_user(
            username='etudiant',
            email='etudiant@iai.cm',
            password='etudiant',
            first_name='Étudiant',
            last_name='IAI Cameroun'
        )
        Client.objects.get_or_create(
            user=student_user,
            defaults={
                'name': 'Étudiant',
                'surname': 'IAI Cameroun',
                'classe': 'L3 GL IAI',
                'phone': '655000000',
                'role': RoleChoices.ETUDIANT
            }
        )


class RegisterView(APIView):
    """
    Endpoint d'inscription pour les étudiants et utilisateurs Ctrl+Eat.
    POST /api/auth/register/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            client = serializer.save()
            user = client.user
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Inscription réussie ! Bienvenue sur Ctrl+Eat.',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BackofficeRegisterView(APIView):
    """
    Endpoint d'inscription réservé au personnel du backoffice (Admin et Cuisinière).
    POST /api/auth/backoffice-register/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        name = request.data.get('name', username)
        surname = request.data.get('surname', '')
        phone = request.data.get('phone', '600000000')
        role = request.data.get('role', RoleChoices.ADMINISTRATEUR)

        if not username or not password:
            return Response({'detail': 'Nom d\'utilisateur et mot de passe requis.'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Cet identifiant existe déjà.'}, status=status.HTTP_400_BAD_REQUEST)

        if role not in [RoleChoices.ADMINISTRATEUR, RoleChoices.CUISINIERE]:
            return Response({'detail': 'Rôle invalide pour le back-office.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=name,
            last_name=surname,
            is_staff=True
        )

        client = Client.objects.create(
            user=user,
            name=name,
            surname=surname,
            classe="Administration / Cuisine",
            phone=phone,
            role=role
        )

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': f'Compte personnel {role} créé avec succès.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    Endpoint de connexion avec génération de jeton JWT et données du profil.
    POST /api/auth/login/
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # S'assurer que les comptes démo existent
        ensure_demo_users_exist()

        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'detail': 'Veuillez fournir un nom d\'utilisateur et un mot de passe.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        
        # Si la connexion par nom d'utilisateur échoue, essayer avec l'email
        if not user:
            try:
                user_obj = User.objects.get(email=username)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if not user:
            return Response(
                {'detail': 'Identifiants invalides. Vérifiez votre nom d\'utilisateur et mot de passe.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # S'assurer que le profil Client existe
        if not hasattr(user, 'profile'):
            role = RoleChoices.ADMINISTRATEUR if (user.is_staff or user.is_superuser) else RoleChoices.ETUDIANT
            Client.objects.create(
                user=user,
                name=user.first_name or user.username,
                surname=user.last_name or '',
                classe="Administration" if user.is_staff else "IAI-Cameroun",
                phone="600000000",
                role=role
            )

        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Connexion réussie.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    Endpoint pour récupérer les informations de l'utilisateur connecté.
    GET /api/auth/me/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
