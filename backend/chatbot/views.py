from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
# from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny, IsAuthenticated
from .utils import ChatBotAgent
import asyncio
import json
import requests
import logging
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

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

# @csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def transcribe_audio(request):
    """
    Transcribe an audio file to text using Deepgram API.
    
    To use with Postman:
    1. Use POST request
    2. Select 'Body' tab and choose 'form-data'
    3. Add a key named 'file' and change type to 'File'
    4. Select your audio file
    """
    try:
        file = request.FILES.get('file')
        
        if not file:
            logger.error("No audio file was uploaded in the request")
            return Response({'error': 'No audio file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
            
        logger.info(f"Received audio file: {file.name}, size: {file.size} bytes, content type: {file.content_type}")
        
        api_key = os.getenv("DEEPGRAM_API_KEY")
        if not api_key:
            logger.error("DEEPGRAM_API_KEY not found in environment variables")
            return Response({'error': 'API configuration error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Using the Deepgram SDK
        from deepgram import DeepgramClient, PrerecordedOptions, FileSource
        
        # Create a Deepgram client using the API key
        deepgram = DeepgramClient(api_key)
        
        # Read file data into buffer
        file_content = file.read()
        
        payload = {
            "buffer": file_content,
        }
        
        # Configure transcription options
        options = PrerecordedOptions(
            model="nova-3",
            smart_format=True,
            punctuate=True,
        )
        
        # Call the transcribe_file method
        logger.info("Sending audio to Deepgram API using SDK")
        response = deepgram.listen.rest.v("1").transcribe_file(payload, options)
        
        # Extract transcript with better error handling
        transcript = ""
        if response.results and response.results.channels:
            if response.results.channels[0].alternatives:
                transcript = response.results.channels[0].alternatives[0].transcript
        
        if not transcript:
            logger.warning("No transcript was generated from the audio file")
            return Response({'transcript': ''})
            
        logger.info(f"Transcription successful, text length: {len(transcript)}")
        return Response({'transcript': transcript})
        
    except Exception as e:
        logger.exception(f"Error during audio transcription: {str(e)}")
        return Response(
            {'error': f'Failed to process audio: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )