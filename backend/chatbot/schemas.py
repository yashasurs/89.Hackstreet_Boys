from pydantic import Field, BaseModel
from typing import List, Optional

# Define schemas for structured responses
class CitationSource(BaseModel):
    """Source information for a citation."""
    title: str = Field(description="Title of the source")
    url: Optional[str] = Field(None, description="URL of the source, if applicable")
    author: Optional[str] = Field(None, description="Author of the source, if known")
    publication_date: Optional[str] = Field(None, description="Publication date of the source, if known")

class Citation(BaseModel):
    """A citation for information in the response."""
    text: str = Field(description="The text that is being cited")
    sources: List[CitationSource] = Field(description="Sources for this citation")

class ChatResponse(BaseModel):
    """Structured response from the chatbot."""
    answer: str = Field(description="Main answer to the user's question")
    # citations: Optional[List[Citation]] = Field(None, description="Citations for information in the answer")
    # follow_up_questions: Optional[List[str]] = Field(None, description="Suggested follow-up questions")