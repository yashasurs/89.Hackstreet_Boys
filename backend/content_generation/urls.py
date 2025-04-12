from django.urls import path
from .views import generate_content, generate_questions, user_contents, generate_and_download_pdf, translate_content_view

urlpatterns = [
    path('generate-content/', generate_content, name='generate_content'),
    path('generate-questions/', generate_questions, name='generate_questions'),
    path('user-contents/', user_contents, name='user_contents'),
    path('generate-lesson-pdf/', generate_and_download_pdf, name='generate_lesson_pdf'),
    path('translate-content/', translate_content_view, name='translate_content'),
]