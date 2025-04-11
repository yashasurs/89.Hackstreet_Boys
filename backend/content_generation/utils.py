from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.http import HttpResponse


def generate_lesson_pdf_from_topic(topic, content_json, questions_json):
    # Add answer_text based on answer key
    for q in questions_json:
        ans_key = q.get("answer", "").lower()
        q["answer_text"] = q.get(f"option_{ans_key}", "")

    context = {
        "topic": topic,
        "summary": content_json.get("summary", ""),
        "sections": content_json.get("sections", []),
        "references": content_json.get("references", []),
        "difficulty_level": content_json.get("difficulty_level", ""),
        "questions": questions_json,
    }

    html = render_to_string("json_lesson_template.html", context)

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{topic}.pdf"'

    pisa.CreatePDF(html, dest=response)
    return response


'''if __name__ == "__main__":
    data = {
        "topic": "Royal Challengers Bangalore (RCB)",
        "summary": "Royal Challengers Bangalore (RCB) is a popular franchise cricket team in the Indian Premier League (IPL). While they haven't won the IPL trophy yet, they have a large and passionate fanbase and have featured some of the biggest names in cricket.",
        "sections": [
            {
                "title": "Introduction to RCB and the IPL",
                "content": "The Indian Premier League (IPL) is a professional Twenty20 (T20) cricket league in India. It's one of the most popular cricket leagues in the world. RCB, or Royal Challengers Bangalore, is one of the original eight teams that started the IPL in 2008. Franchise cricket means that RCB is a privately owned team, much like sports teams in other leagues around the world. These franchises compete against each other in the IPL tournament each year. The IPL is known for its exciting matches and star players from all over the globe.",
                "key_points": [
                    "RCB is a franchise cricket team in the Indian Premier League (IPL).",
                    "The IPL is a professional Twenty20 cricket league in India.",
                    "Franchise cricket involves privately owned teams competing in a league.",
                ],
            },
            {
                "title": "Key Players and M. Chinnaswamy Stadium",
                "content": "RCB has been home to many famous cricketers, most notably Virat Kohli. Virat Kohli is considered one of the greatest batsmen of all time and has been a long-time captain and star player for RCB. The team's home ground is the M. Chinnaswamy Stadium in Bangalore. This stadium is known for its lively atmosphere and passionate fans. Playing at home gives RCB an advantage because the players are familiar with the conditions and receive strong support from the crowd.",
                "key_points": [
                    "Virat Kohli is a prominent player who has represented RCB for a long time.",
                    "M. Chinnaswamy Stadium is the home ground of RCB.",
                    "Playing at home provides RCB with a competitive advantage due to familiarity and fan support.",
                ],
            },
            {
                "title": "RCB's Performance History",
                "content": "Despite having a strong team and a large fanbase, RCB has not yet won the IPL trophy. They have reached the finals multiple times but have been unable to secure the championship. RCB's performance has been inconsistent over the years, with some seasons being very successful and others being disappointing. However, the team consistently attracts a lot of attention and generates excitement among cricket fans. The quest for their first IPL title continues to be a major goal for the franchise.",
                "key_points": [
                    "RCB has not yet won the IPL trophy.",
                    "They have reached the finals multiple times without winning.",
                    "RCB's performance has been inconsistent but they remain a popular team.",
                ],
            },
            {
                "title": "Fanbase and Popularity",
                "content": "RCB boasts one of the largest and most passionate fanbases in the IPL, often referred to as the 'RCBians'. Their unwavering support is a significant part of the team's identity. The team's popularity extends beyond Bangalore, with fans all over India and the world. This strong fanbase contributes to the high viewership and excitement surrounding RCB matches. The team's social media presence is also very active, keeping fans engaged and updated.",
                "key_points": [
                    "RCB has a large and passionate fanbase known as 'RCBians'.",
                    "The team's popularity extends beyond Bangalore.",
                    "The strong fanbase contributes to high viewership and excitement.",
                ],
            },
        ],
        "references": [
            "Official IPL website: iplt20.com",
            "Various sports news websites (e.g., ESPNcricinfo, Cricbuzz)",
        ],
        "difficulty_level": "beginner",
    }

    questions = {
        "questions": [
            {
                "question": "RCB is a team in which league?",
                "option_a": "Indian Premier League",
                "option_b": "Pro Kabaddi League",
                "option_c": "Indian Football League",
                "option_d": "Tennis Premier League",
                "answer": "a",
            },
            {
                "question": "In which city is RCB's home ground, M. Chinnaswamy Stadium, located?",
                "option_a": "Mumbai",
                "option_b": "Bangalore",
                "option_c": "Chennai",
                "option_d": "Delhi",
                "answer": "b",
            },
            {
                "question": "What is RCB's IPL trophy record?",
                "option_a": "Won the IPL trophy multiple times",
                "option_b": "Never played in the IPL",
                "option_c": "Not yet won the IPL trophy",
                "option_d": "Won the IPL trophy once",
                "answer": "c",
            },
            {
                "question": "Which prominent player has represented RCB for a long time?",
                "option_a": "Virat Kohli",
                "option_b": "Sachin Tendulkar",
                "option_c": "MS Dhoni",
                "option_d": "Rohit Sharma",
                "answer": "a",
            },
            {
                "question": "What is the name often used to refer to RCB's fanbase?",
                "option_a": "RCBions",
                "option_b": "RCBians",
                "option_c": "RCBFans",
                "option_d": "Royal Challengers",
                "answer": "b",
            },
        ]
    }

    temp = generate_lesson_pdf_from_topic(
        topic=data["topic"],
        content_json=data,
        questions_json=questions,
    )

    print(type(temp))'''
