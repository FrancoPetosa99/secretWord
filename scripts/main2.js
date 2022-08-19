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
const lifeNumber = 2;
const levelNumber = 5;
const correctColor = '#6AAA64';
const warningColor = '#C9B458';
const wrongColor = '#787C7E';
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                               Classes                                      */
/* -------------------------------------------------------------------------- */
class Game{
    constructor(rowList, secretWord){
        this.rowList = rowList; //array
        this.currentRow = 0; // index
        this.secretWord = secretWord
        this.currentWord = '';
        this.lifeNumber = lifeNumber;
        this.isGameOver = false;
    }

    //Delete the char from the box
    deleteChar(){
        const row = this.rowList[this.currentRow]
        const boxes = row.childNodes;
        const charArr = [...boxes].map(box => box.innerText);

        let findFilledBox = false;
        let index = this.secretWord.length;

        //search for a filled box to delete the content
        while(!findFilledBox && index > 0){

            if(charArr[index - 1] != ''){
                boxes[index - 1].innerText = '';
                findFilledBox = true;
                this.currentWord = this.currentWord.slice(0,this.currentWord.length - 1)
            }

            index--
        }
    }

    //Print the selected key in the box
    selectKey(pressedKey){
        const row = this.rowList[this.currentRow]
        const boxes = row.childNodes;
        const emptyBox = [...boxes].find(box => box.innerText == '');
    
        if(emptyBox){
            emptyBox.innerText = pressedKey.innerText;
            this.currentWord = this.currentWord + pressedKey.innerText
        }
    }

    //verify the game status: continue - winner - game over
    checkGameStatus(){
        if(this.secretWord == this.currentWord){
            this.isGameOver = true;
            const title = 'Level passed';
            const message = 'Do you want to continue?'
            const labelBtn = 'Okey'
            displayMessage(title, message, labelBtn, resetGame)
        }else if(this.lifeNumber -1 == 0){
            this.isGameOver = true;
            const title = 'Game Over';
            const message = 'You have lost'
            const labelBtn = 'Try Again'
            displayMessage(title, message, labelBtn, resetGame)
        }else{
            this.lifeNumber = this.lifeNumber - 1
            this.currentRow++;
            this.currentWord = '';
        }
    }

    colorBoxesAndKeys(){
        const row = this.rowList[this.currentRow];
        const boxes = row.childNodes;
    
        for (let i = 0; i < this.secretWord.length; i++) {
            boxes[i].style.border = 'solid 1px transparent';
            boxes[i].style.color = 'white';
            if(this.secretWord[i] == this.currentWord[i]){
                boxes[i].style.backgroundColor = correctColor;
            }else if(this.secretWord.includes(this.currentWord[i])){
                boxes[i].style.backgroundColor = warningColor;
            }else{
                boxes[i].style.backgroundColor = wrongColor;
            }
        }
    }

    checkWord(){
        if (this.currentWord.length == this.secretWord.length) {
            this.colorBoxesAndKeys();
            this.checkGameStatus();
        }
    }
}

class Spinner{
    constructor(){
        this.spinner = document.getElementById('spinner')
    }

    show(){
        this.spinner.classList.remove('hide');
    }

    hide(){
        this.spinner.classList.add('hide');
    }
}
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              Script Variables                              */
/* -------------------------------------------------------------------------- */
let currentLevel = 0;
const keyWordList = document.querySelectorAll('.keyWord');
const boardGame = document.getElementById('boardGame');
const remainLifes = document.getElementById('lifeNumber');
const howToPlayIcon = document.getElementById('howToPlayIcon');
const modal = new bootstrap.Modal('#modal', {keyboard: false,backdrop: 'static'});
const instructions = new bootstrap.Modal('#instructions', {keyboard: false,backdrop: 'static'});
const spinner = new Spinner();
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

function buildGameBoard(secretWord){
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

function resetGame(){
    //boardGame.innerHTML = '';
    const rowList = Array.from(document.getElementsByClassName('row'));
    rowList.forEach(childNode => {
        boardGame.removeChild(childNode)
    })
    main();
}

/* -------------------------------------------------------------------------- */



async function main(){
    
    try{
        spinner.show();
        const secretWord = await fetch(`https://api.api-ninjas.com/v1/randomword?type=noun`)
                        .then((res) => checkMetaStatus(res))
                        .then((res) => res.json())
                        .then((res) => res.word.toUpperCase())
        spinner.hide();
        buildGameBoard(secretWord);
        const rowList = Array.from(document.getElementsByClassName('row'));
        const game = new Game(rowList,secretWord)

        keyWordList.forEach(key => {

            key.addEventListener('click', ()=>{
        
                if(!game.isGameOver){
    
                    switch (key.id) {
                        case 'Enter':
                           game.checkWord();
                        break;
                        case 'Delete':
                            game.deleteChar();
                        break;
        
                        default:
                            game.selectKey(key);
                        break;
                    }
                }
            })
        })

    }catch(error){
        console.log(error)
        spinner.hide();
        const title = 'Ups!';
        const message = 'Something went wrong';
        const labelBtn = 'Try again';
        displayMessage(title, message, labelBtn, resetGame);
    }
}
main()

howToPlayIcon.addEventListener('click', ()=>{
    instructions.show();
})

