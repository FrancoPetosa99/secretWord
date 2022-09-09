/*
    Script Name:   SECRET WORD GAME

    Customer:      CoderHouse

    Preconditions: Para que funcione este script hace falta que este linkeado correctamente al file index.html
                   Caso contrario muchas funcionalidades arrojarian un error ya que el script 
                   espera encontrar determinados elementos Html

    Obj:           El objetivo de este script es poder recrear un juego donde el usuario deba adivinar 5 palabras para ganar
                   El jugador con 5 oportunidades por cada palabra
                   Las palabras son aleatorias y de desconocen ya que provienen de una API
                   Los llamados a la API se realizan solamente al comienzo del juego y en caso de que el usuario haya ganado o perdido y halla que reiniciar el juego.

    Date of Dev:   15/08/2022
    Last Rev Date: 15/08/2022
    Revision Notes:
    15/08/2022 - Franco Petosa Ayala - script owner 

*/

/* -------------------------------------------------------------------------- */
/*                            Configurable Variables                          */
/* -------------------------------------------------------------------------- */
const lifeNumber = 5;
const levelNumber = 5;
const correctColor = '#6AAA64';
const warningColor = '#C9B458';
const wrongColor = '#787C7E';
const APIkey = 'mqwkg9nkyjjqtozm9g23qnrnylfbzad8cah81mrzjtdpqi1q6';
const API = `https://api.wordnik.com/v4/words.json/randomWords?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=${lifeNumber}&limit=${levelNumber}&api_key=${APIkey}`;
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                               Classes                                      */
/* -------------------------------------------------------------------------- */
class Game{

