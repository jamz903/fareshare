from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Receipt(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='images/')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True)


    def __str__(self):
        return self.name