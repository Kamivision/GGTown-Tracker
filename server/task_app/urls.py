from django.urls import path

from .views import (
	QuestProgressDetailView,
	QuestProgressIncrementView,
	QuestProgressListCreateView,
)


urlpatterns = [
	path('', QuestProgressListCreateView.as_view(), name='quest_progress_list_create'),
	path('<int:quest_progress_id>/', QuestProgressDetailView.as_view(), name='quest_progress_detail'),
	path(
		'<int:quest_progress_id>/increment/',
		QuestProgressIncrementView.as_view(),
		name='quest_progress_increment',
	),
]
