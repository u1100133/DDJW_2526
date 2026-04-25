import {$} from "../library/jquery-4.0.0.slim.module.min.js";

addEventListener('load', function() {

    function actualitzarRanking() {
        let scores = localStorage.ranking ? JSON.parse(localStorage.ranking) : [];
        if (scores.length > 0) {
            let html = "<h2>Top 5 puntuacions</h2><ul>";
            scores.forEach(s => {
                html += `<li>${s.alias}: ${s.score} punts (Mode ${s.mode})</li>`;
            });
            html += "</ul>";
            //console.log("Ranking actual:", scores);
        }
    }

    $('#play').on('click', function(){
        //Demanem l'àlies i el guardem en variable
		let alias = prompt("Introdueix el teu àlies:");
		if (!alias) return; //Si no s'introdueix un àlies, no es comença la partida

        let mode = prompt("Mode de joc:\n1. Mode Normal\n2. Mode Infinit", "1");
        if (mode !== "1" && mode !== "2") return; //Si no s'introdueix un mode vàlid, no es comença la partida
        
        sessionStorage.alias = alias;
        sessionStorage.mode = mode;
        sessionStorage.removeItem("load"); //Nova partida

        window.location.assign("./html/game.html");
    });

    $('#options').on('click', function(){
        window.location.assign("./html/options.html");
    });

    $('#saves').on('click', function(){
        let to_load = localStorage.save;
        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    $('#exit').on('click', function(){
        if(confirm("Sortir del joc?")) {
            window.close();
        }
    });
    actualitzarRanking();
});

