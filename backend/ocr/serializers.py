from rest_framework import serializers
from .models import *

class ReceiptSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Receipt
        fields = ['id', 'name', 'image', 'processed_data', 'created_by']