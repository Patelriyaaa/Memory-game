    const gameBoard = document.getElementById('game-board');
    const gameInfo = document.getElementById('game-info');
    const moveCountElem = document.getElementById('move-count');
    const scoreElem = document.getElementById('score');
    const timerElem = document.getElementById('timer');
    const gameStatusElem = document.getElementById('game-status');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const resetBtn = document.getElementById('reset-btn');
    const difficultySelect = document.getElementById('difficulty');
    const difficultySelector = document.getElementById('difficulty-selector');
    
    let baseCards = [
        'apple', 'banana', 'grape', 'melon', 'pineapple', 'strawberry', 'cherry', 'lemon'
    ];
    
    let cards = [];
    let shuffledCards;
    let flippedCards = [];
    let matchedPairs = 0;
    let moveCount = 0;
    let score = 0;
    let timer;
    let timeElapsed = 0;
    
    function generateCards(numPairs) {
        cards = [];
        for (let i = 0; i < numPairs; i++) {
            let card = baseCards[i % baseCards.length];
            cards.push(card, card);
        }
    }
    
    function initializeBoard() {
        gameBoard.innerHTML = '';
        const difficulty = difficultySelect.value;
        let numRows, numCols, numPairs;
    
        if (difficulty === 'easy') {
            numRows = numCols = 2;
            numPairs = 4; // 3x3 grid
        } else if (difficulty === 'medium') {
            numRows = numCols = 3;
            numPairs = 6; // 6x6 grid
        } else {
            numRows = numCols = 4;
            numPairs = 8; // 12x12 grid
        }
    
        generateCards(numPairs);
        shuffledCards = shuffle(cards);
    
        gameBoard.style.gridTemplateColumns = `repeat(${numCols}, 100px)`;
    
        shuffledCards.forEach((card, index) => {
            const cardElem = document.createElement('div');
            cardElem.classList.add('card');
            cardElem.setAttribute('data-index', index);
    
            const cardImage = document.createElement('img');
            cardImage.src = `images/${card}.png`; // Ensure images are correctly placed
            cardElem.appendChild(cardImage);
    
            cardElem.addEventListener('click', handleCardClick);
            gameBoard.appendChild(cardElem);
        });
    
        gameBoard.style.visibility = 'visible'; // Show game board
    }
    
    function startTimer() {
        timer = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timerElem.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }
    
    function stopTimer() {
        clearInterval(timer);
    }
    
    function handleCardClick(event) {
        const cardElem = event.currentTarget;
    
        if (flippedCards.length === 2 || cardElem.classList.contains('flipped') || cardElem.classList.contains('matched')) {
            return;
        }
    
        cardElem.classList.add('flipped');
        flippedCards.push(cardElem);
    
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const index1 = card1.getAttribute('data-index');
        const index2 = card2.getAttribute('data-index');
        const value1 = shuffledCards[index1];
        const value2 = shuffledCards[index2];
    
        if (value1 === value2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            score += 10; // Increase score for a match
            if (matchedPairs === cards.length / 2) {
                stopTimer(); // Stop the timer when the game is won
                gameStatusElem.textContent = 'You Win!';
                restartBtn.style.display = 'inline-block'; // Show restart button when game ends
                resetBtn.style.display = 'inline-block'; // Show reset button when game ends
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }
    
        flippedCards = [];
        moveCount++;
        moveCountElem.textContent = moveCount;
        scoreElem.textContent = score;
    }
    
    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
    
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
    
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
    }
    
    function startGame() {
        matchedPairs = 0;
        moveCount = 0;
        score = 0;
        timeElapsed = 0;
        moveCountElem.textContent = moveCount;
        scoreElem.textContent = score;
        timerElem.textContent = '00:00';
        gameStatusElem.textContent = '';
        gameInfo.style.display = 'block'; // Show game info
        startTimer();
        initializeBoard();
        startBtn.style.display = 'none'; // Hide start button after starting
        restartBtn.style.display = 'inline-block'; // Show restart button when game starts
        resetBtn.style.display = 'inline-block'; // Show reset button when game starts
        difficultySelector.style.display = 'none'; // Hide difficulty selector when game is on
    }
    
    function restartGame() {
        startGame();
    }
    
    function resetGame() {
        difficultySelector.style.display = 'block'; // Show difficulty selector again
        gameBoard.style.visibility = 'hidden'; // Hide game board
        gameInfo.style.display = 'none'; // Hide game info
        startBtn.style.display = 'inline-block'; // Show start button
        restartBtn.style.display = 'none'; // Hide restart button
        resetBtn.style.display = 'none'; // Hide reset button
    }
    
    // Initialize the game on page load
    //startGame(); // Removed to avoid automatic start
    
    // Start button functionality
    startBtn.addEventListener('click', startGame);
    
    // Restart button functionality
    restartBtn.addEventListener('click', restartGame);
    
    // Reset button functionality
    resetBtn.addEventListener('click', resetGame);
    