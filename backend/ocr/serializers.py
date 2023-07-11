from rest_framework import serializers
from .models import *

class ReceiptSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Receipt
        fields = ['id', 'name', 'image', 'my_expenses', 'created_by']

class ReceiptItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiptItem
        fields = ['id', 'name', 'receipt', 'price', 'quantity', 'assigned_users']