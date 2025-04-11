import os
import asyncio
import json
import logging
from pydantic_ai.providers.google_gla import GoogleGLAProvider
from pydantic_ai.models.gemini import GeminiModel
from pydantic_ai import Agent
from typing import List
from dotenv import load_dotenv

if __name__ == "__main__":
    from schemas import ResponseQuestions
else:
    from .schemas import ResponseQuestions


load_dotenv()

class QuestionGeneratorAgent:
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

    async def generate_questions(
        self, text: str, num_questions: int = 5, difficulty: str = "easy"
    ) -> List[ResponseQuestions]:
        """
        Generates multiple-choice questions based on the given text.
        If use_rag is True, enhances the input with web content.
        """

        agent = Agent(
            self.model,
            result_type=List[ResponseQuestions],
            system_prompt=(
                f"You are a teacher tasked with creating {num_questions} multiple-choice questions on the following information: {text} "
                "Each question should have four options (a, b, c, d) and a correct answer."
                f"Make sure the difficulty of each question is {difficulty}. "
                f"Focus your questions on the core text provided, using the additional information only for context and enrichment."
                "The questions should be clear, concise, and relevant to the text."
            ),
        )

        response = await agent.run(text)
        return response.data


if __name__ == "__main__":

    logging.basicConfig(level=logging.INFO)

    def pretty_print_question(question, index):
        """Print a question in a formatted, easy-to-read way"""
        print(f"\n{'='*60}")
        print(f"QUESTION {index+1}")
        print(f"{'='*60}")
        print(f"{question.question}\n")
        print(f"A. {question.option_a}")
        print(f"B. {question.option_b}")
        print(f"C. {question.option_c}")
        print(f"D. {question.option_d}")
        print(f"\nCorrect Answer: {question.answer}")
        print(f"{'='*60}")

    # Example usage
    generator = QuestionGeneratorAgent()

    data = {
        "topic": "Hentai",
        "summary": "Hentai is a Japanese term for sexually explicit or pornographic manga and anime. This content explores its definition, history, common themes, relationship to other media, and legal/ethical considerations.",
        "sections": [
            {
                "title": "Definition of Hentai",
                "content": "Hentai is a Japanese word that translates to 'pervert' or 'abnormal.' In English, it refers specifically to sexually explicit or pornographic manga (comics) and anime (animation). It is a genre characterized by graphic depictions of sexual acts and nudity. It's important to distinguish hentai from other forms of Japanese media, as it is specifically created for adult audiences and focuses solely on sexual content.",
                "key_points": [
                    "Hentai is sexually explicit manga and anime.",
                    "The term 'hentai' translates to 'pervert' or 'abnormal' in Japanese.",
                    "It is intended for adult audiences only and focuses on pornography.",
                ],
            },
            {
                "title": "Historical Context",
                "content": "The rise of hentai can be traced back to the post-World War II era in Japan, coinciding with increased freedom of expression and the growth of the manga and anime industries. Early examples were often underground or self-published, and over time, the genre became more mainstream, though it remains largely confined to specific publications and online platforms. The development of the internet significantly impacted the accessibility and distribution of hentai.",
                "key_points": [
                    "Hentai emerged in the post-WWII era with increased freedom of expression.",
                    "Early hentai was often underground and self-published.",
                    "The internet greatly expanded its accessibility and distribution.",
                ],
            },
            {
                "title": "Common Tropes and Themes",
                "content": "Hentai often features recurring tropes and themes, including specific sexual acts, character archetypes (e.g., innocent schoolgirl, dominant older man), and scenarios (e.g., forced seduction, non-consensual acts). While some hentai explores consensual and playful themes, it's crucial to acknowledge that many examples contain depictions of non-consensual acts and violence. These themes are often highly problematic and raise ethical concerns.",
                "key_points": [
                    "Hentai frequently uses specific sexual acts and character archetypes.",
                    "Common themes include seduction and power dynamics.",
                    "Many examples contain problematic depictions of non-consensual acts.",
                ],
            },
            {
                "title": "Relationship to Manga and Anime",
                "content": "Hentai is a subgenre of both manga and anime. It shares artistic styles and storytelling techniques with mainstream manga and anime but distinguishes itself through its explicit sexual content. Many artists and studios specialize in hentai, while others may create both mainstream and adult content. The distinction between the genres is primarily based on the presence and explicitness of sexual acts.",
                "key_points": [
                    "Hentai is a subgenre of both manga and anime.",
                    "It shares artistic styles with mainstream media but focuses on sexual content.",
                    "Some artists specialize in hentai, while others create content across genres.",
                ],
            },
            {
                "title": "Legal and Ethical Implications",
                "content": "The legality of hentai varies significantly depending on the country and region. Laws often regulate the depiction of minors and the portrayal of non-consensual acts. Ethically, hentai raises concerns about the objectification of women, the normalization of violence, and the potential for contributing to harmful attitudes towards sex and relationships. It's essential to consume this content critically and be aware of its potential impact.",
                "key_points": [
                    "The legality of hentai varies by country, especially regarding depictions of minors.",
                    "Ethical concerns include objectification, violence, and harmful attitudes towards sex.",
                    "Critical consumption and awareness of its potential impact are crucial.",
                ],
            },
        ],
        "references": [
            "Thompson, J. (2007). Manga: The Complete Guide. Ballantine Books.",
            "Poitras, G. (2000). Anime Companion. Stone Bridge Press.",
            "Brennan, S. (2006). Sexual caricatures in Japanese popular culture: A critical examination of 'hentai' manga. Journal of Graphic Novels and Comics, 1(1), 3-14.",
        ],
        "difficulty_level": "beginner",
    }

    data = str(data)

    # Create async function to run our coroutines
    async def main():
        print(f"\nGenerating questions about: {data}")
        print(f"Difficulty level: medium")
        print(f"Number of questions: 3\n")

        try:
            questions = await generator.generate_questions(
                data, num_questions=10, difficulty="medium"
            )
            print("****************************************")
            print(type(questions))
            # print(type(questions.data))

            # Pretty print each question
            for i, question in enumerate(questions):
                pretty_print_question(question, i)

            # Also output as JSON for debugging
            print("\nJSON representation of questions:")
            print(json.dumps([q.model_dump() for q in questions], indent=2))

        except Exception as e:
            logging.error(f"Error generating questions: {str(e)}")
            raise

    # Run the async function with asyncio
    asyncio.run(main())
