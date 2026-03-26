from django.db import models

# Create your models here.
class Dashboard(models.Model):
    user = models.OneToOneField('user_app.AppUser', on_delete=models.CASCADE, related_name='dashboard', null=True)
    
class Dashboard_item(models.Model):
    dashboard = models.ForeignKey(Dashboard, on_delete=models.CASCADE, related_name='dash_items', null=True)
    townie = models.ForeignKey('townie_app.Townie', on_delete=models.CASCADE, related_name='dash_townie')