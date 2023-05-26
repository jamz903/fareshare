from django.urls import path
from .views import OCRView

urlpatterns = [
    path('read', OCRView.as_view()),
]