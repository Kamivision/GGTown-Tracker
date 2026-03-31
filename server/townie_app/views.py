from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as s
from .models import Townie
from .serializers import TownieSerializer
from dashboard_app.models import Dashboard, Dashboard_item

# Create your views here.
class All_townies(APIView):
    def get(self, request):
        townies = Townie.objects.all()
        return Response(TownieSerializer(townies, many=True).data, status=s.HTTP_200_OK)

class A_townie(APIView):
    def get(self, request, name):
        townie = get_object_or_404(Townie, name=name.title())
        return Response(TownieSerializer(townie).data, status=s.HTTP_200_OK)
    
    def post(self, request, id):
        townie =get_object_or_404(Townie, id=id)
        dashboard = get_object_or_404(Dashboard, user=request.user)
        Dashboard_item.objects.create(dashboard=dashboard, townie=townie)
        return Response({"message":f"{townie.name} added to dashboard"}, status=s.HTTP_201_CREATED)
    
    def delete(self, request, id):
        townie =get_object_or_404(Townie, id=id)
        dashboard = get_object_or_404(Dashboard, user=request.user)
        dash_item = get_object_or_404(Dashboard_item, dashboard=dashboard, townie=townie)
        dash_item.delete()
        return Response({"message":f"{townie.name} removed from dashboard"}, status=s.HTTP_204_NO_CONTENT)

class Townie_by_quest_type(APIView):
    def get(self, request, quest_type):
        townies = Townie.objects.filter(quest_type=quest_type.title())
        return Response(TownieSerializer(townies, many=True).data, status=s.HTTP_200_OK)