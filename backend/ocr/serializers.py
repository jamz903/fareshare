from rest_framework import serializers
from .models import *

class ReceiptSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    class Meta:
        model = Receipt
        fields = ('id', 'name', 'image', 'my_expenses', 'created_by')

class ReceiptItemSerializer(serializers.ModelSerializer):
    assignees = serializers.StringRelatedField(many=True)
    receipt = serializers.PrimaryKeyRelatedField(queryset=Receipt.objects.all())

    class Meta:
        model = ReceiptItem
        fields = ('id', 'name', 'receipt', 'price', 'quantity', 'assignees')
        # this will serialise to {
        #   'id': 1,                             # receipt item id
        #   'name': 'receipt item name',
        #   'receipt': 1,                        # receipt id
        #   'price': 1.0,
        #   'quantity': 1,
        #   'assigned_users': ['user1', 'user2'] # list of usernames
        # }

