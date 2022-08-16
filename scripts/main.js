/*
    Script Name:   SECRET WORD GAME
    Customer:      CoderHouse
    Purpose:       
    Preconditions: No preconditions needed
    Game Rules:
    Process PseudoCode:
                    1. Extract a list of groups and get the group.  
                    2. For each group found, get user information and load user information into the UserData object.
                    3. Return UserData object to the calling function.
    Return Array:  The following represents the array of information returned to the calling function.  This is a standardized response.
                        Any item in the array at points 2 or above can be used to return multiple items of information.
                        0 - Status: 'Success' or 'Error'
                        1 - Message
                        2 - User data object with list of users.
    Date of Dev:   15/08/2022
    Last Rev Date: 15/08/2022
    Revision Notes:
    15/08/2022 - Franco Petosa Ayala: Initial creation of the business process. 

*/

/* -------------------------------------------------------------------------- */
/*                            Configurable Variables                          */
/* -------------------------------------------------------------------------- */
const lifeNumber = 5;
const levelNumber = 5;
const wordList = ['FRANCO','CODERHOUSE'];
const correctColor = '#6AAA64';
const warningColor = '#C9B458';
const wrongColor = '#787C7E';
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              Script Variables                              */
/* -------------------------------------------------------------------------- */
let currentLevel = 0;
let currentRow = 0;
let currentWord = '';
let gameOverMessage = '';
let isGameOver = false;
const keyWordList = document.querySelectorAll('.keyWord');
const boardGame = document.getElementById('boardGame');
const remainLifes = document.getElementById('lifeNumber');
const btnDelete = document.getElementById('Delete');
const btnEnter = document.getElementById('Enter');

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            Helper Functions                                */
/* -------------------------------------------------------------------------- */
function buildGameBoard(){
    for (let i = 0; i < lifeNumber; i++) {
        const row = document.createElement('div');
        row.id = 'row' + i;
        row.className = 'row';

        for (let x = 0; x < wordList[currentLevel].length; x++) {
            const box = document.createElement('p');
            box.className = 'letter';
            row.append(box);
        }
        boardGame.append(row);
    }
    
}    

function selectKey(pressedKey){
    const row = document.getElementById('row' + currentRow);
    const boxes = row.childNodes;
    const emptyBox = [...boxes].find(box => box.innerText == '');

    if(emptyBox){
        emptyBox.innerText = pressedKey.innerText;
        currentWord = currentWord + pressedKey.innerText
    }

}

function checkGameStatus(){
    console.log(lifeNumber - currentRow)
    if(wordList[currentLevel] == currentWord){
        gameOverMessage = 'CONGRATS!';
        console.log(gameOverMessage)
        isGameOver = true;
    }else if(lifeNumber - currentRow - 1 == 0){
        gameOverMessage = 'GAME OVER!';
        console.log(gameOverMessage)
        isGameOver = true;
    }else{
        remainLifes.textContent = lifeNumber - currentRow - 1;
        currentRow++;
        currentWord = '';
    }
}

function colorBoxesAndKeys(){
    const row = document.getElementById('row' + currentRow);
    const boxes = row.childNodes;

    for (let i = 0; i < wordList[currentLevel].length; i++) {
        boxes[i].style.border = 'solid 1px transparent';
        boxes[i].style.color = 'white';
        if(wordList[currentLevel][i] == currentWord[i]){
            boxes[i].style.backgroundColor = correctColor;
        }else if(wordList[currentLevel].includes(currentWord[i])){
            boxes[i].style.backgroundColor = warningColor;
        }else{
            boxes[i].style.backgroundColor = wrongColor;
        }
    }
}

function deleteChar(){
    const row = document.getElementById('row' + currentRow);
    const boxes = row.childNodes;
    const charArr = [...boxes].map(box => box.innerText);

    let findFilledBox = false;
    let index = wordList[0].length;

    //search for a filled box to delete the content
    while(!findFilledBox && index > 0){

        if(charArr[index - 1] != ''){
            boxes[index - 1].innerText = '';
            findFilledBox = true;
            currentWord = currentWord.slice(0,currentWord.length - 1)
            console.log(currentWord)
        }

        index--
    }

    
}
/* -------------------------------------------------------------------------- */

buildGameBoard();

keyWordList.forEach(key => {

    key.addEventListener('click', ()=>{

        if(!isGameOver){

            switch (key.id) {
                case 'Enter':
                    console.log(currentWord.length == wordList[currentLevel].length)
                    if(currentWord.length == wordList[currentLevel].length){
                        colorBoxesAndKeys();
                        checkGameStatus();
                    }
                break;

                case 'Delete':
                    deleteChar();
                break;

                default:
                    selectKey(key);
                break;
            }
        }
    })
})


