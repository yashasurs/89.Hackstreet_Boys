from django.urls import path
from .views import generate_content, generate_questions, user_contents

urlpatterns = [
    path('generate-content/', generate_content, name='generate_content'),
    path('generate-questions/', generate_questions, name='generate_questions'),
    path('user-contents/', user_contents, name='user_contents'),
]