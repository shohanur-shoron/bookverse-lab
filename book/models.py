from django.contrib.auth.models import User
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    added_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} added by {self.added_by}"