const resources = ['../resources/cb.png', '../resources/co.png',
                '../resources/sb.png', '../resources/so.png',
                '../resources/tb.png', '../resources/to.png'];
const back = '../resources/back.png';

const StateCard = Object.freeze({
    DISABLE: 0,
    ENABLE: 1,
    DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    cartesSeleccionades: [], //Array que guardara els index de les cartes girades
    score: 200,
    pairs: 2,
    midaGrup: 2, //Parelles, trios o quartets
    lock: false, //Per bloquejar el clic mentre es mostren cartes errònies
    goBack: function(idx){
        if (this.setValue && this.setValue[idx]) this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        if (this.setValue && this.setValue[idx]) this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.cartesSeleccionades = toLoad.cartesSeleccionades || [];
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
            this.midaGrup = toLoad.midaGrup || 2;
        }
        else{ //Mirem opcions de localStorage
            let options = localStorage.options ? JSON.parse(localStorage.options) : { pairs: 2, difficulty: 'normal', midaGrup: 2};
            this.midaGrup = parseInt(options.midaGrup) || 2;
            let numGrups = parseInt(options.pairs) || 2;
            this.items = [];
            let pool = resources.slice();
            shuffle(pool);
            let selectedResources = pool.slice(0, numGrups); //Agafem tants recursos com grups necessitem
            selectedResources.forEach(res => { //Afegim tantes copies com digui midaGrup per cada recurs
                for (let i = 0; i < this.midaGrup; i++) {
                    this.items.push(res);
                }
            });
            shuffe(this.items);                      
            this.states = new Array(this.items.length).fill(StateCard.ENABLE);
            this.pairs = numGrups;
            this.score = 200;
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.ENABLE){
                this.ready++;
                this.goFront(indx);
            }
            else{ 
                this.goFront(indx); //Mostrem totes les cartes un moment al principi
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
        if (this.lock || this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        this.goFront(indx);
        this.cartesSeleccionades.push(indx);

        if (this.cartesSeleccionades.length === this.midaGrup){
            this.checkMatch();
        }
    },
    checkMatch: function(){
        let firstIdx = this.cartesSeleccionades[0];
        let isMatch = this.cartesSeleccionades.every(idx => this.items[idx] === this.items[firstIdx]);
        if (isMatch){
            //Encert
            this.cartesSeleccionades.forEach(idx => this.states[idx] = StateCard.DONE);
            this.pairs--;
            this.cartesSeleccionades = [];

            if (this.pairs <= 0){
                setTimeout(()=>{
                    alert(`Has guanyat amb ${this.score} punts!!!!`);
                    window.location.assign("../");
                }, 500);
            }
        } else {
            //Error
            this.lock = true; //block de clicks
            this.score -= 25;

            setTimeout(()=>{
                this.cartesSeleccionades.forEach(idx => this.goBack(idx));
                this.cartesSeleccionades = [];
                this.lock = false;

                if (this.score <= 0){
                    alert ("Has perdut");
                    window.location.assign("../");
                }
            }, 1000);
        }
    },
    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            cartesSeleccionades: this.cartesSeleccionades,
            score: this.score,
            pairs: this.pairs,
            midaGrup: this.midaGrup
        });
        localStorage.save = to_save;
        console.warn("Partida guardada");
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}
