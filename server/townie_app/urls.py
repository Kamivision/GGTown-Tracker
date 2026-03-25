from django.urls import path
from .views import All_townies, A_townie, Townie_by_quest_type

urlpatterns = [
    path('', All_townies.as_view(), name='all_townies'),
    path('<str:name>/', A_townie.as_view(), name='a_townie'),
    path('quest-type/<str:quest_type>/', Townie_by_quest_type.as_view(), name='by_quest_type'), 
]