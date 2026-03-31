from django.contrib import admin

from .models import QuestProgress


@admin.register(QuestProgress)
class QuestProgressAdmin(admin.ModelAdmin):
	list_display = ('user', 'townie', 'current_amount', 'completed_at', 'updated_at')
	search_fields = ('user__email', 'townie__name', 'townie__quest')
