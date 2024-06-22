

const API = "https://run.mocky.io/v3/89af394f-99fb-4e51-97b3-810796426291";
let questions = [];
let currentBatchIndex = 0;
const batchSize = 7;
let displayedQuestionsCount = 0;
let score = 0;
let scoreLimit = document.createElement("span");
scoreLimit.style.cssText =
    "position:fixed; left: 10px; top: 10px; background-color: #ffffff21; font-size: 20px; padding: 10px 20px; border-radius: 20px; font-weight: bold;";

fetch(API)
    .then((response) => response.json())
    .then((data) => {
        questions = data.quiz.questions;
        showData();
        showScore(scoreLimit, score, displayedQuestionsCount);
    })
    .catch((error) => console.error("Error:", error));

function showData() {
    const startIndex = currentBatchIndex * batchSize;
    const endIndex = startIndex + batchSize;
    const batch = questions.slice(startIndex, endIndex);

    batch.forEach((question, index) => {
        let area = createDiv();
        let qu = createQuestion(question.question);
        let op = createOptions(Object.values(question.options));
        area.append(qu, op);

        let correctAnswer = question.options[question.correct_answer];
        checkAnswer(correctAnswer, startIndex + index);
    });

    currentBatchIndex++;
    displayedQuestionsCount += batch.length;

    if (currentBatchIndex * batchSize >= questions.length) {
        document.getElementById("load-more").style.display = "none";
    }
}

document.getElementById("load-more").addEventListener("click", () => {
    showData();
    showScore(scoreLimit, score, displayedQuestionsCount);
});

function createDiv() {
    let div = document.createElement("div");
    div.className = "area";
    document.querySelector(".con").appendChild(div);
    return div;
}

function createQuestion(qu) {
    let p = document.createElement("p");
    p.className = "question";
    p.textContent = qu;
    return p;
}

function createOptions(...op) {
    let ul = document.createElement("ul");
    for (let i = 0; i < op.length; i++) {
        for (let j = 0; j < op[i].length; j++) {
            let li = document.createElement("li");
            li.textContent = op[i][j];
            ul.appendChild(li);
        }
    }
    return ul;
}

function checkAnswer(correctAnswer, questionIndex) {
    let options = document.querySelectorAll(
        `.area:nth-child(${questionIndex + 1}) ul li`
    );

    options.forEach((option) => {
        option.addEventListener("click", (e) => {
            options.forEach((opt) => {
                opt.style.pointerEvents = "none";
            });

            let selectedOption = e.target.textContent.trim();

            if (selectedOption === correctAnswer) {
                option.style.backgroundColor = "green";
                score++;
            } else {
                option.style.backgroundColor = "red";
            }
            showScore(scoreLimit, score, displayedQuestionsCount);
        });
    });
}

function showScore(scoreLimit, score, displayedQuestionsCount) {
    if (displayedQuestionsCount < 10 ) displayedQuestionsCount = `0${displayedQuestionsCount}`;
    scoreLimit.textContent = `Score: ${score} / ${displayedQuestionsCount}`;
    document.body.appendChild(scoreLimit);
}

function mediaQuery() {
    let mobile = window.matchMedia("(max-width:767px)");
    if (mobile.matches) {
        scoreLimit.style.cssText =
            "position:fixed; left: 5px; top: 70px; background-color: #ffffff21; font-size: 20px; padding: 10px 20px; border-radius: 20px; font-weight: bold;";
    } else {
        scoreLimit.style.cssText =
            "position:fixed; left: 10px; top: 10px; background-color: #ffffff21; font-size: 20px; padding: 10px 20px; border-radius: 20px; font-weight: bold;";
    }
}

window.addEventListener("resize", () => {
    mediaQuery();
});

window.addEventListener("scroll", () => {
    if (window.matchMedia("(max-width:767px)").matches) {
        if (window.scrollY >= 120) {
            scoreLimit.style.cssText =
                "position:fixed; left: 10px; top: 10px; background-color: #ffffff21; font-size: 20px; padding: 10px 20px; border-radius: 20px; font-weight: bold;";
        } else {
            scoreLimit.style.cssText =
                "position:fixed; left: 5px; top: 70px; background-color: #ffffff21; font-size: 20px; padding: 10px 20px; border-radius: 20px; font-weight: bold;";
        }
    }
});



