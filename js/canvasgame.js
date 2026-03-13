import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame} from "./memory.js";

let game = $('#game');
let canvas = game[0].getContext('2d');
let resources = {};
let cards = {};
if (canvas){
    game.attr("width", 800);
    game.attr("height", 600);
    start();
    update();
}

function start(){
    const c_w = 96;
    const c_h = 128;
    selectCards();
    cards = gameItems.map((c)=>{return {texture:c}});
    loadCardResource("../resources/back.png");
    cards.forEach((card, indx) => {
        loadCardResource(card.texture);
        initCard(val => card.texture = val);
        card.position = {
            xMin: 2+100*indx,
            xMax: 2+100*indx + c_w,
            yMin: 0,
            yMax: c_h
        }
        card.onClick = function(x, y){
            return x >= this.position.xMin && x <= this.position.xMax &&
                    y >= this.position.yMin && y <= this.position.yMax;
        }
    });
    // TODO: Vincular events
    startGame();
}

function update(){
//    checkInput();
//    draw();
    // TODO: Com es pot fer per que això sigui LOOP
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