from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    name = models.CharField(max_length = 150, blank=True, null=True)
    cell_phone = models.CharField(max_length = 10, blank=True, null=True)
    city = models.CharField(max_length = 50, blank=True, null=True)
    district = models.CharField(max_length = 50, blank=True, null=True)
    address = models.CharField(max_length = 150, blank=True, null=True)

    def __str__(self):
        return self.email
