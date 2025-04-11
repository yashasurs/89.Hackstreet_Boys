from rest_framework import serializers

class ChatbotMessageSerializer(serializers.Serializer):
    """Serializer for chatbot messages."""
    message = serializers.CharField(required=True, help_text="The user's message to the chatbot")
    use_structured_response = serializers.BooleanField(
        required=False, 
        default=True, 
        help_text="Whether to use structured responses with citations and follow-up questions"
    )