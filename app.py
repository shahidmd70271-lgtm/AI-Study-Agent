from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = Flask(__name__)

# =====================================================
# GROQ CONNECTION
# =====================================================

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# =====================================================
# HOME
# =====================================================

@app.route("/")
def home():
    return render_template("index.html")


# =====================================================
# NORMAL AI CHAT
# =====================================================

@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "answer": "Please enter a question."
        })

    try:

        response = client.chat.completions.create(

            model="openai/gpt-oss-120b",

            messages=[

                {
                    "role": "system",

                    "content": """
You are Shahid's AI Study Agent.

Your job is to help college students learn.

You can:
- Explain academic concepts simply
- Create study plans
- Help with programming
- Explain mathematics and science
- Give examples
- Break difficult topics into simple steps

Always be clear, helpful and encouraging.
"""
                },

                {
                    "role": "user",
                    "content": question
                }

            ],

            temperature=0.7,

            max_tokens=2000
        )


        answer = response.choices[0].message.content


        return jsonify({
            "answer": answer
        })


    except Exception as e:

        print("Groq error:", e)

        return jsonify({
            "answer": f"Error: {str(e)}"
        })


# =====================================================
# INTERACTIVE QUIZ GENERATOR
# =====================================================

@app.route("/generate-quiz", methods=["POST"])
def generate_quiz():

    data = request.get_json()

    topic = data.get("topic", "").strip()

    if not topic:

        return jsonify({
            "success": False,
            "error": "Please enter a quiz topic."
        }), 400


    try:

        prompt = f"""
Create a quiz about:

{topic}

Generate EXACTLY 5 multiple-choice questions.

Each question must have EXACTLY 4 options.

There must be exactly ONE correct answer.

Return ONLY valid JSON.

Do NOT use markdown.
Do NOT use ```json.
Do NOT add explanations outside the JSON.

Use exactly this structure:

{{
    "title": "Quiz title",

    "questions": [

        {{
            "question": "Question text",

            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],

            "correct": 0
        }}

    ]
}}

The "correct" value must be:

0 = first option
1 = second option
2 = third option
3 = fourth option

Make the questions suitable for a college student.

Make them clear and educational.
"""


        response = client.chat.completions.create(

            model="openai/gpt-oss-120b",

            messages=[

                {
                    "role": "system",

                    "content": """
You are a professional educational quiz generator.

Always return valid JSON.

Never include markdown.

Never include ``` characters.

Never include text before or after the JSON.
"""
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ],

            temperature=0.4,

            max_tokens=3000
        )


        text = response.choices[0].message.content.strip()


        # Remove accidental markdown fences
        if text.startswith("```json"):
            text = text[7:]

        elif text.startswith("```"):
            text = text[3:]


        if text.endswith("```"):
            text = text[:-3]


        text = text.strip()


        quiz = json.loads(text)


        # =================================================
        # VALIDATE QUIZ
        # =================================================

        if "questions" not in quiz:

            raise ValueError(
                "Quiz format is invalid."
            )


        if len(quiz["questions"]) != 5:

            raise ValueError(
                "AI did not generate exactly 5 questions."
            )


        for question in quiz["questions"]:

            if len(question["options"]) != 4:

                raise ValueError(
                    "Every question must have exactly 4 options."
                )


            if question["correct"] not in [0, 1, 2, 3]:

                raise ValueError(
                    "Invalid correct answer."
                )


        return jsonify({

            "success": True,

            "quiz": quiz

        })


    except json.JSONDecodeError:

        return jsonify({

            "success": False,

            "error":
                "AI returned an invalid quiz format. Please try again."

        }), 500


    except Exception as e:

        print("Quiz error:", e)

        return jsonify({

            "success": False,

            "error":
                f"Quiz generation failed: {str(e)}"

        }), 500


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=int(
            os.environ.get(
                "PORT",
                5000
            )
        ),
        debug=True
    )