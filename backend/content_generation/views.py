from adrf.decorators import api_view as drf_api_view
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .content_generation import generate_content_for_topic
from .question_generation import QuestionGeneratorAgent
from .translater import TranslaterAgent
from .models import GeneratedContent
from .serializers import GeneratedContentSerializer
from .utils import generate_lesson_pdf_from_topic
import json
import logging
import asyncio

# Set up logging
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
def generate_content(request):
    """
    Generate educational content based on a provided topic.
    
    Expected POST data:
    {
        "topic": "The topic to generate content for",
        "difficulty": "beginner|intermediate|advanced" (optional)
    }
    
    If the content for a topic with the specified difficulty level already exists
    for the current user, it will be retrieved from the database instead of generating new content.
    """
    try:
        # Extract data from request
        data = request.data
        topic = data.get('topic')
        
        # Validate input
        if not topic:
            return Response(
                {"error": "A topic is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get optional difficulty parameter (default to intermediate)
        difficulty = data.get('difficulty', 'intermediate')
        
        # Validate difficulty
        valid_difficulties = ["beginner", "intermediate", "advanced"]
        if difficulty.lower() not in valid_difficulties:
            return Response(
                {"error": f"Difficulty must be one of: {', '.join(valid_difficulties)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Check if content already exists for this topic and difficulty
        try:
            existing_content = GeneratedContent.objects.get(
                topic=topic,
                difficulty_level=difficulty.lower(),
                user=request.user
            )
            logger.info(f"Retrieved existing content for topic: '{topic}' at {difficulty} level")
            return Response(existing_content.content, status=status.HTTP_200_OK)
        except GeneratedContent.DoesNotExist:
            # Generate new content if it doesn't exist
            logger.info(f"Generating new content for topic: '{topic}' at {difficulty} level")
            content = generate_content_for_topic(topic, difficulty.lower())
            
            # Store the generated content in the database
            new_content = GeneratedContent(
                topic=topic,
                content=content,
                difficulty_level=difficulty.lower(),
                user=request.user
            )
            new_content.save()
            logger.info(f"Saved new content to database for topic: '{topic}'")
            
            # Return the generated content
            return Response(content, status=status.HTTP_200_OK)
        
    except ValueError as e:
        # Handle expected errors from content generation
        logger.error(f"Content generation error: {str(e)}")
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        # Handle unexpected errors
        logger.exception(f"Unexpected error in generate_content view: {str(e)}")
        return Response(
            {"error": "An unexpected error occurred"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@drf_api_view(['POST'])
@permission_classes([AllowAny])
async def generate_questions(request):
    """
    Generate multiple-choice questions based on provided content.
    
    Expected POST data:
    {
        "content": "The content to generate questions from",
        "num_questions": 5, (5 by default)
        "difficulty": "beginner|intermediate|advanced" (optional)
    }
    """
    try:
        agent = QuestionGeneratorAgent()
        data = request.data
        content = data.get('content', '')
        num_questions = data.get('num_questions', 5)
        difficulty = data.get('difficulty', 'easy')
        
        # Try to use the existing event loop safely
        try:
            # Get the current event loop or create a new one if needed
            loop = get_or_create_eventloop()
            questions = await agent.generate_questions(
                str(content),
                num_questions=num_questions,
                difficulty=difficulty
            )
        except Exception as loop_error:
            # If there's an event loop error, create a new one and try again
            if "Event loop is closed" in str(loop_error):
                logger.info("Event loop was closed. Creating a new one...")
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                questions = await agent.generate_questions(
                    str(content),
                    num_questions=num_questions,
                    difficulty=difficulty
                )
            else:
                # Re-raise if it's not an event loop issue
                raise
        
        # Convert each ResponseQuestions object to a dictionary
        serialized_questions = []
        for question in questions:
            # Determine the answer string based on the selected option
            if question.answer_option.lower() == 'a':
                answer_text = question.option_a
            elif question.answer_option.lower() == 'b':
                answer_text = question.option_b
            elif question.answer_option.lower() == 'c':
                answer_text = question.option_c
            elif question.answer_option.lower() == 'd':
                answer_text = question.option_d
            else:
                answer_text = ""
                
            question_dict = {
                'question': question.question,
                'option_a': question.option_a,
                'option_b': question.option_b,
                'option_c': question.option_c,
                'option_d': question.option_d,
                'answer_option': question.answer_option,
                'answer_string': answer_text
            }
            serialized_questions.append(question_dict)
        
        # Return the serialized questions
        return Response({"questions": serialized_questions}, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Error generating questions: {str(e)}")
        return Response(
            {"error": f"Failed to generate questions: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_contents(request):
    """
    Retrieve all GeneratedContent objects related to the authenticated user.
    
    This endpoint returns all educational content generated by the current user.
    """
    try:
        # Get the current authenticated user
        user = request.user
        
        # Retrieve all GeneratedContent objects for this user
        contents = GeneratedContent.objects.filter(user=user)
        
        # Serialize the data
        serializer = GeneratedContentSerializer(contents, many=True)
        
        # Return the serialized data
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Error retrieving user contents: {str(e)}")
        return Response(
            {"error": f"Failed to retrieve content: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_and_download_pdf(request):
    try:
        # Try to safely get the request data
        try:
            data = request.data
            # Log the request data type for debugging
            logger.info(f"Request data type: {type(data)}")
        except Exception as data_error:
            logger.warning(f"Error parsing request data: {str(data_error)}")
            # If we can't parse the data, use an empty dict
            data = {}
        
        # Directly extract fields from the root of the JSON with default values
        topic = data.get("topic", "Untitled Lesson") if isinstance(data, dict) else "Untitled Lesson"
        summary = data.get("summary", "No summary provided.") if isinstance(data, dict) else "No summary provided."
        
        # Handle sections with careful validation
        if isinstance(data, dict) and isinstance(data.get("sections"), list):
            sections = data.get("sections")
        else:
            sections = [{"title": "Empty Section", "content": "No content available.", "key_points": ["No key points available."]}]
            
        # Handle references with careful validation
        if isinstance(data, dict) and isinstance(data.get("references"), list):
            references = data.get("references")
        else:
            references = ["No references provided."]
            
        difficulty_level = data.get("difficulty_level", "intermediate") if isinstance(data, dict) else "intermediate"
        
        # Handle questions with careful validation
        if isinstance(data, dict) and isinstance(data.get("questions"), list):
            questions = data.get("questions")
        else:
            questions = []

        # Log what we extracted
        logger.info(f"Extracted fields - topic: {topic}, summary: {summary[:50]}..., " +
                   f"sections count: {len(sections)}, references count: {len(references)}, " +
                   f"difficulty_level: {difficulty_level}, questions count: {len(questions)}")

        # Build content_json for the PDF function
        content_json = {
            "summary": summary,
            "sections": sections,
            "references": references,
            "difficulty_level": difficulty_level
        }

        # Transform question data if needed to match expected format
        if questions:
            for q in questions:
                if isinstance(q, dict) and 'answer_option' in q and 'answer' not in q:
                    q['answer'] = q['answer_option'].lower()

        return generate_lesson_pdf_from_topic(topic, content_json, questions)

    except Exception as e:
        logger.exception(f"PDF generation error: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@drf_api_view(['POST'])
@permission_classes([IsAuthenticated])
async def translate_content_view(request):
    """
    Translate educational content into Hindi or Kannada.
    
    Expected POST data:
    {
        "content": {
            "topic": "Topic title",
            "summary": "Content summary",
            "sections": [...],
            "references": [...],
            "difficulty_level": "beginner|intermediate|advanced"
        },
        "language": "hindi" or "kannada" (optional, defaults to "hindi")
    }
    
    Returns translation of the content in the specified language.
    """
    try:
        # Extract data from request
        data = request.data
        
        # Validate input
        if not data:
            return Response(
                {"error": "Request body cannot be empty"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract content and language from request
        content = data.get('content', data)  # If 'content' key doesn't exist, use entire data object
        language = data.get('language', 'hindi').lower()
        
        # Create an instance of the TranslaterAgent
        agent = TranslaterAgent()
        
        # Perform translation
        logger.info(f"Starting translation to {language}...")
        try:
            # Get translation response
            translation = await agent.translate_content(content, language)
            logger.info(f"Translation to {language} completed successfully")
            
            # Return the translated content directly from the response
            return Response(translation.translated_content, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            return Response(
                {"error": f"Translation failed: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    except Exception as e:
        logger.exception(f"Error in translate_content_view: {str(e)}")
        return Response(
            {"error": f"Failed to process translation request: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

