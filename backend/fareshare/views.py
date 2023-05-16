from django.shortcuts import render
from rest_framework import viewsets
from .serializers import RegisterSerializer
from .models import Register

# Create your views here.
class RegisterView(viewsets.ModelViewSet):
    serializer_class = RegisterSerializer
    queryset = Register.objects.all()