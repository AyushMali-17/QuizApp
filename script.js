// script.js
//taking help from ClaudeAI while coding and understanding concepts through YT 
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const timerElement = document.getElementById('time');
const progressBar = document.getElementById('progress-bar');
const difficultySelector = document.getElementById('difficulty');
const scoreElement = document.getElementById('score');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timerId;
let currentQuestions = [];

const easyQuestions = [
    {
        question: 'What is 2 + 2?',
        answers: [
            { text: '4', correct: true },
            { text: '22', correct: false },
            { text: '6', correct: false },
            { text: '8', correct: false }
        ]
    },
    {
        question: 'Which planet is known as the Red Planet?',
        answers: [
            { text: 'Earth', correct: false },
            { text: 'Mars', correct: true },
            { text: 'Jupiter', correct: false },
            { text: 'Venus', correct: false }
        ]
    },
    {
        question: 'What is the capital of France?',
        answers: [
            { text: 'London', correct: false },
            { text: 'Berlin', correct: false },
            { text: 'Madrid', correct: false },
            { text: 'Paris', correct: true }
        ]
    }
];

const mediumQuestions = [
    {
        question: 'What is the chemical symbol for gold?',
        answers: [
            { text: 'Au', correct: true },
            { text: 'Ag', correct: false },
            { text: 'Fe', correct: false },
            { text: 'Cu', correct: false }
        ]
    },
    {
        question: 'In which year did World War II end?',
        answers: [
            { text: '1943', correct: false },
            { text: '1945', correct: true },
            { text: '1947', correct: false },
            { text: '1950', correct: false }
        ]
    }
];

const hardQuestions = [
    {
        question: 'What is the largest known prime number (as of 2021)?',
        answers: [
            { text: '2^82,589,933 - 1', correct: true },
            { text: '2^77,232,917 - 1', correct: false },
            { text: '2^43,112,609 - 1', correct: false },
            { text: '2^57,885,161 - 1', correct: false }
        ]
    },
    {
        question: 'Which particle in an atom has no electric charge?',
        answers: [
            { text: 'Proton', correct: false },
            { text: 'Electron', correct: false },
            { text: 'Neutron', correct: true },
            { text: 'Positron', correct: false }
        ]
    }
];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = 'Next';
    timeLeft = 60;
    scoreElement.textContent = score;
    
    const difficulty = difficultySelector.value;
    switch(difficulty) {
        case 'easy':
            currentQuestions = easyQuestions;
            break;
        case 'medium':
            currentQuestions = mediumQuestions;
            break;
        case 'hard':
            currentQuestions = hardQuestions;
            break;
    }
    
    startTimer();
    showQuestion();
    updateProgressBar();
}

function showQuestion() {
    resetState();
    let currentQuestion = currentQuestions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add('btn');
        answerButtonsElement.appendChild(button);
        if(answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = 'none';
    while(answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';
    if(isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
        scoreElement.textContent = score;
    } else {
        selectedBtn.classList.add('incorrect');
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        if(button.dataset.correct === 'true') {
            button.classList.add('correct');
        }
        button.disabled = true;
    });
    nextButton.style.display = 'block';
}

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerId);
    questionElement.innerHTML = `Time's up! You scored ${score} out of ${currentQuestions.length}!`;
    resetState();
    nextButton.innerHTML = 'Restart';
    nextButton.style.display = 'block';
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / currentQuestions.length) * 100;
    progressBar.style.width = progress + '%';
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if(currentQuestionIndex < currentQuestions.length) {
        showQuestion();
        updateProgressBar();
    } else {
        endQuiz();
    }
});

difficultySelector.addEventListener('change', startQuiz);

startQuiz();
