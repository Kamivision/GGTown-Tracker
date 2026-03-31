from rest_framework import serializers
from townie_app.models import Townie
from .models import QuestProgress


class QuestProgressSerializer(serializers.ModelSerializer):
	townie_id = serializers.IntegerField(source='townie.id', read_only=True)
	townie_name = serializers.CharField(source='townie.name', read_only=True)
	quest_type = serializers.CharField(source='townie.quest_type', read_only=True)
	quest = serializers.CharField(source='townie.quest', read_only=True)
	quest_amount = serializers.CharField(source='townie.quest_amount', read_only=True)
	target_amount = serializers.SerializerMethodField()
	remaining_amount = serializers.SerializerMethodField()
	is_complete = serializers.SerializerMethodField()

	class Meta:
		model = QuestProgress
		fields = [
			'id',
			'townie_id',
			'townie_name',
			'quest_type',
			'quest',
			'quest_amount',
			'target_amount',
			'current_amount',
			'remaining_amount',
			'is_complete',
			'completed_at',
			'created_at',
			'updated_at',
		]
		read_only_fields = fields

	def get_target_amount(self, obj):
		return obj.target_amount

	def get_remaining_amount(self, obj):
		return obj.remaining_amount

	def get_is_complete(self, obj):
		return obj.is_complete


class QuestProgressCreateSerializer(serializers.ModelSerializer):
	townie_id = serializers.PrimaryKeyRelatedField(
		queryset=Townie.objects.all(),
		source='townie',
	)

	class Meta:
		model = QuestProgress
		fields = ['townie_id', 'current_amount']

	def create(self, validated_data):
		user = self.context['request'].user
		quest_progress, created = QuestProgress.objects.get_or_create(
			user=user,
			townie=validated_data['townie'],
			defaults={
				'current_amount': validated_data.get('current_amount', 0),
			},
		)

		if not created and 'current_amount' in validated_data:
			quest_progress.current_amount = validated_data['current_amount']
			quest_progress.save()

		self.was_created = created
		return quest_progress


class QuestProgressAmountSerializer(serializers.ModelSerializer):
	class Meta:
		model = QuestProgress
		fields = ['current_amount']


class QuestProgressIncrementSerializer(serializers.Serializer):
	amount = serializers.IntegerField(min_value=1)
