from django.contrib.auth.models import User
from django.db import models
from rest_framework.response import Response
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator

# get user profile
@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class GetProfileView(APIView):
    def get(self, request, format=None):
        try:
            # get user profile
            user = self.request.user
            username = user.username
            display_name = user.profile.display_name
            return Response({'username': username, 'display_name': display_name})
        except:
            return Response({'error': 'Something went wrong when getting profile'})

# update user profile
@method_decorator(csrf_protect, name='dispatch') # ensures csrf protection
class UpdateProfileView(APIView):
    def post(self, request, format=None):
        try:
            data = self.request.data
            display_name = data['display_name']
            # update user profile
            # for now we only update display name, but we can add other settings here
            user = self.request.user
            user.profile.display_name = display_name
            user.profile.save()
            return Response({'success': 'Profile updated successfully'})
        except:
            return Response({'error': 'Something went wrong when updating profile'})