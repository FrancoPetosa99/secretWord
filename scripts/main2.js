/*
    Script Name:   SECRET WORD GAME
    Customer:      CoderHouse
    Purpose:       
    Preconditions: 
    Game Rules:
    Process PseudoCode:
        1.
        2. 
        3. 

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

    //tiene como proposito crear instancias del juego por cada secretWord
    constructor(secretWord){
        this.rowList = Array.from(document.getElementsByClassName('row'));
        this.currentRow = 0;
        this.secretWord = secretWord
        this.currentWord = '';
        this.lifeNumber = lifeNumber;
        this.isGameOver = false;
        this.keyBoard = document.querySelectorAll('.keyWord');
    }

    deleteChar(){
        //este metodo se utiliza para eliminar las letras de la fila de boxes
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

    selectKey(pressedKey){
        //introduce la letra del teclado por que fue selecionada en el box
        //El primer box vacio que se encuentra es en el que se inserta el texto
        const row = this.rowList[this.currentRow]
        const boxes = row.childNodes;
        const emptyBox = [...boxes].find(box => box.innerText == '');
    
        if(emptyBox){
            emptyBox.innerText = pressedKey.innerText;
            this.currentWord = this.currentWord + pressedKey.innerText
        }
    }

    checkGameStatus(){
        //verifica el estado del juego:
            //el usuario adivino la palabra y gano
            //el usuario se quedo sin vidas y perdio
            //el usuario no gano pero todavia le quedan vidas

        if(this.secretWord == this.currentWord){
            this.isGameOver = true;
            const title = 'Level passed';
            const message = 'Do you want to continue?'
            const labelBtn = 'Okey'
            displayMessage(title, message, labelBtn)
        }else if(this.lifeNumber -1 == 0){
            this.isGameOver = true;
            const title = 'Game Over';
            const message = 'You have lost'
            const labelBtn = 'Try Again'
            displayMessage(title, message, labelBtn)
        }else{
            this.lifeNumber = this.lifeNumber - 1
            this.currentRow++;
            this.currentWord = '';
        }
    }

    colorBoxesAndKeys(){
        //indica el grado de acertación que hubo en la palabra
            //verde si la letra y posición son correctas
            //amarillo si la letra forma parte de la secretWord pero no se encuentra en la posición correcta
            //gris si la letra ni si quiera existe en la palabra
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
        //solo si se completaron todos los boxes de una fila
        //recien en esa instancia se puede evaluar el resultado
        if (this.currentWord.length == this.secretWord.length) {
            this.colorBoxesAndKeys();
            this.checkGameStatus();
        }
    }

    setKeyBoardToPlay(){
        this.keyBoard.forEach(key => {
            key.addEventListener('click', ()=>{
                if(!this.isGameOver){
    
                    switch (key.id) {
                        case 'Enter':
                           this.checkWord();
                        break;
                        case 'Delete':
                            this.deleteChar();
                        break;
        
                        default:
                            this.selectKey(key);
                        break;
                    }
                }
            })
        })
    }
}

class Spinner{
    constructor(){
        this.spinner = document.getElementById('spinner')
    }

    //muestra el spinner cuando se invoca este metodo del objeto
    show(){
        this.spinner.classList.remove('hide');
    }

    //desaparecer el spinner cuando se invoca este metodo del objeto
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
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalBtn = document.getElementById('modalBtn'); 
const modal = new bootstrap.Modal('#modal', {keyboard: false,backdrop: 'static'});
const instructions = new bootstrap.Modal('#instructions', {keyboard: false,backdrop: 'static'});
const spinner = new Spinner();
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            Helper Functions                                */
/* -------------------------------------------------------------------------- */

function checkMetaStatus(res){
    //verificamos que la llamada a la api fue exitosa con status 200
    //si el status no es el correcto se arroja un error
    if(!res.status || res.status != 200){
        let status = res.status;
        let errorMessage = `Api response returned with an status code ${status}`;
        throw new Error(errorMessage);
    }

    return res
}

function buildGameBoard(secretWord){
    //dependiendo de secretWord se crean filas y columnas
    //las filas representan cada intento que tiene el usuario
    //las columnas representan los boxes para formar la palabra

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

function displayMessage(title, message, btnLabel){
    //muestra un mensaje modal al usuario
    //los siguientes elementos son customizables:
        //el titulo del modal
        //el mensaje
        //el label del button para ejecutar la acción

    modalTitle.textContent = title;
    modalText.textContent = message;
    modalBtn.textContent = btnLabel;

    modal.show();
}

function resetGame(){
    // elima los childNodes viejos del contenedor boardGame
    // para que puedan crearse los nuevos en la nueva instencia
    const rowList = Array.from(document.getElementsByClassName('row'));
    rowList.forEach(childNode => {
        boardGame.removeChild(childNode)
    })
    main();
}

function getSecretWord(){
    return fetch(`https://api.api-ninjas.com/v1/randomword?type=noun`)
                .then((res) => checkMetaStatus(res))
                .then((res) => res.json())
                .then((data) => data.word.toUpperCase())
}
/* -------------------------------------------------------------------------- */



async function main(){
    
    try{
        spinner.show();
        const secretWord = await getSecretWord();
        spinner.hide();
        buildGameBoard(secretWord);
        const game = new Game(secretWord);
        game.setKeyBoardToPlay();
       
    }catch(error){
        //atrapa cualquier error que haya podido suceder en el proceso del juego
        //Muestra un mensaje modal para indicarle al usuario que hubo un problema 
        spinner.hide();
        const title = 'Ups!';
        const message = 'Something went wrong';
        const labelBtn = 'Try again';
        displayMessage(title, message, labelBtn);
    }
}
main()

howToPlayIcon.addEventListener('click', ()=>{
    //despliega un modal con las instrucciones del juego
    instructions.show();
})

modalBtn.addEventListener('click', ()=>{
    //primero cierra el modal y luego invoca la función de callback
    modal.hide();
    resetGame();
});