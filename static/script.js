// =====================================================
// SHAHID'S AI STUDY AGENT
// FUTURISTIC INTERFACE CONTROLLER
// =====================================================


// =====================================================
// MOUSE FOLLOWING AI GLOW
// =====================================================

const mouseGlow = document.querySelector(".mouse-glow");

document.addEventListener("mousemove", (event) => {

    if (!mouseGlow) return;

    mouseGlow.style.left = event.clientX + "px";
    mouseGlow.style.top = event.clientY + "px";

});


// =====================================================
// AI RESPONSE
// =====================================================

async function askAI() {

    const input = document.getElementById("question");
    const chatBox = document.getElementById("chatBox");

    const question = input.value.trim();

    if (!question) {
        return;
    }


    // ---------------------------------------------
    // Show user message
    // ---------------------------------------------

    const userMessage = document.createElement("div");

    userMessage.className = "message user";

    userMessage.innerHTML = `
        <div class="message-label">
            👤 SHAHID
        </div>
        ${escapeHTML(question)}
    `;

    chatBox.appendChild(userMessage);

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;


    // ---------------------------------------------
    // AI thinking message
    // ---------------------------------------------

    const loading = document.createElement("div");

    loading.className = "message ai";

    loading.innerHTML = `
        <div class="message-label">
            🤖 AI CORE
        </div>

        <span class="thinking-text">
            INITIALIZING AI CORE
        </span>

        <span class="thinking-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
        </span>
    `;

    chatBox.appendChild(loading);

    chatBox.scrollTop = chatBox.scrollHeight;


    // ---------------------------------------------
    // Thinking animation
    // ---------------------------------------------

    const thinkingText =
        loading.querySelector(".thinking-text");

    const thinkingMessages = [
        "INITIALIZING AI CORE",
        "ANALYZING QUESTION",
        "PROCESSING KNOWLEDGE",
        "GENERATING RESPONSE",
        "FINALIZING ANSWER"
    ];

    let thinkingIndex = 0;

    const thinkingInterval = setInterval(() => {

        thinkingIndex++;

        if (thinkingIndex >= thinkingMessages.length) {
            thinkingIndex = 0;
        }

        if (thinkingText) {
            thinkingText.innerText =
                thinkingMessages[thinkingIndex];
        }

    }, 700);


    try {

        // -----------------------------------------
        // Send request to Flask
        // -----------------------------------------

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


        clearInterval(thinkingInterval);


        // -----------------------------------------
        // Show AI response
        // -----------------------------------------

        loading.innerHTML = `
            <div class="message-label">
                🤖 AI STUDY AGENT
            </div>

            <div class="ai-response"></div>
        `;


        const responseBox =
            loading.querySelector(".ai-response");


        // Type response
        await typeResponse(
            responseBox,
            data.answer || "No response received."
        );


    } catch (error) {

        clearInterval(thinkingInterval);

        loading.innerHTML = `
            <div class="message-label">
                🤖 AI CORE
            </div>

            ❌ Something went wrong.
            <br><br>
            Please try again.
        `;

        console.error(error);

    }


    chatBox.scrollTop = chatBox.scrollHeight;

}


// =====================================================
// AI TYPING EFFECT
// =====================================================

async function typeResponse(element, text) {

    const characters = text.split("");

    let currentText = "";

    for (let i = 0; i < characters.length; i++) {

        currentText += characters[i];

        element.innerText = currentText;

        const chatBox =
            document.getElementById("chatBox");

        chatBox.scrollTop =
            chatBox.scrollHeight;


        // Faster for long answers
        if (characters.length > 1000) {

            await sleep(2);

        } else {

            await sleep(8);

        }

    }

}


// =====================================================
// QUICK QUESTION
// =====================================================

function quickQuestion(question) {

    document.getElementById("question").value =
        question;

    askAI();

}


// =====================================================
// STUDY PLANNER
// =====================================================

function studyPlanner() {
    const modal = document.getElementById("studyPlannerModal");

    if (modal) {
        modal.classList.add("active");

        setTimeout(() => {
            document.getElementById("plannerInput").focus();
        }, 200);
    }
}

function closePlanner() {
    const modal = document.getElementById("studyPlannerModal");

    if (modal) {
        modal.classList.remove("active");
    }
}

function generateStudyPlan() {

    const input = document.getElementById("plannerInput");
    const details = input.value.trim();

    if (!details) {
        input.focus();
        return;
    }

    closePlanner();

    document.getElementById("question").value =
        "Create a detailed study plan based on this information: " +
        details;

    askAI();
}


// =====================================================
// QUIZ GENERATOR
// =====================================================

