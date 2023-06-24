from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('upload/', views.OCRView.as_view(), name='upload'),
    path('receipt_data/', views.ReceiptDataView.as_view(), name='receipt_data'),
]