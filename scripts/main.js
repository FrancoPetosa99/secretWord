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
const correctColor = '#6AAA64';
const warningColor = '#C9B458';
const wrongColor = '#787C7E';
const requestURL = `https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=10&api_key=YOURAPIKEY`
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              Script Variables                              */
/* -------------------------------------------------------------------------- */
let secretWord;
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
const modal = new bootstrap.Modal('#modal', {
    keyboard: false,
    backdrop: 'static'
})

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            Helper Functions                                */
/* -------------------------------------------------------------------------- */

function checkMetaStatus(res){

    if(!res.status || res.status != 200){
        let status = res.status;
        let errorMessage = `Api response returned with an status code ${status}`;
        throw new Error(errorMessage);
    }

    return res
}

function buildGameBoard(){
    for (let i = 0; i < lifeNumber; i++) {
        const row = document.createElement('div');
        row.id = 'row' + i;
        row.className = 'row';

        for (let x = 0; x < secretWord.length; x++) {
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
    if(secretWord == currentWord){
        isGameOver = true;
        const title = 'Level passed';
        const message = 'Do you want to continue?'
        const labelBtn = 'Okey'
        displayMessage(title, message, labelBtn, setNewLevel)
    }else if(lifeNumber - currentRow - 1 == 0){
        isGameOver = true;
        const title = 'Game Over';
        const message = 'You have lost'
        const labelBtn = 'Try Again'
        displayMessage(title, message, labelBtn, main)
    }else{
        remainLifes.textContent = lifeNumber - currentRow - 1;
        currentRow++;
        currentWord = '';
    }
}

function colorBoxesAndKeys(){
    const row = document.getElementById('row' + currentRow);
    const boxes = row.childNodes;

    for (let i = 0; i < secretWord.length; i++) {
        boxes[i].style.border = 'solid 1px transparent';
        boxes[i].style.color = 'white';
        if(secretWord[i] == currentWord[i]){
            boxes[i].style.backgroundColor = correctColor;
        }else if(secretWord.includes(currentWord[i])){
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
    let index = secretWord.length;

    //search for a filled box to delete the content
    while(!findFilledBox && index > 0){

        if(charArr[index - 1] != ''){
            boxes[index - 1].innerText = '';
            findFilledBox = true;
            currentWord = currentWord.slice(0,currentWord.length - 1)
        }

        index--
    }

    
}

function displayMessage(title, message, btnLabel, callback){
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalBtn = document.getElementById('modalBtn'); 

    modalTitle.textContent = title;
    modalText.textContent = message;
    modalBtn.textContent = btnLabel;

    modal.show()

    modalBtn.addEventListener('click', ()=>{
        //remove the modal from the user screen before runing callback function
        modal.hide()
        //run the callback funtion to continue with process
        callback()
    })
}

function setNewLevel(){

}

function restartGame(){

}
/* -------------------------------------------------------------------------- */

async function main(){
    try{
        //repeat the api call until a word of 5 digits or less is returned
        while(!secretWord || secretWord.length > 5){
            secretWord = await fetch(`https://api.api-ninjas.com/v1/randomword?type=noun`)
                            .then((res) => checkMetaStatus(res))
                            .then((res) => res.json())
                            .then((res) => res.word.toUpperCase())
        }
    }catch(error){
        const title = 'Ups!';
        const message = 'Something went wrong'
        const labelBtn = 'Try again'
        displayMessage(title, message, labelBtn, main)
    }
    console.log(secretWord)

    buildGameBoard();

    keyWordList.forEach(key => {

        key.addEventListener('click', ()=>{
    
            if(!isGameOver){
    
                switch (key.id) {
                    case 'Enter':
                        if(currentWord.length == secretWord.length){
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

}
main()


