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
    mode: "1",
    level: 1,
    alias: "Anònim",
        
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
            this.mode = toLoad.mode || "1";
            this.level = toLoad.level || 1;
            this.alias = toLoad.alias || "Anònim";
        }
        else{ //Mirem opcions de localStorage
            let options = localStorage.options ? JSON.parse(localStorage.options) : { pairs: 2, difficulty: 'normal', midaGrup: 2, startLevel: 1};
            this.alias = sessionStorage.alias || "Anònim";
            this.mode = sessionStorage.mode || "1";
            this.midaGrup = parseInt(options.midaGrup) || 2;
            this.level = (this.mode === "2") ? parseInt(options.startLevel) : 1;

            //En el mode 2 el número de grups inicial depèn del nivell
            let numGrups = (this.mode === "2") ? (this.level + 1) : parseInt(options.pairs);
            
            this.generateBoard(numGrups);
            this.score = 200;
        }
    },

    generateBoard: function(numGrups){
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
        this.ready = 0;
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
                if (this.mode === "1") {
                    this.endGame(true);
                } else {
                    //Mode 2: següent nivell
                    alert(`Nivell ${this.level} superat!`);
                    this.level++;
                    this.generateBoard(this.level + 1); 
                    location.reload(); //reinici visual 
                    this.saveToSession(); //Guardem l'estat actual al sessionStorage per no perdre el score
                }
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
                    this.endGame(false);
                }
            }, 1000);
        }
    },

    endGame: function(win){
        if (win){
            alert(`Has guanyat amb ${this.score} punts!!!!`);
            this.saveScore(); // Guardem la puntuació al ranking
        } else {
            alert("Has perdut!");  
        }
        window.location.assign("../");
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
    },

    saveScore: function(){
        let ranking = localStorage.ranking ? JSON.parse(localStorage.ranking) : [];
        ranking.push({ alias: this.alias, score: this.score, mode: this.mode });
        ranking.sort((a, b) => b.score - a.score); // Ordenem de major a menor
        ranking = ranking.slice(0, 5); // Guardem només el top 5 millors
        localStorage.ranking = JSON.stringify(ranking);
    },

    saveToSession: function(){
        sessionStorage.load = JSON.stringify({
            items: this.items, states: this.states, score: this.score,
            pairs: this.pairs, midaGrup: this.midaGrup, mode: this.mode, 
            level: this.level, alias: this.alias
        });
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
