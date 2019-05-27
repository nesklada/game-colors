"use strict";

function randomNumber(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}

function hasClass(target, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(target.className);
}

var Board = function(config) {
    this.generateS = [];

    this.numbersOfSearch = config.numbersOfSearch;
    this.sizeBoard= config.sizeBoard;
    this.startControl = config.startControl;
    this.board = config.board;
    this.colors = config.colors;
};

Board.prototype.generateSecret = function() {
    this.generateS = [];

    for (let i = 0; i < this.sizeBoard; i++) {
        this.generateS.push([]);
    }

    let doubleColor = [];
    for (let i = 0; i < this.numbersOfSearch; i++) {

        this.colors.forEach(color => {
            doubleColor.push(color.toLowerCase());
        });

    }
    console.log(doubleColor);

    let index = 0;
    let colorItems = doubleColor.length;

    for (let i = 0; i < colorItems; i++) {
        let randomColorKey = randomNumber(0, doubleColor.length - 1);

        if (index === this.generateS.length) {
            index = 0;

        }

        this.generateS[index].push(doubleColor[randomColorKey]);
        doubleColor.splice(randomColorKey, 1);

        index++;
    }

    console.log(this.generateS);
};

Board.prototype.createBoard = function(cb) {
    const boxes = this.sizeBoard;

    this.board.innerHTML = "";

    for (let i = 0; i < boxes; i++) {

        for (let k = 0; k < boxes; k++) {
            this.board.innerHTML += `<div class="board-item" data-x="${i}" data-y="${k}">
                                            <div class="board-item_front"></div>
                                            <div class="board-item_back"></div>
                                        </div>`;
        }
    }

    let widthItem = this.board.querySelectorAll('.board-item')[0].offsetWidth,
        heightItem = this.board.querySelectorAll('.board-item')[0].offsetHeight;

    this.board.setAttribute('style', `width: ${widthItem * this.sizeBoard}px; height: ${heightItem * this.sizeBoard}px`);

    if (cb) {
        cb();
    }
};

Board.prototype.showCell = function(cb) {
    let items = document.getElementsByClassName('board-item');
    let counter = 0;
    let bufferColor = "";

    const $self = this;

    function resetAnchor() {
        counter = 0;
        bufferColor = "";
    }

    for (let i = 0, itemsLenth = items.length; i < itemsLenth; i++) {
        items[i].addEventListener('click', function () {
            let target = this;
            let targetBgInner = target.getElementsByClassName('board-item_back')[0];

            if (hasClass(target, 'active')) {
                return;
            }

            counter++;
            target.classList.add('active');

            let openedItems = document.querySelectorAll('.board-item.active').length;

            if (openedItems === itemsLenth) {

                setTimeout(() => {
                    $self.win();
                }, 500);

            }

            let coordinateX = +target.getAttribute('data-x'),
                coordinateY = +target.getAttribute('data-y'),
                color = $self.generateS[coordinateX][coordinateY];


            targetBgInner.setAttribute("style", "background-color:" + color);

            if (counter === $self.numbersOfSearch && bufferColor !== color) {
                resetAnchor();

                $self.board.classList.add('disabled');

                //reset:
                setTimeout(() => {
                    for (let k = 0; k < itemsLenth; k++) {
                        items[k].classList.remove('active');
                        //items[k].getElementsByClassName('board-item_back')[0].removeAttribute('style');
                    }

                    $self.board.classList.remove('disabled');
                }, 1000);

                return;
            }

            if (counter === $self.numbersOfSearch) {
                resetAnchor();
            }

            bufferColor = color;
        });
    }
};

Board.prototype.win = function() {
    alert('Победа!! Время: ' + timer.currentTime);
    timer.clear();

    this.startControl.innerHTML = "Уря :)";
};

Board.prototype.init = function() {
    this.generateSecret();
    this.createBoard(() => this.showCell(this.win));
};

Board.prototype.destroy = function() {
    this.board.innerHTML = "";
}

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
        return +value <= 9 ? "0" + value : value;
    }
    
    this.start = (outer) => {
        counter++;
        seconds = counter;

        secondsString = formatTime(seconds);

        if (seconds === 60) {
            seconds = counter = 0;
            minutes++;

            secondsString = "00";

            minutesString = formatTime(minutes);
        }

        if (minutes === 60) {
            hours++;
            minutes = 0;
            minutesString = "00";

            hoursString = formatTime(hours);
        }

        let consistTimeString = `${hoursString}:${minutesString}:${secondsString}`;

        this.currentTime = consistTimeString;
        outer.innerHTML = consistTimeString;
    };

    this.clear = () => {
        counter = 0;
        seconds = 0;
        minutes = 0;
        hours = 0;
        secondsString = "00";
        minutesString = "00";
        hoursString = "00";

        clearInterval(timerId);
    };

    this.toggler = (outer) => {
        init++;

        if (init === 2) {
            init = 0;

            this.clear();

            return;
        }

        timerId = setInterval(() => {
            this.start(outer);
        }, 1000);
    };
};

const config = {
    startControl: document.getElementById('js_start-game'),
    board: document.getElementById('js_board'),
    colors: ['green', 'blue', 'red', 'yellow', 'Black', 'orange', 'pink', 'violet'], // sizeBoard * numbersOfSearch = Number of colors
    sizeBoard: 4,
    numbersOfSearch: 2
};

let timer = new Timer();
let board = new Board(config);
let toggleBoard = 0;

config.startControl.addEventListener('click', function(){
    toggleBoard++;

    if (toggleBoard > 1) {
        toggleBoard = 0;
        this.innerHTML = "Старт";
        board.destroy();
    } else {
        this.innerHTML = "Стоп";
        board.init();
    }
    
    timer.toggler(document.getElementById('js_timer'));
});
