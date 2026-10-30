
/* =====================================
   1. QUIZ QUESTIONS
===================================== */

const questions = [
  {
    question: "Which keyword declares a variable?",
    answers: [
      { text: "var", correct: false },
      { text: "let", correct: false },
      { text: "Both var and let", correct: true },
      { text: "print", correct: false }
    ]
  },
  {
    question: "Which method prints output in the console?",
    answers: [
      { text: "console.log()", correct: true },
      { text: "console.write()", correct: false },
      { text: "print.console()", correct: false },
      { text: "show()", correct: false }
    ]
  },
  {
    question: "Which symbol checks strict equality?",
    answers: [
      { text: "=", correct: false },
      { text: "==", correct: false },
      { text: "===", correct: true },
      { text: "!=", correct: false }
    ]
  },
  {
    question: "Which method adds an item to an array's end?",
    answers: [
      { text: "pop()", correct: false },
      { text: "push()", correct: true },
      { text: "shift()", correct: false },
      { text: "slice()", correct: false }
    ]
  },
  {
    question: "Which keyword creates a constant?",
    answers: [
      { text: "let", correct: false },
      { text: "var", correct: false },
      { text: "const", correct: true },
      { text: "change", correct: false }
    ]
  }
];


/* =====================================
   2. HTML ELEMENTS
===================================== */

const startScreen = document.getElementById("start-screen");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const quizScreen = document.getElementById("quiz-screen");
const quizBox = document.getElementById("quiz-box");
const resultBox = document.getElementById("result-box");

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

const feedbackElement = document.getElementById("feedback");
const progressElement = document.getElementById("progress");
const timerElement = document.getElementById("timer");
const difficultyLabel = document.getElementById("difficulty-label");

const finalScore = document.getElementById("final-score");
const highScoreElement = document.getElementById("high-score");
const restartButton = document.getElementById("restart-btn");


/* =====================================
   3. GAME SETTINGS
===================================== */

const difficultyTimes = {
  easy: 15,
  medium: 10,
  hard: 7
};

let selectedDifficulty = "medium";
let QUESTION_TIME = difficultyTimes.medium;

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

let timeLeft = QUESTION_TIME;
let timerInterval = null;
let answered = false;


/* =====================================
   4. SHUFFLE QUESTIONS
===================================== */

function shuffleQuestions() {
  quizQuestions = [...questions];

  for (let i = quizQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [quizQuestions[i], quizQuestions[j]] =
      [quizQuestions[j], quizQuestions[i]];
  }
}


/* =====================================
   5. GET HIGH SCORE
===================================== */

function getHighScore() {
  try {
    return Number(
      localStorage.getItem("quizVerseHighScore") || 0
    );
  } catch (error) {
    return 0;
  }
}

function saveHighScore() {
  try {
    const bestScore = getHighScore();

    if (score > bestScore) {
      localStorage.setItem("quizVerseHighScore", score);
      return true;
    }
  } catch (error) {
    // Quiz still works if browser storage is unavailable.
  }

  return false;
}


/* =====================================
   6. SELECT DIFFICULTY
===================================== */

difficultyButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    selectedDifficulty = button.dataset.level;

    QUESTION_TIME = difficultyTimes[selectedDifficulty];

    startQuiz();
  });
});


/* =====================================
   7. START QUIZ
===================================== */

function startQuiz() {
  clearInterval(timerInterval);

  currentQuestionIndex = 0;
  score = 0;
  answered = false;

  shuffleQuestions();

  startScreen.classList.add("hide");
  resultBox.classList.add("hide");
  quizScreen.classList.remove("hide");
  quizBox.classList.remove("hide");

  const levelName =
    selectedDifficulty.charAt(0).toUpperCase() +
    selectedDifficulty.slice(1);

  difficultyLabel.textContent = "Difficulty: " + levelName;

  timerElement.classList.remove("time-warning");
  nextButton.textContent = "Next Question →";

  showQuestion();
}


