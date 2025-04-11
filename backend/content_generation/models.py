from django.db import models

class GeneratedContent(models.Model):
    """
    Model to store educational content generated for topics.
    
    This stores the full JSON response from content generation,
    allowing for efficient retrieval of previously generated content.
    """
    topic = models.CharField(max_length=255, db_index=True)
    content = models.JSONField(help_text="The full generated content in JSON format")
    difficulty_level = models.CharField(
        max_length=20, 
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced')
        ],
        default='intermediate'
    )
    user = models.ForeignKey('user_profiles.CustomUser', on_delete=models.CASCADE, related_name='generated_contents')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Generated Content"
        verbose_name_plural = "Generated Contents"
        # Create an index for topic + difficulty for faster lookups
        unique_together = ['topic', 'difficulty_level']
        # Order by most recently created first
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.topic} ({self.difficulty_level})"