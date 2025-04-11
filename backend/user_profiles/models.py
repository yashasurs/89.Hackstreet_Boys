from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    tests_taken = models.PositiveIntegerField(default=0)
    average_score = models.FloatField(default=0.0)
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'