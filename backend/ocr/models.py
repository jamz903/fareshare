from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Receipt(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/')
    # processed_data = models.CharField(max_length=2000,null=True,blank=True)
    my_expenses = models.FloatField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)

    def save_model(self, request, obj, form, change):
        obj.created_by = request.user
        super().save_model(request, obj, form, change)

    def __str__(self):
        return self.name
    
class ReceiptItem(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE)
    price = models.FloatField()
    quantity = models.IntegerField()
    assignees = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.name