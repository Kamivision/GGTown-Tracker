from django.shortcuts import render, get_object_or_404
from .models import Dashboard, Dashboard_item
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import DashboardSerializer
from rest_framework import status as s
from user_app.views import UserView


# Create your views here.
class DashboardView(APIView):
    def get(self, request):
        dashboard = get_object_or_404(Dashboard, user=request.user)
        serializer = DashboardSerializer(dashboard)
        return Response(serializer.data, status=s.HTTP_200_OK)
    
class add_to_dashboard(UserView):
    def put(self, request, Dashboard_item_id):
        dash_item = get_object_or_404(Dashboard_item, id=Dashboard_item_id)
        dash_item.dashboard = get_object_or_404(Dashboard, user=request.user)
        dash_item.save()
        return Response({"message":f"{dash_item.townie.name} added to dashboard"}, status=s.HTTP_200_OK)
    
class remove_from_dashboard(UserView):
    def delete(self, request, Dashboard_item_id):
        dash_item = get_object_or_404(Dashboard_item, id=Dashboard_item_id)
        dash_item.delete()
        return Response({"message":f"{dash_item.townie.name} removed from dashboard"}, status=s.HTTP_204_NO_CONTENT)