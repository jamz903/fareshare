from django.contrib.auth.models import User
from django.db import models

# friend request model
class FriendRequest(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver')
    
    def __str__(self):
        return self.sender.username + " sent a friend request to " + self.receiver.username