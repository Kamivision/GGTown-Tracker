from django.shortcuts import get_object_or_404
from rest_framework import status as s
from rest_framework.response import Response
from task_app.models import QuestProgress
from townie_app.models import Townie
from user_app.views import UserView
from .models import Dashboard, Dashboard_item
from .serializers import DashboardSerializer


class DashboardView(UserView):
    def get(self, request):
        dashboard = get_object_or_404(Dashboard, user=request.user)
        serializer = DashboardSerializer(dashboard)
        return Response(serializer.data, status=s.HTTP_200_OK)


class add_to_dashboard(UserView):
    def put(self, request, Dashboard_item_id):
        dash_item = get_object_or_404(Dashboard_item, id=Dashboard_item_id)
        dash_item.dashboard = get_object_or_404(Dashboard, user=request.user)
        dash_item.save()
        return Response(
            {"message": f"{dash_item.townie.name} added to dashboard"},
            status=s.HTTP_200_OK,
        )


class remove_from_dashboard(UserView):
    def delete(self, request, Dashboard_item_id):
        dash_item = get_object_or_404(Dashboard_item, id=Dashboard_item_id)
        dash_item.delete()
        return Response(
            {"message": f"{dash_item.townie.name} removed from dashboard"},
            status=s.HTTP_204_NO_CONTENT,
        )


class TownieChatView(UserView):
    def post(self, request):
        message = request.data.get("message", "").strip()
        if not message:
            return Response(
                {"detail": "Message is required."},
                status=s.HTTP_400_BAD_REQUEST,
            )

        townies = Townie.objects.all()
        tracked_quests = QuestProgress.objects.filter(user=request.user).select_related("townie")

        try:
            from .services.gemini_client import ask_townie_gemini

            reply = ask_townie_gemini(message, townies, tracked_quests)
        except RuntimeError as error:
            return Response(
                {"detail": str(error)},
                status=s.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except Exception as error:
            return Response(
                {"detail": f"Gemini setup error: {error}"},
                status=s.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response({"reply": reply}, status=s.HTTP_200_OK)