    //tiene como proposito crear instancias del juego
    constructor(wordList){
        this.rowList;
        this.currentRow = 0;
        this.wordList = wordList
        this.currentLevel = 0;
        this.secretWord = this.wordList[this.currentLevel];
        this.currentWord = '';
        this.lifeNumber = lifeNumber;
        this.isGameOver = false;
        this.isLevelOver = false;
        this.modal = new bootstrap.Modal('#modal', {keyboard: false,backdrop: 'static'});
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

            if(charArr[index - 1] !== ''){
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
        if(this.currentWord.length < this.secretWord.length){
            const row = this.rowList[this.currentRow]
            const boxes = row.childNodes;
            const emptyBox = [...boxes].find(box => box.innerText === '');
        
            if(emptyBox){
                emptyBox.innerText = pressedKey;
                this.currentWord = this.currentWord + pressedKey
            }
        }else{
            tooltip.show('Enough letters');
        }
    }

    checkGameStatus(){
        //verifica el estado del juego:
            //el usuario adivino la palabra y gano
            //el usuario se quedo sin vidas y perdio
            //el usuario no gano pero todavia le quedan vidas
        
        if(this.secretWord == this.currentWord){
            if(this.currentLevel == 4){
                this.isGameOver = true;
                const title = 'WINNER';
                const message = 'You have guessed all the secret words';
                const labelBtn = 'Play Again';
                displayMessage(title, message, labelBtn);
            }else{
                this.isLevelOver = true;
                const title = 'Level passed';
                const message = 'Do you want to continue?';
                const labelBtn = 'Okey';
                displayMessage(title, message, labelBtn);
            }
        }else if(this.lifeNumber -1 == 0){
            this.isGameOver = true;
            const title = 'Game Over';
            const message = 'You have lost';
            const labelBtn = 'Try Again';
            displayMessage(title, message, labelBtn)
        }else{
            this.lifeNumber = this.lifeNumber - 1;
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
        }else{
            tooltip.show('Not enough letters');
        }
    }

    setNewLevel(){
        this.currentLevel++;
        this.secretWord = this.wordList[this.currentLevel];
        this.isLevelOver = false;
        this.currentRow = 0;
        this.currentWord = '';
        this.lifeNumber = lifeNumber
        this.cleanBoard();
        this.buildGameBoard();
    }

    cleanBoard(){
        // elima los childNodes viejos del contenedor boardGame
        // para que puedan crearse los nuevos en la nueva instencia
        this.rowList.forEach(childNode => {
            boardGame.removeChild(childNode)
        })
    }

    buildGameBoard(){
        //dependiendo de secretWord se crean filas y columnas
        //las filas representan cada intento que tiene el usuario
        //las columnas representan los boxes para formar la palabra
    
        for (let i = 0; i < lifeNumber; i++) {
            const row = document.createElement('div');
            row.id = 'row' + i;
            row.className = 'row';
    
            for (let x = 0; x < this.secretWord.length; x++) {
                const box = document.createElement('p');
                box.className = 'letter';
                row.append(box);
            }
            boardGame.append(row);
        }

        this.rowList = Array.from(document.getElementsByClassName('row'));
    }

    resetGame(){
        this.cleanBoard();
        startGame();
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

class Tooltip{
    constructor(){
        this.tooltip = document.getElementById('tooltipMessage');
    }

    show(message){
        this.tooltip.textContent = message;
        this.tooltip.classList.remove('hide');

        setTimeout(() => {
            this.hide();
        }, 1500);
    }

    hide(){
        this.tooltip.classList.add('hide');
    }
}
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              Script Variables                              */
/* -------------------------------------------------------------------------- */
let game;
let userName;
const keyWordList = document.querySelectorAll('.keyWord');
const boardGame = document.getElementById('boardGame');
const keyBoard = document.querySelectorAll('.keyWord');
const remainLifes = document.getElementById('lifeNumber');
const howToPlayIcon = document.getElementById('howToPlayIcon');
const modal = new bootstrap.Modal('#modal', {keyboard: false,backdrop: 'static'});
modal.title = document.getElementById('modalTitle');
modal.text = document.getElementById('modalText');
modal.btn = document.getElementById('modalBtn');
const instructions = new bootstrap.Modal('#instructions', {keyboard: false,backdrop: 'static'});
const spinner = new Spinner();
const tooltip = new Tooltip();
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            Helper Functions                                */
/* -------------------------------------------------------------------------- */

function checkMetaStatus(response){
    //verificamos que la llamada a la api fue exitosa con status 200
    //si el status no es el correcto se arroja un error
    if(!response.status || response.status != 200){
        let status = response.status;
        let errorMessage = `Api response returned with an status code ${status}`;
        throw new Error(errorMessage);
    }

    return response
}

function displayMessage(title, message, btnLabel){
    //muestra un mensaje modal al usuario
    //los siguientes elementos son customizables:
        //el titulo del modal
        //el mensaje
        //el label del button para ejecutar la acción

    modal.title.textContent = title;
    modal.text.textContent = message;
    modal.btn.textContent = btnLabel;

    modal.show();
}

function getSecretWord(){
    return fetch(API)
                .then((response) => checkMetaStatus(response))
                .then((response) => response.json())
                .then((data) => data.map(data => data.word.toUpperCase()))
}

/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                              Events                                        */
/* -------------------------------------------------------------------------- */
howToPlayIcon.addEventListener('click', ()=>{
    //despliega un modal con las instrucciones del juego
    instructions.show();
})

modal.btn.addEventListener('click', ()=>{
    //Muestra el modal con el mensaje que corresponde
    //Dependiendo si el usuario sigue en juego pasa al siguiente nivel o se reinicia en juego si es que perdio
    modal.hide();
    if(!game.isGameOver && game.isLevelOver){
        game.setNewLevel();
    }else if(game.isGameOver){
        game.resetGame();
    }
})

keyBoard.forEach(key => {
    //Dependiendo que tecla se haga click en el teclado se ejecuta metodos distintos
    key.addEventListener('click', ()=>{
        if(!game.isLevelOver){
            switch (key.id) {
                case 'Enter':
                   game.checkWord();
                break;
                case 'Delete':
                    game.deleteChar();
                break;

                default:
                    game.selectKey(key.innerText);
                break;
            }
        }
    })
})

document.addEventListener('keydown', (e) => {
    //se ejecuta cada vez que el usuario toque una tecla del teclado
    //solo son validas las teclas que indiquen letras, el enter y el delete
    if(!game.isLevelOver){
        if(isNaN(e.key) && e.code.toLowerCase().includes('key')){
            console.log(e.key.toUpperCase());
            game.selectKey(e.key.toUpperCase());
        }else if(e.key == 'Enter'){
            game.checkWord();
        }else if(e.key == 'Backspace'){
            game.deleteChar();
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    //si detecta que el usuario ingreso por primera vez a la aplicación entonces le pide ingresar su nombre
    //caso contrario le muestra un saludo con el nombre que contiene guardado en el localStorage
    if(localStorage.getItem("userName")){ //como es un string no hace falta parsearlo
        userName = localStorage.getItem("userName");
        tooltip.show(`${userName} you are back!`);
    }else{
        userName = prompt('Ingrese su nombre');
        localStorage.setItem("userName", userName);
    }
})
/* -------------------------------------------------------------------------- */

async function startGame(){
    try{
        //Inicia el juego
        //Antes de llamar a la api muestra el loading
        //Cuando llega de la api las secretWords para iniciar el juego se esconde el loading
        //Se inicia el nivel llamando a la función setLevel
        spinner.show();
        const wordList = await getSecretWord();
        spinner.hide();
        game = new Game(wordList);
        game.buildGameBoard();

    }catch(error){
        //atrapa cualquier error que haya podido suceder en el proceso del juego
        //Muestra un mensaje modal para indicarle al usuario que hubo un problema
        //El btn en el modal llama a la función main para volver a setear e juego
        spinner.hide();
        const title = 'Ups!';
        const message = 'Something went wrong';
        const labelBtn = 'Try again';
        displayMessage(title, message, labelBtn);
        console.log(error);
    }
}
startGame();




