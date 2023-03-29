from django.db import models
from django.contrib.auth.models import User

class Channel(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    arn = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.arn