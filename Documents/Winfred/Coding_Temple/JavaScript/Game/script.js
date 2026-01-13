

const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');

//shuffle the cards

const icons = ["🍎", "🍌", "🍇", "🍒", "🍍", "🥑", "🍓", "🍉"];
const cards = [...icons, ...icons]; //duplicate icons for pairs

function shuffle(array){

    return array.sort(() => Math.random() - 0.5);

}

//render the board
function createBoard(){

    gameBoard.innerHTML = ''; // clear previous game
    
    shuffle(cards).forEach(icon => {
        
    const card = document.createElement('div');

    card.classList.add('card');
    card.textContent= icon;
    card.dataset.icon = icon;
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
     });
}

createBoard();

//flip card
let flippedCards = [];
let lockBoard = false;

function flipCard(){
    if (lockBoard || this.classList.contains('flipped')) return;
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2){
        checkForMatch();
    }   
}

//MATCHING Logic

let attempts = 0;
const scoreDisplay = document.createElement('p');

document.body.insertBefore(scoreDisplay, gameBoard);

function updateScore(){
    scoreDisplay.textContent = `Attempts: ${attempts}`;
}

updateScore();

function checkForMatch(){
    const [card1, card2] = flippedCards;
    attempts++;

    updateScore();

    if (card1.dataset.icon === card2.dataset.icon){
        flippedCards = [];
        checkWin();
    } else {
        lockBoard = true;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
        }, 1000);

    }
}


//restart game
restartBtn.addEventListener('click', () => {
    createBoard();
    attempts = 0;
    updateScore();
    flipCards = [];
    lockBoard = false;
});


function checkWin(){
    const allFlipped = [...document.querySelectorAll('.card.flipped').every(card => card.classList.contains('flipped'));
    if (allFlipped){
        setTimeout(() => {
            alert(`Congratulations! You won in ${attempts} attempts.`);
        }, 500);  

    }
}