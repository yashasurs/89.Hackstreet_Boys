from django.urls import path
from .views import video_links

urlpatterns = [
    path('video-links/', video_links, name='video_links'),
]