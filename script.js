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
const createQuizContainer = document.getElementById('create-quiz-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const categoryList = document.getElementById('category-list');
const quizList = document.getElementById('quiz-list');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timerId;
let currentQuestions = [];
let currentUser = null;
let categories = ['General Knowledge', 'Science', 'History', 'Geography', 'Entertainment'];
let quizzes = [];

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
    // ... (other easy questions)
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
    // ... (other medium questions)
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
    // ... (other hard questions)
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
    if (currentUser) {
        currentUser.score += score;
        currentUser.quizzesCompleted++;
        updateUI();
    }
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressBar.style.width = progress + '%';
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    currentUser = { username, score: 0, quizzesCompleted: 0, quizzes: [] };
    updateUI();
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    currentUser = { username, score: 0, quizzesCompleted: 0, quizzes: [] };
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
        createQuizContainer.style.display = 'block';
        
        document.getElementById('profile-username').textContent = currentUser.username;
        document.getElementById('profile-score').textContent = currentUser.score;
        document.getElementById('profile-quizzes').textContent = currentUser.quizzesCompleted;
        
        updateDashboard();
        updateQuizList();
    } else {
        authContainer.style.display = 'block';
        profileContainer.style.display = 'none';
        quizContainer.style.display = 'none';
        dashboardContainer.style.display = 'none';
        createQuizContainer.style.display = 'none';
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

function createQuiz() {
    const title = document.getElementById('quiz-title').value;
    const category = document.getElementById('quiz-category').value;
    const questions = [];
    
    const questionInputs = document.querySelectorAll('.question-input');
    questionInputs.forEach(qi => {
        const question = qi.querySelector('.question-text').value;
        const answers = [];
        const answerInputs = qi.querySelectorAll('.answer-input');
        answerInputs.forEach(ai => {
            answers.push({
                text: ai.querySelector('.answer-text').value,
                correct: ai.querySelector('.answer-correct').checked
            });
        });
        questions.push({ question, answers });
    });
    
    const newQuiz = { title, category, questions };
    quizzes.push(newQuiz);
    if (currentUser) {
        currentUser.quizzes.push(newQuiz);
    }
    updateQuizList();
}

function updateQuizList() {
    quizList.innerHTML = '';
    if (currentUser) {
        currentUser.quizzes.forEach(quiz => {
            const quizItem = document.createElement('div');
            quizItem.classList.add('quiz-item');
            quizItem.textContent = quiz.title;
            quizItem.addEventListener('click', () => startCustomQuiz(quiz));
            quizList.appendChild(quizItem);
        });
    }
}

function startCustomQuiz(quiz) {
    currentQuestions = quiz.questions;
    startQuiz();
}

function searchQuizzes() {
    const searchTerm = searchInput.value.toLowerCase();
    const results = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchTerm) || 
        quiz.category.toLowerCase().includes(searchTerm)
    );
    displaySearchResults(results);
}

function displaySearchResults(results) {
    searchResults.innerHTML = '';
    results.forEach(quiz => {
        const quizItem = document.createElement('div');
        quizItem.classList.add('quiz-item');
        quizItem.textContent = `${quiz.title} (${quiz.category})`;
        quizItem.addEventListener('click', () => startCustomQuiz(quiz));
        searchResults.appendChild(quizItem);
    });
}

function updateCategories() {
    categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        categoryItem.textContent = category;
        categoryItem.addEventListener('click', () => filterQuizzesByCategory(category));
        categoryList.appendChild(categoryItem);
    });
}

function filterQuizzesByCategory(category) {
    const filteredQuizzes = quizzes.filter(quiz => quiz.category === category);
    displaySearchResults(filteredQuizzes);
}

function addQuestion() {
    const questionsContainer = document.getElementById('questions-container');
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question-input');
    questionDiv.innerHTML = `
        <input type="text" class="question-text" placeholder="Enter question">
        <div class="answers-container">
            <div class="answer-input">
                <input type="text" class="answer-text" placeholder="Answer">
                <input type="checkbox" class="answer-correct"> Correct
            </div>
        </div>
        <button class="btn add-answer-btn">Add Answer</button>
    `;
    questionsContainer.appendChild(questionDiv);
    
    const addAnswerBtn = questionDiv.querySelector('.add-answer-btn');
    addAnswerBtn.addEventListener('click', () => addAnswer(questionDiv));
}

function addAnswer(questionDiv) {
    const answersContainer = questionDiv.querySelector('.answers-container');
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer-input');
    answerDiv.innerHTML = `
        <input type="text" class="answer-text" placeholder="Answer">
        <input type="checkbox" class="answer-correct"> Correct
    `;
    answersContainer.appendChild(answerDiv);
}

// Event Listeners
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('register-btn').addEventListener('click', register);
document.getElementById('logout-btn').addEventListener('click', logout);
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
document.getElementById('add-question-btn').addEventListener('click', addQuestion);
document.getElementById('save-quiz-btn').addEventListener('click', createQuiz);
searchBtn.addEventListener('click', searchQuizzes);

// Initialize the app
updateLeaderboard();
updateCategories();
updateUI();