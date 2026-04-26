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

        window.location.assign("./html/canvasgame.html");
    });

    $('#options').on('click', function(){
        window.location.assign("./html/options.html");
    });

    $('#saves').on('click', function(){
        let allSaves = localStorage.saves ? JSON.parse(localStorage.saves) : [];
        let container = $('#saveListContainer');
        let list = $('#saveList');
        list.empty(); //netejem la llista anterior

        if (allSaves.length === 0) {
            list.append("<p>No hi ha partides guardades.</p>");
        } else {
            allSaves.forEach((s) => {
                let btn = $(`<button class="center" style="width: 100%; height: auto; padding: 10px; margin-bottom: 5px;">
                    ${s.alias} - Mode ${s.mode} (Punts: ${s.score})<br><small>${s.date}</small></button>`); 

                btn.on('click', function() {
                    sessionStorage.load = JSON.stringify(s); 
                    window.location.assign("./html/canvasgame.html");
                });
                list.append(btn);
            });
        }
        container.show();
    });

    $('#closeSaves').on('click', function(){
        $('#saveListContainer').hide();
    });

    $('#ranking').on('click', function(){
        let scores = localStorage.ranking ? JSON.parse(localStorage.ranking) : [];
        let container = $('#rankingContainer');
        let content = $('#rankingContent');
        content.empty();
        
        if (scores.length === 0) {
            content.append("<p>No hi ha puntuacions registrades.</p>");
        } else {
            let list = $("<ol style='text-align: left, padding-left: 40px;'></ol>");
            scores.forEach(s => {
                list.append(`<li><strong>${s.alias}</strong>: ${s.score} punts (Mode ${s.mode})</li>`);
            });
            content.append(list);
        }
        container.show();
    });

    $('#closeRanking').on('click', function(){
        $('#rankingContainer').hide();
    });

    $('#exit').on('click', function(){
        if(confirm("Sortir del joc?")) {
            window.close();
        }
    });
    actualitzarRanking();
});

