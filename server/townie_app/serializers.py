from rest_framework.serializers import ModelSerializer
from .models import Townie

class TownieSerializer(ModelSerializer):
    class Meta:
        model = Townie
        fields = ['name', 'quest_type', 'quest_amount', 'quest']