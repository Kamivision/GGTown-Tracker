from rest_framework.serializers import ModelSerializer
from .models import Townie

class TownieSerializer(ModelSerializer):
    class Meta:
        model = Townie
        fields = '__all__'