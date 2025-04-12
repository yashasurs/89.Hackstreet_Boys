import os, logging, json
import google.generativeai as genai
from dotenv import load_dotenv

if __name__ == "__main__":
    from schemas import TranslationResponse
else:
    from .schemas import TranslationResponse

import asyncio

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

class TranslaterAgent:
    def __init__(self):
        self.model = genai.GenerativeModel("gemini-1.5-flash")
    
    async def translate_content(self, content, language="hindi"):
        """
        Translates content to the specified language using Google Gemini.
        
        Args:
            content: Dictionary containing content to translate
            language: Either "hindi" or "kannada" (defaults to "hindi")
            
        Returns:
            TranslationResponse object with the translated content
        """
        # Validate language parameter
        if language.lower() not in ["hindi", "kannada"]:
            language = "hindi"  # Default to Hindi if invalid
        
        language_name = "Hindi" if language.lower() == "hindi" else "Kannada"
        
        # Parse input content
        content_dict = content
        if isinstance(content, str):
            try:
                content_dict = json.loads(content)
            except json.JSONDecodeError:
                return TranslationResponse(
                    topic="Error",
                    summary=f"Failed to parse content as JSON",
                    translated_content={"error": "Invalid JSON input"},
                    language=language
                )
        
        # Create a simpler prompt that's easier for the model to handle
        prompt = f"""
Translate the following content from English to {language_name}.
The content is educational material in JSON format.
Return ONLY the translated content in the same JSON structure.

Content to translate:
{json.dumps(content_dict, ensure_ascii=False, indent=2)}

Rules:
1. Maintain the exact same JSON structure
2. Translate ALL text fields (topic, summary, section titles, content, key points)
3. Do not translate URLs or code blocks
4. Return ONLY valid JSON (no explanations or formatting)
"""

        try:
            # Run the translation as a synchronous call to avoid complexity
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.model.generate_content(prompt)
            )
            
            # Extract and clean the response text
            response_text = response.text.strip()
            
            # Remove any markdown code block syntax
            if "```json" in response_text:
                response_text = response_text.split("```json", 1)[1]
            if "```" in response_text:
                if response_text.startswith("```"):
                    response_text = response_text.split("```", 1)[1]
                if response_text.endswith("```"):
                    response_text = response_text.rsplit("```", 1)[0]
            
            # Try to parse the JSON response
            try:
                translated_dict = json.loads(response_text.strip())
                
                # Create the simple response object
                return TranslationResponse(
                    topic=translated_dict.get("topic", content_dict.get("topic", "")),
                    summary=translated_dict.get("summary", content_dict.get("summary", "")),
                    translated_content=translated_dict,
                    language=language
                )
            except json.JSONDecodeError as e:
                logging.error(f"Failed to parse translation response as JSON: {str(e)}")
                return TranslationResponse(
                    topic=content_dict.get("topic", "Translation Error"),
                    summary=f"Error parsing translation response as JSON",
                    translated_content={"error": "Invalid JSON in translation response", "original": content_dict},
                    language=language
                )
                
        except Exception as e:
            logging.error(f"Translation error: {str(e)}")
            return TranslationResponse(
                topic=content_dict.get("topic", "Translation Error"),
                summary=f"Error translating content to {language_name}: {str(e)}",
                translated_content={"error": str(e), "original": content_dict},
                language=language
            )


# Test script for the TranslaterAgent
if __name__ == "__main__":
    # Setup logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    async def main():
        # Create an instance of the TranslaterAgent
        agent = TranslaterAgent()

        # Test content
        test_content = {
            "topic": "Python Programming",
            "summary": "An introduction to Python programming language.",
            "sections": [
                {
                    "title": "Getting Started",
                    "content": "Python is easy to learn and use.",
                    "key_points": ["Simple syntax", "Dynamic typing"]
                }
            ],
            "difficulty_level": "beginner"
        }

        logger.info("Testing translation to Hindi...")

        try:
            # Translate the content
            response = await agent.translate_content(test_content, "hindi")
            
            # Log the response
            logger.info("Translation result:")
            logger.info(f"Topic: {response.topic}")
            logger.info(f"Summary: {response.summary}")
            logger.info(f"Full content: {json.dumps(response.translated_content, ensure_ascii=False, indent=2)}")
            
        except Exception as e:
            logger.error(f"Error during translation test: {str(e)}")

    # Run the async main function
    asyncio.run(main())
