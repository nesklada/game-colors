"use strict";

const config = {
    startControl: document.getElementById('js_start-game'),
    board: document.getElementById('js_board'),
    boardSize: 4,
    colors: ['green', 'blue', 'red', 'yellow', 'black', 'orange', 'pink', 'violet'],
    generateS: [],
}

const numbersOfSearch = config.colors.length / config.boardSize;

function Timer() {
    let timerId;

    let init = 0;

    let counter = 0,
        seconds = 0,
        minutes = 0,
        hours = 0;

    let secondsString = "00",
        minutesString = "00",
        hoursString = "00";

    this.currentTime = '';

    function formatTime(value){
        return +value <= 9 ? "0" + value : value 
    }
    
    this.start = (outer) => {
        counter++;
        seconds = counter;

        secondsString = formatTime(seconds);

        if(seconds === 60) {
            seconds = counter = 0;
            minutes++;

            secondsString = "00";

            minutesString = formatTime(minutes);
        }

        if(minutes === 60) {
            hours++;
            minutes = 0;
            minutesString = "00";

            hoursString = formatTime(hours);
        }

        let consistTimeString = `${hoursString}:${minutesString}:${secondsString}`;

        this.currentTime = consistTimeString;
        outer.innerHTML = consistTimeString;
    }

    this.clear = () => {
        counter = 0;
        seconds = 0;
        minutes = 0;
        hours = 0;
        secondsString = "00";
        minutesString = "00";
        hoursString = "00";

        clearInterval(timerId);
    }

    this.toggler = (outer) => {
        init++;

        if(init == 2) {
            init = 0;

            this.clear();

            return
        }

        timerId = setInterval(() => {
            this.start(outer);
        }, 1000);
    }
}

let timer = new Timer();

function randomNumber(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function hasClass(target, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

function generateSecret() {
    config.generateS = [];

    for(let i = 0; i < config.boardSize; i++) {
        config.generateS.push([]);
    };

    let doubleColor = [];
    for(let i = 0; i < numbersOfSearch; i++) {
        
        config.colors.forEach(color => {
            doubleColor.push(color);
        });

    }

    let index = 0;
    let colorItems = doubleColor.length;

    for(let i = 0; i < colorItems; i++) {
        let randomColorKey = randomNumber(0, doubleColor.length - 1);

        if(index === (config.generateS.length) ) {
            index = 0;
        }

        config.generateS[index].push(doubleColor[randomColorKey]);
        doubleColor.splice(randomColorKey, 1);

        index++;
    }

    console.log(config.generateS);
}

function createBoard(cb) {
    const boxes = config.boardSize;

    config.board.innerHTML = "";
    
    for(let i = 0; i < boxes; i++) {
    
        for(let k = 0; k < boxes; k++) {
            config.board.innerHTML +=  `<div class="board-item" data-x="${i}" data-y="${k}">
                                            <div class="board-item_front"></div>
                                            <div class="board-item_back"></div>
                                        </div>`;
        }
    }

    let widthBoard = config.board.offsetWidth + 'px',
        heightBoard = config.board.offsetHeight + 'px';

    config.board.setAttribute('style', `width: ${widthBoard}; height: ${heightBoard}`);

    if(cb) {
        cb();
    }
}

function showItem() {
    let items = document.getElementsByClassName('board-item');
    let counter = 0;
    let bufferColor = "";

    function resetAnchor() {
        counter = 0;
        bufferColor = "";
    }

    for(let i = 0, itemsLenth = items.length; i < itemsLenth; i++){
        items[i].addEventListener('click', function(){
            let target = this;
            let targetBgInner = target.getElementsByClassName('board-item_back')[0];

            if(hasClass(target, 'active')) {
                return
            }

            counter++;
            target.classList.add('active');

            let openedItems = document.querySelectorAll('.board-item.active').length;

            if(openedItems == itemsLenth) {

                setTimeout(() => {
                    win();
                }, 500);
                
            }

            let coordinateX = +(target.getAttribute('data-x')),
                coordinateY = +(target.getAttribute('data-y')),
                color = config.generateS[coordinateX][coordinateY];


            targetBgInner.setAttribute("style", "background-color:" + color);

            if(counter == numbersOfSearch && bufferColor != color) {
                resetAnchor();

                config.board.classList.add('disabled');

                //reset:
                setTimeout( () => {
                    for(let k = 0; k < itemsLenth; k++) {
                        items[k].classList.remove('active');
                        //items[k].getElementsByClassName('board-item_back')[0].removeAttribute('style');
                    }

                    config.board.classList.remove('disabled');
                }, 1000);

                return;
            }

            if(counter == numbersOfSearch) {
                resetAnchor();
            }

            bufferColor = color;
        });
    }
}

function win() {
    alert('Победа!! Время: ' + timer.currentTime);
    timer.clear();

    config.startControl.innerHTML = "Уря :)"
}

function init() {
    generateSecret();
    createBoard(showItem);
}

let count = 0;
config.startControl.addEventListener('click', function(){
    count++;

    if(count > 1) {
        count = 0;
        this.innerHTML = "Старт";
        config.board.innerHTML = "";
    } else {
        this.innerHTML = "Стоп";
        init();
    }
    
    timer.toggler(document.getElementById('js_timer'));
});
