from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as s
from .serializers import TownieSerializer, Townie

# Create your views here.
class A_townie(APIView):
    def get(self, request, id):
        townie = get_object_or_404(Townie, id=id)
        return Response(TownieSerializer(townie).data, status=s.HTTP_200_OK)
    
    def post(self, request, id):
        pass
    
    def delete(self, request, id):
        pass
