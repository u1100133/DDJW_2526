import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame} from "./memory.js";

let game = $('#game');
let canvas = game[0].getContext('2d');
let resources = {};
let cards = {};
const e_click = {click: false, x: -1, y: -1}
let key = null;
const c_w = 96;
const c_h = 128;
let idxSel = -1;

if (canvas){
    game.attr("width", 800);
    game.attr("height", 600);
    start();
    update();
}

function start(){
    selectCards();
    cards = gameItems.map((c)=>{return {texture:c}});
    loadCardResource("../resources/backSVG.svg");

    //Fem una graella que s'adapta al numero de cartes
    let cols = Math.floor(750 / (c_w + 10)); //maxim de columnes q cabran
    let offsetX = (800 - (Math.min(cards.length, cols) * (c_w + 10))) / 2; //centrar les cartes
    let offsetY = 50;

    cards.forEach((card, indx) => {
        loadCardResource(card.texture);
        initCard(val => card.texture = val);
        let col = indx % cols;
        let row = Math.floor(indx / cols);

        card.position = {
            xMin: offsetX + col * (c_w + 10),
            xMax: offsetX + col * (c_w + 10) + c_w,
            yMin: offsetY + row * (c_h + 10),
            yMax: offsetY + row * (c_h + 10) + c_h
        }
        card.onClick = function(x, y){
            return x >= this.position.xMin && x <= this.position.xMax &&
                    y >= this.position.yMin && y <= this.position.yMax;
        }
    });
    // Vincular events
    game.on('click', function(e){
        e_click.click = true;
        e_click.x = e.offsetX;
        e_click.y = e.offsetY;
    });
    $(document).keydown(e=>key = e.key);
    startGame();
}

function update(){
    checkInput();
    draw();
    requestAnimationFrame(update);
}

function loadCardResource(src){
    if (!resources[src]){
        let res = {image: null, ready: false}
        res.image = new Image();
        res.image.src = src;
        res.image.onload = ()=> res.ready = true;
        resources[src] = res;
    }
}

function draw(){
    canvas.fillStyle = "#ffffff"; 
    canvas.fillRect(0, 0, 800, 600);
    cards.forEach((card, indx) => {
        let res = resources[card.texture];
        if (res && res.ready){
            if (idxSel === indx) {
                canvas.shadowColor = '#01579b'; //efecte de seleccionat
                canvas.shadowBlur = 15;
                canvas.drawImage(res.image, card.position.xMin - 2, card.position.yMin - 2, c_w + 4, c_h + 4);
                canvas.shadowBlur = 0; //reset
            } else {
                canvas.drawImage(res.image, card.position.xMin, card.position.yMin, c_w, c_h);
            }
        }
    });
}

function checkInput(){
    if (e_click.click){
        cards.some((card, indx)=>{
            let click = card.onClick(e_click.x, e_click.y);
            if (click) clickCard(indx);
            return click;
        });
    }
    if (key){
        let cols = Math.floor(750 / (c_w + 10));
        switch(key){
            case "Escape":
                saveGame();
                break;
            case "ArrowRight":
                idxSel = (idxSel + 1)%cards.length;
                break;
            case "ArrowLeft":
                idxSel = (idxSel - 1 + cards.length)%cards.length;
                break;
            case "ArrowDown":
                if (idxSel + cols < cards.length) idxSel += cols;
                break;
            case "ArrowUp":
                if (idxSel - cols >= 0) idxSel -= cols;
                break;
            case "Enter":
                if (idxSel >= 0) clickCard(idxSel);
                break;
            default:
                console.warn("Tecla "+key+" no reconeguda.");
        }
    }
    e_click.click = key = false;
}

