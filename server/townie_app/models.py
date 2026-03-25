from django.db import models

# Create your models here.
class Townie(models.Model):
    name = models.CharField(max_length=255, default='townie')
    quest_type = models.CharField(max_length=255, default='other')
    quest = models.CharField(max_length=255, default='unknown')
    quest_amount = models.CharField(max_length=255, default='1')
    original_quest = models.CharField(max_length=255, default='unknown')