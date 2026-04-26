const resources = ['../resources/cbSVG.svg', '../resources/coSVG.svg',
                '../resources/sbSVG.svg', '../resources/soSVG.svg',
                '../resources/tbSVG.svg', '../resources/toSVG.svg',
                '../resources/dbSVG.svg', '../resources/doSVG.svg',
                '../resources/stbSVG.svg', '../resources/stoSVG.svg',];
const back = '../resources/backSVG.svg';

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
    groupSize: 2, //Parelles, trios o quartets
    lock: false, //Per bloquejar el clic mentre es mostren cartes errònies
    mode: "1",
    level: 1,
    alias: "Anònim",
    saveID: null,
        
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
            this.groupSize = toLoad.groupSize || 2;
            this.mode = toLoad.mode || "1";
            this.level = toLoad.level || 1;
            this.alias = toLoad.alias || "Anònim";
            this.saveID = toLoad.id || toLoad.saveID || null; //Recuperem el saveID si existeix
        }
        else{ //Mirem opcions de localStorage
            let options = localStorage.options ? JSON.parse(localStorage.options) : { pairs: 2, difficulty: 'normal', groupSize: 2, startLevel: 1};
            this.alias = sessionStorage.alias || "Anònim";
            this.mode = sessionStorage.mode || "1";
            this.groupSize = parseInt(options.groupSize) || 2;
            this.level = (this.mode === "2") ? parseInt(options.startLevel) : 1;

            //En el mode 2 el número de grups inicial depèn del nivell
            let numGrups = (this.mode === "2") ? (this.level + 1) : parseInt(options.pairs);
            
            this.generateBoard(numGrups);
            this.score = 200;
            this.saveID = null; //Assegurem que és una partida nova
        }
    },

    generateBoard: function(numGrups){
        this.items = [];
        let pool = resources.slice();
        shuffle(pool);
        let selectedResources = pool.slice(0, numGrups); //Agafem tants recursos com grups necessitem
        selectedResources.forEach(res => { //Afegim tantes copies com digui groupSize per cada recurs
            for (let i = 0; i < this.groupSize; i++) {
                this.items.push(res);
            }
        });
        shuffle(this.items);                      
        this.states = new Array(this.items.length).fill(StateCard.ENABLE);
        this.pairs = numGrups;
        this.ready = 0;
    },

    start: function(){
        this.ready = 0;
        this.items.forEach((_, indx) => {
            this.goFront(indx); //Mostrem la cara i les bloquejem
            setTimeout(() => { //Passa un temps esglaonat, giren les cartes i les habilitem
                this.goBack(indx);
                this.ready++;
            }, 1000 + 100 * indx);
        }); //Mostrem les cartes una a una amb un petit delay
    },

    click: function(indx){
        if (this.lock || this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        this.goFront(indx);
        this.cartesSeleccionades.push(indx);

        if (this.cartesSeleccionades.length === this.groupSize){
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
                    this.saveToSession(); //Guardem l'estat actual al sessionStorage per no perdre el score
                    location.reload(); //reinici visual 
                    
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

        if (this.saveID) {
            let allSaves = localStorage.saves ? JSON.parse(localStorage.saves) : [];
            let novesPartides = allSaves.filter(s => s.id !== this.saveID); // Eliminem la partida actual
            localStorage.saves = JSON.stringify(novesPartides);
        }

        window.location.assign("../");
    },

    save: function(){
        let currentSave = {
            id: this.saveID || Date.now(), //Si no te ID en generem un de nou
            date: new Date().toLocaleString(),
            alias: this.alias,
            items: this.items,
            states: this.states,
            cartesSeleccionades: this.cartesSeleccionades,
            score: this.score,
            pairs: this.pairs,
            groupSize: this.groupSize,
            mode: this.mode,
            level: this.level
        };
        //historial de partides
        let allSaves = localStorage.saves ? JSON.parse(localStorage.saves) : [];
        let index = allSaves.findIndex(s => s.id === currentSave.id);
        if (index !== -1){
            allSaves[index] = currentSave; //Actualitzem partida existent
        } else {
            allSaves.push(currentSave); //Afegim nova partida
            this.saveID = currentSave.id;
        }
        
        localStorage.saves = JSON.stringify(allSaves);
        alert("Partida guardada correctament!");
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
            pairs: this.pairs, groupSize: this.groupSize, mode: this.mode, 
            level: this.level, alias: this.alias, id: this.saveID
        });
    }
}

function shuffle(arr){
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
