from django.db import models

# Create your models here.

# whenever you need to create a model:
# 1. create a class that inherits from models.Model (like below)
# 2. create migration file: python manage.py makemigrations
# 3. apply the changes to the database: python manage.py migrate

# this is just a dummy model, you can delete it
class Register(models.Model):
    name = models.CharField(max_length=120)
    password = models.TextField()

    def _str_(self):
        return self.name
    
