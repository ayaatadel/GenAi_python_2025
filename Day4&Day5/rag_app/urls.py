from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('chat/', views.chat, name='chat'),
    path('load-documents/', views.load_documents, name='load_documents'),
    path('collection-info/', views.get_collection_info, name='collection_info'),
] 