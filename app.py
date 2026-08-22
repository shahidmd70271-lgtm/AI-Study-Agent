
from flask import Flask, render_template, request, jsonify
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Connect to Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"answer": "Please enter a question."})

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=question,
            config=types.GenerateContentConfig(
                 max_output_tokens=10000,
                system_instruction="""You are an AI Study Agent.

Your job is to help college students learn.

You can:
- Explain academic concepts simply
- Create study plans
- Generate quizzes
- Help with programming
- Explain mathematics and science
- Give examples
- Break difficult topics into simple steps

Always be clear, helpful and encouraging."""
            )
        )

        return jsonify({"answer": response.text})

    except Exception as e:
        return jsonify({"answer": f"Error: {str(e)}"})


if __name__ == "__main__":
    app.run(debug=True)