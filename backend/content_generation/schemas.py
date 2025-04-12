from typing import List, Optional
from pydantic import BaseModel, Field, field_validator 

# Response schema for the generated questions
class ResponseQuestions(BaseModel):
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    answer_option: str
    answer_string: str = ""  # Added field to store the full answer text

# Define Pydantic schemas for structured output
class ContentSection(BaseModel):
    title: str
    content: str
    key_points: List[str] = Field(default_factory=list)

    @field_validator("key_points")  # Updated to field_validator
    def ensure_key_points(cls, v):
        if not v or len(v) < 2:
            raise ValueError("At least 2 key points are required")
        return v


class ContentResponse(BaseModel):
    topic: str
    summary: str
    sections: List[ContentSection]
    references: Optional[List[str]] = Field(default_factory=list)
    difficulty_level: str = "intermediate"

    @field_validator("difficulty_level")  # Updated to field_validator
    def validate_difficulty(cls, v):
        valid_levels = ["beginner", "intermediate", "advanced"]
        if v.lower() not in valid_levels:
            raise ValueError(f"Difficulty level must be one of {valid_levels}")
        return v.lower()

# Simple translation response schema to avoid validation issues
class TranslationResponse(BaseModel):
    topic: str
    summary: str
    translated_content: dict  # Store the entire translated content as a dictionary
    language: str = "hindi"

    @field_validator("language")
    def validate_language(cls, v):
        valid_languages = ["hindi", "kannada"]
        if v.lower() not in valid_languages:
            return "hindi"  # Default to Hindi if invalid language
        return v.lower()

