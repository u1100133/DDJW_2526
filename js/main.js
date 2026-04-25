import {$} from "../library/jquery-4.0.0.slim.module.min.js";

addEventListener('load', function() {
    $('#play').on('click', 
    function(){
        //Demanem l'àlies i el guardem en variable
		let alias = prompt("Introdueix el teu àlies:");
		
		//Ara ho mostrem per consola
		console.log("L'àlies introduït és: " + alias);
        sessionStorage.removeItem('load');
        window.location.assign("./html/game.html");
    });

    $('#options').on('click', 
    function(){
        window.location.assign("./html/options.html");
    });

    $('#saves').on('click', 
    function(){
        let to_load = localStorage.save;
        fetch('../php/load.php', {
            method: "POST",
            body: JSON.stringify({}),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(json => to_load = (!json.error)?JSON.stringify(json.save): localStorage.save)
        .catch (err => {
            console.error(err);
            console.warn("La partida s'intentarà carregar de local");
        });

        if (!to_load) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.load = to_load;
        window.location.assign("./html/game.html");
    });

    $('#exit').on('click', 
    function(){
        console.warn("No es pot sortir!");
    });
});

