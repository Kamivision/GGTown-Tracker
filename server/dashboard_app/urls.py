from django.urls import path
from .views import DashboardView, TownieChatView, add_to_dashboard, remove_from_dashboard

urlpatterns = [
    path('', DashboardView.as_view(), name='dashboard'),
    path('add/<int:Dashboard_item_id>/', add_to_dashboard.as_view(), name='add_to_dashboard'),
    path('remove/<int:Dashboard_item_id>/', remove_from_dashboard.as_view(), name='remove_from_dashboard'), 
    path("chat/", TownieChatView.as_view(), name="townie_chat"), 
]