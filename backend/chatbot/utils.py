import os, logging
import google.generativeai as genai
from pydantic_ai import Agent
from pydantic_ai.providers.google_gla import GoogleGLAProvider
from pydantic_ai.models.gemini import GeminiModel
import json
if __name__ == "__main__":
    from schemas import ChatResponse
else:
    from .schemas import ChatResponse
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()

class ChatBotAgent():
    def __init__(self):
        self.model = GeminiModel(
            "gemini-2.0-flash",
            provider=GoogleGLAProvider(
                api_key=os.getenv("GEMINI_API_KEY"),
            ),
        )
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
    
    async def generate_response(
            self,
            question: str,
            content: str = None,
    ) -> ChatResponse:
        """
        Generates a response to a question based on the provided content.
        If content is not provided, it will generate a response based on the question alone.
        """
        agent = Agent(
            self.model,
            result_type=ChatResponse,
            system_prompt=(
                f"You are a helpful assistant that provides accurate information. "
                f"Answer the following question: {question} "
                f"Use the provided content for reference: {content}"
            ),
        )
        
        response = await agent.run(question)
        return response.data


if __name__ == "__main__":
    async def main():
        # Setup logging
        logging.basicConfig(level=logging.INFO)
        logger = logging.getLogger(__name__)
        
        # Create an instance of the ChatBotAgent
        agent = ChatBotAgent()
        
        # Test case 1: With content
        logger.info("Testing generate_response with content...")
        question1 = "What is Python programming language?"
        content1 = """
        Python is a high-level, interpreted programming language created by Guido van Rossum and first released in 1991.
        Python's design philosophy emphasizes code readability with its notable use of significant whitespace.
        It supports multiple programming paradigms, including structured, object-oriented, and functional programming.
        """
        
        try:
            response1 = await agent.generate_response(question1, content1)
            # print("*************************************************************8")
            # print(type(response1))
            logger.info(f"Response with content:")
            logger.info(f"Answer: {response1.answer}")
            
            if response1.citations:
                logger.info("Citations:")
                for citation in response1.citations:
                    logger.info(f"- {citation.text}")
                    for source in citation.sources:
                        logger.info(f"  Source: {source.title}")
            
            if response1.follow_up_questions:
                logger.info("Follow-up questions:")
                for question in response1.follow_up_questions:
                    logger.info(f"- {question}")
        except Exception as e:
            logger.error(f"Error in test case 1: {e}")
        
        # Test case 2: Without content
        logger.info("\nTesting generate_response without content...")
        question2 = "What is machine learning?"
        
        try:
            response2 = await agent.generate_response(question2)
            logger.info(f"Response without content:")
            logger.info(f"Answer: {response2.answer}")
            
            if response2.citations:
                logger.info("Citations:")
                for citation in response2.citations:
                    logger.info(f"- {citation.text}")
                    for source in citation.sources:
                        logger.info(f"  Source: {source.title}")
            
            if response2.follow_up_questions:
                logger.info("Follow-up questions:")
                for question in response2.follow_up_questions:
                    logger.info(f"- {question}")
        except Exception as e:
            logger.error(f"Error in test case 2: {e}")

    # Run the async main function
    asyncio.run(main())

