/*----- constants -----*/

const COLORS = {
    '0': "white",
    '1': "purple",
    '-1': "orange"
};

/*----- state variables -----*/

let board; //array of 7column arrays
let turn; //1 or -1
let winner; //null = no winner and 1/-1 = winner; "tie" = tied game


/*----- cached elements  -----*/

const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const markerEls = [...document.querySelectorAll('#markers > div')];

/*----- event listeners -----*/

document.getElementById('markers').addEventListener('click', handleDrop);

playAgainBtn.addEventListener('click', init);


/*----- functions -----*/

init();


//initialize all state, then call render()
function init() {

    //to visualize the board's mapping to the DOM, rotate the board arary 90deg counter clockwise OR   [rotate my head] 

    
    board = [
        [0, 0, 0, 0, 0, 0],  //column 0
        [0, 0, 0, 0, 0, 0],  //column 1
        [0, 0, 0, 0, 0, 0],  //column 2
        [0, 0, 0, 0, 0, 0],  //column 3
        [0, 0, 0, 0, 0, 0],  //column 4
        [0, 0, 0, 0, 0, 0],  //column 5
        [0, 0, 0, 0, 0, 0],  //column 6
    ];

    turn = 1;

    winner = null;

    render();
}

function handleDrop(evt) {

    const columnIdx = markerEls.indexOf(evt.target);
    
    //guard
    if(columnIdx === -1) return;

    //shortcut to column array
    const columnArr = board[columnIdx];

    //find the index of the first 0 in the colArr
    const rowIdx = columnArr.indexOf(0);
    
    //update the board state with the current player value(turn)
    columnArr[rowIdx] = turn;

    //SWITCH TURNS 
   // turn *= -1;
    turn = turn * -1;
    
    //check for winner
    winner = getWinner(columnIdx, rowIdx);
    render();
}

function getWinner(columnIdx, rowIdx){
    return checkVerticalWin(columnIdx, rowIdx) ||
    checkHorizontalWin(columnIdx, rowIdx) ||
    checkDiagonalWinNESW(columnIdx, rowIdx) || 
    checkDiagonalWinNWSE(columnIdx, rowIdx); 

}

function checkVerticalWin(columnIdx, rowIdx) {
    return countAdjacent(columnIdx, rowIdx, 0, -1) === 3 ? board[columnIdx][rowIdx] : null;
}

function checkHorizontalWin(columnIdx, rowIdx) {
    const adjacentCountLeft = countAdjacent(columnIdx, rowIdx, -1, 0);
    const adjacentCountRight = countAdjacent(columnIdx, rowIdx, 1, 0);
    return (adjacentCountLeft + adjacentCountRight) >= 3 ? board[columnIdx][rowIdx] : null;
}

function checkDiagonalWinNESW(columnIdx, rowIdx) {
    const adjacentCountNE = countAdjacent(columnIdx, rowIdx, 1, 1);
    const adjacentCountSW = countAdjacent(columnIdx, rowIdx, -1, -1);
    return (adjacentCountNE + adjacentCountSW) >= 3 ? board[columnIdx][rowIdx] : null;
}

function checkDiagonalWinNWSE(columnIdx, rowIdx) {
    const adjacentCountNW = countAdjacent(columnIdx, rowIdx, -1, 1);
    const adjacentCountSE = countAdjacent(columnIdx, rowIdx, 1, -1);
    return (adjacentCountNW + adjacentCountSE) >= 3 ? board[columnIdx][rowIdx] : null;
}

function countAdjacent(columnIdx, rowIdx, columnOffset, rowOffset){
//shortcut variable for the player value
const player = board[columnIdx][rowIdx];

//track count of adjacent cells with same player value
let count = 0;

//inititalize the new coordinats
columnIdx += columnOffset;
rowIdx += rowOffset;

while(
    //ensure that caloumnIdx is within bounds of the board array
    //how to check- board array which is an object - board[columnIDX]!== undefined

    board[columnIdx]!== undefined && 
    board[columnIdx][rowIdx] !== undefined &&
    board[columnIdx][rowIdx] === player
) {
    count++;
    columnIdx += columnOffset;
    rowIdx += rowOffset;
}
    return count;
}



//visualize all the state in the DOM
function render() {
    
    renderBoard();
    renderMessage();

    //hiding/showing UI elements(controls)
    renderControls();
}

function renderBoard(){
    board.forEach(function(columnArr, columnIdx) {

        //iterate over the cells in the current column
        columnArr.forEach(function(cellValue, rowIdx){

            const cellId = `c${columnIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);

            cellEl.style.backgroundColor = COLORS[cellValue];
        });
        
});
}

function renderMessage(){
    if(winner === 'T') {
        messageEl.innerText = "It's a TIE!!!";
    }else if (winner) {
        messageEl.innerHTML = `<span style= "color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> WINS!`;
    }else {
        //game is in play
        messageEl.innerHTML = `<span style= "color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
    }
}

function renderControls() {
    //ternary expression is used when we want 1 of 2 values returned
    // <conditional exp> ? 'truthy exp' : 'falsey exp'
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';

    //iterate over the marker elements hide/show according to the column being full[no 0] or not
    markerEls.forEach(function(markerEl, columnIdx){
        const hideMarker = !board[columnIdx].includes(0) || winner;
        markerEl.style.visibility = hideMarker ? 'hidden' : 'visible';
    })
}

