# videos/youtube_service.py
import os
# import django, sys
from dotenv import load_dotenv
import googleapiclient.discovery

# Add parent directory to path so Python can find the core module
# sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
# Set up Django settings
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
# django.setup()

# from django.conf import settings

load_dotenv()

class YouTubeService:
    def __init__(self):
        # self.api_key = settings.YOUTUBE_API_KEY
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        self.youtube = googleapiclient.discovery.build(
            "youtube", "v3", developerKey=self.api_key
        )
    
    def search_videos(self, query, max_results=5):
        """Search for YouTube videos related to the query"""
        try:
            search_response = self.youtube.search().list(
                q=query,
                part="snippet",
                type="video",
                maxResults=max_results
            ).execute()
            
            videos = []
            for item in search_response.get("items", []):
                video_id = item["id"]["videoId"]
                video_data = {
                    "title": item["snippet"]["title"],
                    "url": f"https://www.youtube.com/watch?v={video_id}",
                    "thumbnail_url": item["snippet"]["thumbnails"]["high"]["url"]
                }
                videos.append(video_data)
            
            return videos
        except Exception as e:
            print(f"Error searching YouTube: {e}")
            return []

# Test block to run the function when the script is executed directly
if __name__ == "__main__":
    service = YouTubeService()
    topic = "Ray Optics"  # Example topic
    print(f"Searching YouTube for: {topic}")
    results = service.search_videos(topic)
    for idx, video in enumerate(results, start=1):
        print(f"\nVideo {idx}:")
        print(f"Title: {video['title']}")
        print(f"URL: {video['url']}")
        print(f"Thumbnail: {video['thumbnail_url']}")