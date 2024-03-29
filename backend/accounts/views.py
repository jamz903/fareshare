from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.response import Response
from django.contrib import auth
from django.contrib.auth.models import User # use Django's built-in user model
from profile.models import Profile
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from rest_framework import status

@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        try:
            # check if user is authenticated
            user  = self.request.user
            is_authenticated = user.is_authenticated
            if is_authenticated:
                return Response({'is_authenticated': True, 'username': user.username})
            else:
                return Response({'is_authenticated': False})
        except:
            return Response({ 'error': 'Something went wrong when checking authentication' }, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class SignupView(APIView):
    # set permission exception for non-authenticated users to access this view
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        try:
            data = self.request.data

            username = data['username']
            password = data['password']
            re_password = data['re_password']

            # check if passwords match
            if password != re_password:
                return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
            # check if password > 6 characters
            elif len(password) < 6:
                return Response({'error': 'Password must be at least 6 characters'}, status=status.HTTP_400_BAD_REQUEST)
            # check if username already exists
            elif User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_409_CONFLICT)
            # create user
            else:
                User.objects.create_user(username=username, password=password)
                # create user profile in database
                newProfile = Profile(user=User.objects.get(username=username))
                newProfile.save()
                # login user
                user = auth.authenticate(username=username, password=password)
                auth.login(request, user)
                return Response({'success': 'User registered and authenticated', 'username': username}, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Something went wrong when registering account'}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        try:
            data = self.request.data

            username = data['username']
            password = data['password']

            user = auth.authenticate(username=username, password=password)

            # check if user exists
            if user is None:
                return Response({'error': 'The username and/or password are invalid.'}, status=status.HTTP_404_NOT_FOUND)
            else:
                auth.login(request, user)
                return Response({'success': 'User authenticated', 'username': username})
        except:
            return Response({'error': 'Something went wrong when logging in'}, status=status.HTTP_404_NOT_FOUND)
        
# user is already authenticated, so no need to check for csrf protection
class LogoutView(APIView):
    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({'success': 'User logged out'})
        except:
            return Response({'error': 'Something went wrong when logging out'}, status=status.HTTP_404_NOT_FOUND)

# user is already authenticated, so no need to check for csrf protection   
class DeleteAccountView(APIView):
    def delete(self, request, format=None):
        try:
            user = request.user
            user.delete()
            return Response({'success': 'User deleted'})
        except:
            return Response({'error': 'Something went wrong when deleting user'}, status=status.HTTP_404_NOT_FOUND)
                
@method_decorator(ensure_csrf_cookie, name='dispatch') # ensures csrf cookie is set 
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None):
        return Response({'success': 'CSRF cookie set'})