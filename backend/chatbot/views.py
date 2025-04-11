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

# Helper function to get or create an event loop safely
def get_or_create_eventloop():
    try:
        return asyncio.get_event_loop()
    except RuntimeError as ex:
        if "There is no current event loop in thread" in str(ex):
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            return loop
        raise

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
        
        # Try to use the existing event loop safely
        try:
            # Get the current event loop or create a new one if needed
            loop = get_or_create_eventloop()
            chat_response = loop.run_until_complete(
                agent.generate_response(question=question, content=content)
            )
        except Exception as loop_error:
            # If there's an event loop error, create a new one and try again
            if "Event loop is closed" in str(loop_error):
                logger.info("Event loop was closed. Creating a new one...")
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                chat_response = loop.run_until_complete(
                    agent.generate_response(question=question, content=content)
                )
            else:
                # Re-raise if it's not an event loop issue
                raise

        # Convert the Pydantic model to a dictionary
        response_data = json.loads(chat_response.json())
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Error generating chat response: {str(e)}")
        return Response(
            {"error": f"Failed to generate response: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