// =====================================================
// INTERACTIVE QUIZ GENERATOR
// =====================================================

let currentQuiz = null;
let currentQuestionIndex = 0;
let quizScore = 0;
let quizAnswered = false;


// Open quiz topic modal
function quizGenerator() {

    const modal = document.getElementById("quizModal");

    if (modal) {

        modal.classList.add("active");

        setTimeout(() => {

            const input =
                document.getElementById("quizInput");

            if (input) {
                input.focus();
            }

        }, 200);
    }
}


// Close quiz topic modal
function closeQuiz() {

    const modal =
        document.getElementById("quizModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


// Generate the actual quiz
async function generateQuiz() {

    const input =
        document.getElementById("quizInput");

    const topic =
        input.value.trim();

    if (!topic) {

        input.focus();

        return;
    }


    closeQuiz();


    // Show loading screen
    showQuizLoading();


    try {

        const response =
            await fetch("/generate-quiz", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    topic: topic
                })

            });


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Unable to generate quiz."
            );

        }


        // Store quiz locally
        currentQuiz = data.quiz;

        currentQuestionIndex = 0;

        quizScore = 0;

        quizAnswered = false;


        // Display quiz
        showQuizScreen();


    } catch (error) {

        console.error(error);

        showQuizError(
            error.message
        );

    }
}


// =====================================================
// QUIZ LOADING
// =====================================================

function showQuizLoading() {

    const modal =
        document.getElementById("quizGameModal");

    const content =
        document.getElementById("quizGameContent");


    if (!modal || !content) {
        return;
    }


    modal.classList.add("active");


    content.innerHTML = `

        <div class="quiz-loading">

            <div class="quiz-ai-core">
                🤖
            </div>

            <h2>
                AI QUIZ CORE
            </h2>

            <p class="quiz-loading-text">
                GENERATING QUESTIONS
            </p>

            <div class="quiz-loading-bar">
                <div></div>
            </div>

            <div class="quiz-loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
            </div>

        </div>

    `;
}


// =====================================================
// QUIZ SCREEN
// =====================================================

function showQuizScreen() {

    const modal =
        document.getElementById("quizGameModal");

    const content =
        document.getElementById("quizGameContent");


    if (!modal || !content || !currentQuiz) {
        return;
    }


    modal.classList.add("active");


    const question =
        currentQuiz.questions[
            currentQuestionIndex
        ];


    quizAnswered = false;


    content.innerHTML = `

        <div class="quiz-header">

            <div>

                <div class="quiz-small-title">
                    🤖 AI STUDY AGENT
                </div>

                <h2>
                    ${escapeHTML(
                        currentQuiz.title ||
                        "KNOWLEDGE QUIZ"
                    )}
                </h2>

            </div>

            <div class="quiz-progress">

                QUESTION

                <strong>
                    ${currentQuestionIndex + 1}
                </strong>

                / 5

            </div>

        </div>


        <div class="quiz-progress-line">

            <div
                style="
                    width:
                    ${((currentQuestionIndex + 1) / 5) * 100}%
                "
            ></div>

        </div>


        <div class="quiz-question">

            ${escapeHTML(
                question.question
            )}

        </div>


        <div class="quiz-options">

            ${question.options.map(
                (option, index) => `

                    <button
                        class="quiz-option"
                        onclick="selectQuizAnswer(${index})"
                    >

                        <span class="option-bubble">

                            ${String.fromCharCode(
                                65 + index
                            )}

                        </span>

                        <span class="option-text">

                            ${escapeHTML(option)}

                        </span>

                    </button>

                `
            ).join("")}

        </div>


        <div
            id="quizFeedback"
            class="quiz-feedback"
        ></div>

    `;
}


// =====================================================
// SELECT ANSWER
// =====================================================

function selectQuizAnswer(selectedIndex) {

    if (quizAnswered) {
        return;
    }


    quizAnswered = true;


    const question =
        currentQuiz.questions[
            currentQuestionIndex
        ];


    const correctIndex =
        question.correct;


    const options =
        document.querySelectorAll(
            ".quiz-option"
        );


    const selectedButton =
        options[selectedIndex];


    const correctButton =
        options[correctIndex];


    if (selectedIndex === correctIndex) {

        quizScore++;

        selectedButton.classList.add(
            "correct"
        );

        showQuizFeedback(
            "✓ CORRECT! +1 MARK",
            "correct"
        );

    } else {

        selectedButton.classList.add(
            "wrong"
        );

        correctButton.classList.add(
            "correct"
        );

        showQuizFeedback(
            "✕ WRONG ANSWER",
            "wrong"
        );

    }


    // Disable all buttons
    options.forEach(button => {

        button.disabled = true;

    });


    // Move to next question
    setTimeout(() => {

        currentQuestionIndex++;

        if (currentQuestionIndex < 5) {

            showQuizScreen();

        } else {

            showQuizResult();

        }

    }, 1200);
}


