// script.js
//taking help from ClaudeAI while coding and understanding concepts through YT 

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-button');
const timerElement = document.getElementById('time');
const progressBar = document.getElementById('progress-bar');
const difficultySelector = document.getElementById('difficulty');
const scoreElement = document.getElementById('score');
const quizContainer = document.getElementById('quiz-container');
const authContainer = document.getElementById('auth-container');
const profileContainer = document.getElementById('profile-container');
const leaderboardContainer = document.getElementById('leaderboard-container');
const dashboardContainer = document.getElementById('dashboard-container');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timerId;
let currentQuestions = [];
let currentUser = null;


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
    nextButton.innerHTML = 'Next Question';
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
    questionElement.innerHTML = `Question ${questionNo}: ${currentQuestion.question}`;
    questionElement.classList.add('fade-in');

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add('btn', 'fade-in');
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
    questionElement.classList.remove('fade-in');
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';
    if(isCorrect) {
        selectedBtn.classList.add('correct');
        score++;
        scoreElement.textContent = score;
        quizContainer.classList.add('shake');
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
    setTimeout(() => {
        quizContainer.classList.remove('shake');
    }, 500);
}

function startTimer() {
    timerId = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 10) {
            timerElement.style.color = '#e74c3c';
        }
        if (timeLeft <= 0) {
            clearInterval(timerId);
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timerId);
    questionElement.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your final score: ${score} out of ${currentQuestions.length}</p>
    `;
    resetState();
    nextButton.innerHTML = 'Restart Quiz';
    nextButton.style.display = 'block';
    progressBar.style.width = '100%';
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
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


function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    currentUser = { username, score: 0, quizzesCompleted: 0 };
    updateUI();
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    currentUser = { username, score: 0, quizzesCompleted: 0 };
    updateUI();
}

function logout() {
    currentUser = null;
    updateUI();
}

function updateUI() {
    if (currentUser) {
        authContainer.style.display = 'none';
        profileContainer.style.display = 'block';
        quizContainer.style.display = 'block';
        dashboardContainer.style.display = 'block';
        
        document.getElementById('profile-username').textContent = currentUser.username;
        document.getElementById('profile-score').textContent = currentUser.score;
        document.getElementById('profile-quizzes').textContent = currentUser.quizzesCompleted;
        
        updateDashboard();
    } else {
        authContainer.style.display = 'block';
        profileContainer.style.display = 'none';
        quizContainer.style.display = 'none';
        dashboardContainer.style.display = 'none';
    }
}

function updateLeaderboard() {
    const leaderboardData = [
        { rank: 1, username: 'user1', score: 1000 },
        { rank: 2, username: 'user2', score: 900 },
        { rank: 3, username: 'user3', score: 800 },
    ];
    
    const leaderboardBody = document.querySelector('#leaderboard tbody');
    leaderboardBody.innerHTML = '';
    leaderboardData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.rank}</td>
            <td>${entry.username}</td>
            <td>${entry.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
}

function updateDashboard() {
    const userStats = document.getElementById('user-stats');
    userStats.innerHTML = `
        <p>Total Score: ${currentUser.score}</p>
        <p>Quizzes Completed: ${currentUser.quizzesCompleted}</p>
        <p>Average Score: ${currentUser.quizzesCompleted > 0 ? (currentUser.score / currentUser.quizzesCompleted).toFixed(2) : 0}</p>
    `;
}

document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('register-btn').addEventListener('click', register);
document.getElementById('logout-btn').addEventListener('click', logout);

updateLeaderboard();
updateUI();