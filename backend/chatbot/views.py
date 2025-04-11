from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from .utils import ChatBotAgent
import asyncio
import json
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def chat_response(request):
    """
    Process a chat request and generate a response.
    
    Expected POST data:
    {
        "question": "The user's question",
        "content": "Optional content for context" (optional)
    }
    """
    try:
        # Get data from request
        data = request.data
        question = data.get('question', '')
        content = data.get('content', None)
        
        if not question:
            return Response(
                {"error": "Question is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create an instance of the ChatBotAgent
        agent = ChatBotAgent()
        
        # Generate response using event loop
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        chat_response = loop.run_until_complete(
            agent.generate_response(question=question, content=content)
        )
        loop.close()

        # Convert the Pydantic model to a dictionary
        response_data = json.loads(chat_response.json())
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Error generating chat response: {str(e)}")
        return Response(
            {"error": f"Failed to generate response: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

