from django import forms
from .models import *

class ReceiptForm(forms.ModelForm):
    class Meta:
        model = Receipt
        fields = ['name', 'image']