from django.contrib.auth.models import User
from django.db import models

# defining a profile model for each user
class Profile(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    display_name = models.CharField(max_length=50, blank=True)
    friends = models.ManyToManyField(User, related_name='friends', blank=True)
    # add other settings here if needed
    # e.g. profile picture, etc.

    def __str__(self):
        return self.user.username + "'s profile"