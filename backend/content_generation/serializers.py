from rest_framework import serializers
from .models import GeneratedContent

class GeneratedContentSerializer(serializers.ModelSerializer):
    """
    Serializer for the GeneratedContent model.
    """
    class Meta:
        model = GeneratedContent
        fields = ['id', 'topic', 'content', 'difficulty_level', 'created_at', 'updated_at']