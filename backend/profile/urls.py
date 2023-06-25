from django.urls import path
from .views import GetProfileView, UpdateProfileView

urlpatterns = [
    path('get', GetProfileView.as_view()),
    path('update', UpdateProfileView.as_view()),
]