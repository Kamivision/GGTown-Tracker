from django.shortcuts import get_object_or_404
from rest_framework import status as s
from rest_framework.response import Response

from user_app.views import UserView

from .models import QuestProgress
from .serializers import (
	QuestProgressAmountSerializer,
	QuestProgressCreateSerializer,
	QuestProgressIncrementSerializer,
	QuestProgressSerializer,
)


class QuestProgressListCreateView(UserView):
	def get(self, request):
		quest_progress = QuestProgress.objects.filter(user=request.user).select_related('townie')
		return Response(QuestProgressSerializer(quest_progress, many=True).data, status=s.HTTP_200_OK)

	def post(self, request):
		serializer = QuestProgressCreateSerializer(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		quest_progress = serializer.save()
		output = QuestProgressSerializer(quest_progress)
		status_code = s.HTTP_201_CREATED if getattr(serializer, 'was_created', False) else s.HTTP_200_OK
		return Response(output.data, status=status_code)


class QuestProgressDetailView(UserView):
	def patch(self, request, quest_progress_id):
		quest_progress = get_object_or_404(
			QuestProgress.objects.select_related('townie'),
			id=quest_progress_id,
			user=request.user,
		)
		serializer = QuestProgressAmountSerializer(quest_progress, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(QuestProgressSerializer(quest_progress).data, status=s.HTTP_200_OK)

	def delete(self, request, quest_progress_id):
		quest_progress = get_object_or_404(QuestProgress, id=quest_progress_id, user=request.user)
		quest_progress.delete()
		return Response(status=s.HTTP_204_NO_CONTENT)


class QuestProgressIncrementView(UserView):
	def post(self, request, quest_progress_id):
		quest_progress = get_object_or_404(
			QuestProgress.objects.select_related('townie'),
			id=quest_progress_id,
			user=request.user,
		)
		serializer = QuestProgressIncrementSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		quest_progress.current_amount += serializer.validated_data['amount']
		quest_progress.save()
		return Response(QuestProgressSerializer(quest_progress).data, status=s.HTTP_200_OK)