// =====================================================
// FEEDBACK
// =====================================================

function showQuizFeedback(
    message,
    type
) {

    const feedback =
        document.getElementById(
            "quizFeedback"
        );


    if (!feedback) {
        return;
    }


    feedback.innerText =
        message;


    feedback.className =
        "quiz-feedback " + type;
}


// =====================================================
// QUIZ RESULT
// =====================================================

function showQuizResult() {

    const modal =
        document.getElementById(
            "quizGameModal"
        );

    const content =
        document.getElementById(
            "quizGameContent"
        );


    if (!modal || !content) {
        return;
    }


    let message;


    if (quizScore === 5) {

        message =
            "PERFECT SCORE! 🏆";

    } else if (quizScore >= 4) {

        message =
            "EXCELLENT WORK! 🔥";

    } else if (quizScore >= 3) {

        message =
            "GOOD JOB! 👍";

    } else {

        message =
            "KEEP PRACTICING! 💪";

    }


    const percentage =
        quizScore * 20;


    content.innerHTML = `

        <div class="quiz-result">

            <div class="result-icon">
                🏆
            </div>

            <div class="quiz-small-title">
                QUIZ COMPLETE
            </div>

            <h2>
                ${message}
            </h2>


            <div class="score-circle">

                <div>

                    <strong>
                        ${quizScore}
                    </strong>

                    <span>
                        / 5
                    </span>

                </div>

            </div>


            <div class="score-percentage">
                ${percentage}%
            </div>


            <p>
                You answered
                <strong>
                    ${quizScore}
                </strong>
                out of 5 questions correctly.
            </p>


            <div class="result-buttons">

                <button
                    class="quiz-result-button"
                    onclick="restartQuiz()"
                >
                    🔄 TRY AGAIN
                </button>


                <button
                    class="quiz-result-button secondary"
                    onclick="closeQuizGame()"
                >
                    ✓ FINISH
                </button>

            </div>

        </div>

    `;
}


// =====================================================
// RESTART
// =====================================================

function restartQuiz() {

    if (!currentQuiz) {
        return;
    }


    currentQuestionIndex = 0;

    quizScore = 0;

    quizAnswered = false;


    showQuizScreen();
}


// =====================================================
// CLOSE QUIZ GAME
// =====================================================

function closeQuizGame() {

    const modal =
        document.getElementById(
            "quizGameModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }


    currentQuiz = null;

    currentQuestionIndex = 0;

    quizScore = 0;

}


// =====================================================
// ERROR
// =====================================================

function showQuizError(message) {

    const content =
        document.getElementById(
            "quizGameContent"
        );


    if (!content) {
        return;
    }


    content.innerHTML = `

        <div class="quiz-result">

            <div class="result-icon">
                ⚠️
            </div>

            <h2>
                QUIZ GENERATION FAILED
            </h2>

            <p>
                ${escapeHTML(message)}
            </p>

            <button
                class="quiz-result-button"
                onclick="closeQuizGame()"
            >
                CLOSE
            </button>

        </div>

    `;
}
// =====================================================
// AI TUTOR
// =====================================================

function aiTutor() {

    const modal = document.getElementById("tutorModal");

    if (modal) {
        modal.classList.add("active");

        setTimeout(() => {
            document.getElementById("tutorInput").focus();
        }, 200);
    }
}

function closeTutor() {

    const modal = document.getElementById("tutorModal");

    if (modal) {
        modal.classList.remove("active");
    }
}

function startTutor() {

    const input = document.getElementById("tutorInput");
    const topic = input.value.trim();

    if (!topic) {
        input.focus();
        return;
    }

    closeTutor();

    document.getElementById("question").value =
        "Explain " +
        topic +
        " clearly for a beginner. " +
        "Give simple examples and explain step by step.";

    askAI();
}

// =====================================================
// ENTER KEY
// =====================================================

function handleKeyPress(event) {

    if (event.key === "Enter") {

        askAI();

    }

}


// =====================================================
// HTML SAFETY
// =====================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// =====================================================
// SMALL DELAY HELPER
// =====================================================

function sleep(milliseconds) {

    return new Promise(resolve =>

        setTimeout(resolve, milliseconds)

    );

}


// =====================================================
// AI CORE STARTUP EFFECT
// =====================================================

window.addEventListener("load", () => {

    console.log(
        "🤖 SHAHID'S AI STUDY AGENT ONLINE"
    );

});