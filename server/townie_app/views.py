from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as s
from .serializers import TownieSerializer, Townie

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
        pass
    
    def delete(self, request, id):
        pass

class Townie_by_quest_type(APIView):
    def get(self, request, quest_type):
        townies = Townie.objects.filter(quest_type=quest_type.title())
        return Response(TownieSerializer(townies, many=True).data, status=s.HTTP_200_OK)