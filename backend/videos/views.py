from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .utils import YouTubeService

@api_view(['POST'])
@permission_classes([AllowAny])
def video_links(request):
    """
    Fetch YouTube video links based on the provided topic.
    
    Expects a JSON body with 'topic' field.
    Returns a list of video links with title, url, and thumbnail_url.
    """
    # Get the topic from the request data
    topic = request.data.get('topic')
    
    if not topic:
        return Response(
            {'error': 'Please provide a topic in the request body'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Initialize the YouTube service
        youtube_service = YouTubeService()
        
        # Get max_results parameter if provided (default to 5)
        max_results = request.data.get('max_results', 5)
        
        # Search for videos related to the topic
        videos = youtube_service.search_videos(query=topic, max_results=max_results)
        
        # Return the video data
        return Response({
            'topic': topic,
            'videos': videos
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response(
            {'error': f'Error fetching videos: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )