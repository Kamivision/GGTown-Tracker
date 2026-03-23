from rest_framework.serializers import ModelSerializer
from .models import Townie

class TownieSerializer(ModelSerializer):
    class Meta:
        model = Townie
        fields = ['id', 'name', 'quest_type', 'quest', 'quest_amount']