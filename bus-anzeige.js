"use strict";

function meldungAusgeben(meldung) {
    if (meldung == null) {
        alert("Programmfehler: meldungAusgeben mit leerer meldung");
        return;
    }
    let meldungElement = document.getElementById('meldung'); 
    if (meldungElement == null) {
        alert("Formularfehler: Id meldung fehlt");
        return;
    }
    meldungElement.innerHTML = meldung;
}

function showScreenSize()
{
    let windowSize = "w: " + window.innerWidth + " h: " + window.innerHeight;
    // meldungAusgeben(windowSize);
}

let geschwindigkeit = 0;
let durchschnittsGeschwindigkeit = 6;
let clickgasgeben = 0;
let busleft = 20;
let bustop = 405;
let endpunkt = 1100;
let aIntervalId;
let gIntervalId;
let isErreicht = 0;
let ankunftGeplant;

function formatZeitpunkt(nowX) {
	return   nowX.getHours().toString() 
           + ":" + nowX.getMinutes().toString().padStart(2,'0') 
		   + ":" + nowX.getSeconds().toString().padStart(2,'0');
}

function gasgeben()
{
    if (isErreicht == 1) return;
    geschwindigkeit += 1;
    let ergebnis = document.getElementById('geschwindigkeit');
    ergebnis.innerHTML = 5 * geschwindigkeit + " km/h";	
    if (clickgasgeben == 0) {
        meldungAusgeben("&nbsp;"); // "Los"-Meldung löschen
		aIntervalId = setInterval (AktualisiereAnzeige, 1000) ;
		startAktualisiereGeschwindigkeit();
		let now = new Date();
		let zeitGeplant  = document.getElementById ("ZeitGeplant");
		let dauer = berechnenDauer() ;
		ankunftGeplant = new Date (now.getTime() + dauer * 1000) ;
		zeitGeplant.innerHTML = formatZeitpunkt(ankunftGeplant);
    }
    clickgasgeben += 1;
}

function AktualisiereAnzeige() {
 	let zeitReal = document.getElementById("ZeitReal");
	let now = new Date();
	zeitReal.innerHTML = formatZeitpunkt(now);
	if (isErreicht == 0)
        meldungAusgeben("&nbsp;");  
    if (busleft <= 120) return;
	if (busleft >= 1120) {
        meldungAusgeben("an Haltestelle vorbeigefahren!")     
        return; 
    }    
	if (geschwindigkeit == 0) {
        if (busleft >= 1090) {
			if (isErreicht == 0) {
			    let diff = ankunftGeplant.getTime() - now.getTime();
				let wie = "pünktlich";
				if (diff < -1400) wie = "zu spät";
				if (diff > 1400)  wie = "zu früh";
                meldungAusgeben("Haltestelle " + wie + " erreicht!");
                isErreicht = 1;
			}
            return;
        }
        meldungAusgeben("keine Haltestelle!");
    }
	let zeitVoraus = document.getElementById ("ZeitVoraus");
	let dauer = berechnenDauer();
	let now2 = new Date(now.getTime() + dauer * 1000);
	zeitVoraus.innerHTML = formatZeitpunkt(now2);
}

function bremsen()
{
    if (geschwindigkeit >= 1) {
        geschwindigkeit -= 1;
    }
    let ergebnis = document.getElementById("geschwindigkeit");
    ergebnis.innerHTML = 5 * geschwindigkeit + " km/h"; 
}

function busbewegen()
{
    let busContainer = document.getElementById ("busContainer") ;
    busContainer.style.top = bustop + "px";
    busContainer.style.left= busleft + "px";
    let busline = "l: " + Math.round(busleft) + " t: " + Math.round(bustop);
    // meldungAusgeben(busline);
    if (busleft > 1150) return;
    busleft += 0.2 * geschwindigkeit;
    bustop -= 0.08 * geschwindigkeit;
    if (geschwindigkeit > 0) {		
	    if (busleft >= 150) {
		    bustop += 0.016 * geschwindigkeit;
	    }
	    if (busleft >= 750) {
		    bustop += 0.012 * geschwindigkeit;
	    }
	    if (busleft >= 900) {
		    bustop += 0.012 * geschwindigkeit;
	    }		
	    if (busleft >= 1000) {
		    bustop += 0.012 * geschwindigkeit;
	    }
    }
}

function startAktualisiereGeschwindigkeit() {
	gIntervalId = setInterval(busbewegen, 20);
}

function berechnenDauer() {
	let dauer = (endpunkt - busleft) / ((geschwindigkeit + durchschnittsGeschwindigkeit) * 5 ) ;
	return dauer;
}

function neuStart()
{
    clearInterval(aIntervalId);
    clearInterval(gIntervalId);    
    busleft = 20;
    bustop = 405;
    geschwindigkeit = 0;
    clickgasgeben = 0;
    isErreicht = 0; 
    let ergebnis = document.getElementById('geschwindigkeit');
    ergebnis.innerHTML = "0 km/h";	 
	let zeitGeplant = document.getElementById ("ZeitGeplant");
	zeitGeplant.innerHTML = " ";    
	let zeitVoraus = document.getElementById ("ZeitVoraus");
	zeitVoraus.innerHTML = " ";  
    busbewegen();
    meldungAusgeben("Los geht es mit Klick auf Gas!");
}
	
window.onload = showScreenSize;
window.onresize = showScreenSize;
