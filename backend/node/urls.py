from django.urls import path
from .views import NodeListCreateView, NodeDetailView

urlpatterns = [
    path('nodes/', NodeListCreateView.as_view(), name='node-list-create'),
    path('node/<int:pk>', NodeDetailView.as_view(), name='node-detail'),
]