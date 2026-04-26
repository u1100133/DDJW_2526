# Treball Individual DDJW - Memory

Aquest repositori conté la implementació completa del memory de l'assignatura de DDJW. El projecte expandeix la base que hem realitzat a les classes de teoria, afegint noves funcionalitats de joc.

## 1. Introducció
L'objectiu d'aquest treball ha set aprofundir amb els conceptes apresos de programació en JavaScript, la gestió de l'estat d'un joc, l'ús de l'API de Canvas i l'emmagatzematge de dades de forma local sense dependre de servidors externs.

## 2. Disseny del joc

### Mida de Grup Variable
El joc modificat i millorat permet configurar la mida dels grups a endevinar del memory:
* **Parelles**
* **Trios**
* **Quartets**

La dificultat i el nombre de cartes totals del tauler s'adapten segons aquesta configuració.

### Modes de Joc
1.  **Mode 1 (Normal):** Des del menú d'opcions, l'usuari pot triar el nombre de grups de cartes, la dificultat i la mida dels grups. Es juga una única partida, començant amb puntuació 200 i restant 25 per error, fins que es completa el memory o la puntuació arriba a 0.
2.  **Mode 2 (Infinit):** El joc comença en el nivell seleccionat des del menú d'opcions. Cada cop que l'usuari completa un nivell, s'incrementa el nombre de grups (un grup més per nivell), mantenint la puntuació. Aquí també aplica que l'usuari pugui triar el nombre de grups de cartes, dificultat i mida de grups. El joc segueix infinitament fins que l'usuari ha comès tants errors que la puntuació ha arribat a 0.

## 3. Implementació

### Lògica base del Joc
Es gestiona un array de selecció (`cartesSeleccionades`) en lloc d'una sola carta prèvia. Això permet que la comprovació d'encert només s'executi quan l'usuari ha girat exactament el nombre de cartes indicat per la mida del grup.

### Interfície
He implementat una graella dinàmica que calcula les coordenades (files i columnes) de les cartes per assegurar que el tauler estigui centrat i sigui jugable independentment del nombre de cartes (això és especialment important i es nota en el Mode 2).
He creat 10 tipus de carta diferents en SVG (rodona, quadrat, triangle, diamant i estrella; blaves i grogues). La part de darrere és blau marí, mantenint així l'estètica inicial.

### Sistema de Rànking
Cada vegada que una partida acaba es guarda el seu àlias i puntuació. Des del menú es pot accedir a un rànking on es guarden els jugadors amb les 5 millors puntuacions.

### Sistema de Guardat
He creat un sistema que permet guardar diverses partides utilitzant uns IDs que estan basats en time stamps. Des del menú principal, l'usuari pot triar quina partida guardada carregar i seguir jugant. En cas de que es torni a guardar la mateixa partida, el guardat es sobreescriu. Si la partida s'acaba, s'elimina del llistat de partides guardades.

## 4. Controls
* **Ratolí:** Es pot fer clic sobre les cartes per girar-les.
* **Teclat:** * Es poden utilitzar les fletxetes per seleccionar les cartes.
    * `Enter` per girar la carta seleccionada.
    * `Escape` per guardar la partida actual i tornar al menú.

## 5. Problemes importants trobats
M'he trobat varis problemes importants durant la implementació
* **Partides guardades duplicades:** Quan es guardava una partida que ja tenia un registre de guardat, en comptes de sobreescriure-la es creava un guardat nou al menú. M'havia equivocat al guardar la variable de la ID com a "id", però al carregar buscava "saveID". Això feia que el joc no trobés cap "id" i es pensava que era una partida nova.
* **Partides guardades no s'esborraven al acabar:** Quan carregava una partida guardada des del menú i l'acabava, ja fós guanyant o perdent, se'm mostrava l'alerta de finalització i tornava al menú, però deixava el registre de la partida guardada al localStorage. He afegit un bloc de codi (un if) a la funció endGame de memory.js que comprova si la partida té un identificador previ saveID, és a dir, és guardada. Si en té, llegeix totes les partides del localStorage per descartar la partida actual i així desparaeixer del menú.

## 6. Conclusions
Degut a la meva absència durant les primeres dues setmanes de semestre portava aquesta assignatura força endarrerida. El treball realitzat a aquesta pràctica m'ha ajudat moltíssim a consolidar conceptes, i tot i que no m'hagi sortit tot del tot com volia, estic satisfet amb el resultat.

---
Pol Pastor Fajula
u1100133