/* =====================================
   8. DISPLAY QUESTION
===================================== */

function showQuestion() {
  clearInterval(timerInterval);
  resetState();

  const currentQuestion = quizQuestions[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;

  progressElement.textContent =
    `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

  currentQuestion.answers.forEach(function(answer) {
    const button = document.createElement("button");

    button.textContent = answer.text;

    button.addEventListener("click", function() {
      selectAnswer(button, answer.correct);
    });

    answerButtons.appendChild(button);
  });

  startTimer();
}


/* =====================================
   9. RESET QUESTION
===================================== */

function resetState() {
  nextButton.disabled = true;
  feedbackElement.textContent = "";
  answerButtons.innerHTML = "";
  answered = false;

  nextButton.textContent =
    currentQuestionIndex === quizQuestions.length - 1
      ? "Show Result 🏆"
      : "Next Question →";
}


/* =====================================
   10. TIMER
===================================== */

function startTimer() {
  clearInterval(timerInterval);

  timeLeft = QUESTION_TIME;
  updateTimer();

  timerElement.classList.remove("time-warning");

  timerInterval = setInterval(function() {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 5) {
      timerElement.classList.add("time-warning");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);
}


function updateTimer() {
  timerElement.textContent = `⏱️ Time: ${timeLeft}s`;
}


/* =====================================
   11. TIME UP
===================================== */

function timeUp() {
  if (answered) return;

  answered = true;

  feedbackElement.textContent = "Time's up! ⏰";

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const buttons = answerButtons.querySelectorAll("button");

  buttons.forEach(function(button, index) {
    button.disabled = true;

    if (currentQuestion.answers[index].correct) {
      button.classList.add("correct");
    }
  });

  nextButton.disabled = false;
}


/* =====================================
   12. CHECK ANSWER
===================================== */

function selectAnswer(selectedButton, isCorrect) {
  if (answered) return;

  answered = true;
  clearInterval(timerInterval);

  const buttons = answerButtons.querySelectorAll("button");

  buttons.forEach(function(button) {
    button.disabled = true;
  });

  if (isCorrect) {
    selectedButton.classList.add("correct");

    feedbackElement.textContent = "Correct answer! 🎉";

    score++;
  } else {
    selectedButton.classList.add("wrong");

    feedbackElement.textContent = "Wrong answer! ❌";

    const currentQuestion = quizQuestions[currentQuestionIndex];

    buttons.forEach(function(button, index) {
      if (currentQuestion.answers[index].correct) {
        button.classList.add("correct");
      }
    });
  }

  nextButton.disabled = false;
}


/* =====================================
   13. NEXT QUESTION
===================================== */

nextButton.addEventListener("click", function() {
  if (!answered) return;

  currentQuestionIndex++;

  if (currentQuestionIndex < quizQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
});


/* =====================================
   14. SHOW RESULT
===================================== */

function showResult() {
  clearInterval(timerInterval);

  quizScreen.classList.add("hide");
  quizBox.classList.add("hide");
  resultBox.classList.remove("hide");

  timerElement.textContent = "⏱️ Quiz Finished";
  timerElement.classList.remove("time-warning");

  finalScore.textContent =
    `Your score: ${score} / ${quizQuestions.length}`;

  const isNewRecord = saveHighScore();
  const bestScore = getHighScore();

  highScoreElement.textContent = isNewRecord
    ? `🎉 New High Score: ${bestScore}!`
    : `🏆 Best Score: ${bestScore} / ${quizQuestions.length}`;
}


/* =====================================
   15. PLAY AGAIN
===================================== */

restartButton.addEventListener("click", function() {
  clearInterval(timerInterval);

  quizScreen.classList.add("hide");
  quizBox.classList.add("hide");
  resultBox.classList.add("hide");

  startScreen.classList.remove("hide");

  timerElement.classList.remove("time-warning");
  timerElement.textContent = "⏱️ Choose your level";
});
