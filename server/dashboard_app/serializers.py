from rest_framework import serializers
from .models import Dashboard, Dashboard_item
from townie_app.serializers import TownieSerializer

class DashboardSerializer(serializers.ModelSerializer):
    dash_townies = TownieSerializer(many=True, read_only=True)
    class Meta:
        model = Dashboard
        fields = ['id', 'dash_townies']