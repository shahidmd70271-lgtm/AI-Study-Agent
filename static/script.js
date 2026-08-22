
async function askAI() {
    const input = document.getElementById("question");
    const chatBox = document.getElementById("chatBox");

    const question = input.value.trim();

    if (!question) {
        return;
    }

    // Show user's question
    chatBox.innerHTML += `
        <div class="message user">
            ${question}
        </div>
    `;

    input.value = "";

    // Show loading message
    const loading = document.createElement("div");
    loading.className = "message ai";
    loading.innerText = "🤔 Thinking...";
    chatBox.appendChild(loading);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        loading.innerText = data.answer;

    } catch (error) {
        loading.innerText =
            "❌ Something went wrong. Please try again.";
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}


function quickQuestion(question) {
    document.getElementById("question").value = question;
    askAI();
}

function studyPlanner() {
    const question = prompt(
        "Tell me your exam details.\n\n" +
        "Example:\n" +
        "I have 5 days, 3 hours per day, and need to study Java, Physics and Maths."
    );

    if (question && question.trim() !== "") {
        document.getElementById("question").value =
            "Create a detailed study plan based on this information: " + question;

        askAI();
    }
}
function quizGenerator() {
    const topic = prompt(
        "What topic do you want a quiz on?\n\n" +
        "Example: Java Classes, Inheritance, Physics, Mathematics"
    );

    if (topic && topic.trim() !== "") {
        document.getElementById("question").value =
            "Create a 5-question multiple-choice quiz about " +
            topic +
            ". Give 4 options for each question and clearly show the correct answer.";

        askAI();
    }
}
function aiTutor() {
    const topic = prompt(
        "What topic do you want to learn?\n\n" +
        "Example: Java Classes, Inheritance, Physics, Mathematics"
    );

    if (topic && topic.trim() !== "") {
        document.getElementById("question").value =
            "Explain " + topic +
            " clearly for a beginner. Give simple examples and explain step by step.";

        askAI();
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        askAI();
    }
}