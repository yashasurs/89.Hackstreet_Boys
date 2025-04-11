from django.urls import path
from .views import chat_response

app_name = 'chatbot'

urlpatterns = [
    path('chatbot/', chat_response, name='chat_response'),
]