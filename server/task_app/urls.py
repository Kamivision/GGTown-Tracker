from django.urls import path

from .views import (
	QuestProgressDetailView,
	QuestProgressIncrementView,
	QuestProgressListCreateView,
	TowniePinDelete,
	TowniePinListCreate,
)


urlpatterns = [
	path('pins/', TowniePinListCreate.as_view(), name='townie_pin_list_create'),
	path('pins/<int:townie_pin_id>/', TowniePinDelete.as_view(), name='townie_pin_delete'),
	path('', QuestProgressListCreateView.as_view(), name='quest_progress_list_create'),
	path('<int:quest_progress_id>/', QuestProgressDetailView.as_view(), name='quest_progress_detail'),
	path(
		'<int:quest_progress_id>/increment/',
		QuestProgressIncrementView.as_view(),
		name='quest_progress_increment',
	),
]
