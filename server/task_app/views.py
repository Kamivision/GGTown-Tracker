from typing import cast

from django.db import transaction
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
	TowniePinCreateSerializer,
	TowniePinSerializer,
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
		serializer = QuestProgressIncrementSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		validated_data = cast(dict[str, int], serializer.validated_data)
		amount = validated_data['amount']
# Was getting a pylance error about current_amount not being defined on quest_progress, even though it is defined on the model. Found a workaround by using transaction.atomic wraps the fetch/update/save in select_for_update, avoiding potential lost updates.
		with transaction.atomic():
			quest_progress = get_object_or_404(
				QuestProgress.objects.select_for_update().select_related('townie'),
				id=quest_progress_id,
				user=request.user,
			)
			quest_progress.current_amount += amount
			quest_progress.save()

		return Response(QuestProgressSerializer(quest_progress).data, status=s.HTTP_200_OK)


class TowniePinListCreate(UserView):
	def get(self, request):
		townie_pins = request.user.townie_pins.select_related('townie')
		return Response(TowniePinSerializer(townie_pins, many=True).data, status=s.HTTP_200_OK)

	def post(self, request):
		serializer = TowniePinCreateSerializer(data=request.data, context={'request': request})
		serializer.is_valid(raise_exception=True)
		townie_pin = serializer.save()
		output = TowniePinSerializer(townie_pin)
		status_code = s.HTTP_201_CREATED if getattr(serializer, 'was_created', False) else s.HTTP_200_OK
		return Response(output.data, status=status_code)


class TowniePinDelete(UserView):
	def delete(self, request, townie_pin_id):
		townie_pin = get_object_or_404(request.user.townie_pins, id=townie_pin_id)
		townie_pin.delete()
		return Response(status=s.HTTP_204_NO_CONTENT)
