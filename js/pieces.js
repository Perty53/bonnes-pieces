import { ajoutListenerAvis, ajoutListenerEnvoyerAvis, showGraphicAVis, showGraphiqueComment } from "./avis.js";

//Recuperation des pieces eventuellement stockees en local
let pieces = window.localStorage.getItem("pieces");

//Recuperation des pieces depuis l'API HTTP
if(pieces === null){
     pieces = await fetch(`http://localhost:8081/pieces`).then(pieces => pieces.json());
    //const pieces = await reponse.json();

    //Sauvegarde en local
    const piecesStr = JSON.stringify(pieces);
    window.localStorage.setItem("pieces",piecesStr);
} else {
    pieces = JSON.parse(pieces);
}


const fiches = document.querySelector('.fiches');
ajoutListenerEnvoyerAvis();
 
//fiche produits
var genererPieces = (pieces) => {
    for(let i = 0; i < pieces.length; i++){
        const article = pieces[i]
        const sectionFiches = document.querySelector('.fiches');
         
        const pieceElement = document.createElement("article");
        sectionFiches.appendChild(pieceElement);
    
        const imageElement = document.createElement('img');
        imageElement.src = pieces[i].image;
        const nomElement = document.createElement("h2"); 
        nomElement.innerText = pieces[i].nom;
        const prixElement = document.createElement('p')
        prixElement.innerText = `Prix : ${pieces[i].prix} $ (${pieces[i].prix < 50 ? "$" : "$$$"})`;
        const categorieElement = document.createElement('p');
        categorieElement.innerText = pieces[i].categorie ?? "(Aucune catégorie)";
        const descriptionElement = document.createElement('p')
        descriptionElement.innerText = pieces[i].description ?? "(Pas de description pour le moment !!!)";
        const dispo = document.createElement('p');
        dispo.innerText = (pieces[i].disponibilite ? "En Stock" : "Epuisé");
        
        const avisBtn = document.createElement('button');
        avisBtn.dataset.id = article.id;
        avisBtn.dataset.content = "hide-av";
        avisBtn.textContent = "Afficher les avis";
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(dispo);
        pieceElement.appendChild(avisBtn);
        
    }
    ajoutListenerAvis();
}
genererPieces(pieces);

const btntriercro = document.querySelector(".btn-trier-cro");
btntriercro.onclick = () => {
    const piecesOrdonnees = Array.from(pieces)
    piecesOrdonnees.sort((a, b) => {
        return a.prix - b.prix;
    });
    console.log(piecesOrdonnees)
    fiches.innerHTML=''
    genererPieces(piecesOrdonnees)
}

const btntrierdecr = document.querySelector(".btn-trier-dec");
btntrierdecr.onclick = () => {
    const piecesOrdonnees = Array.from(pieces)
    piecesOrdonnees.sort((a, b) => {
        return b.prix - a.prix;
    });
    console.log(piecesOrdonnees);
    fiches.innerHTML = '';
    genererPieces(piecesOrdonnees);
    

}

const btnfiltrernonab = document.querySelector(".btn-filtrer-na");
btnfiltrernonab.onclick = () => {
    const piecesFiltrees = pieces.filter((pce) => {
        return pce.prix <= 35;
    })
     console.log(piecesFiltrees);
     fiches.innerHTML = '';
     genererPieces(piecesFiltrees);
}

const btnfiltrerdescr = document.querySelector(".btn-filtrer-desc");
btnfiltrerdescr.onclick = () => {
    const piecesFiltrees = pieces.filter((pce) => {
        return pce.description;
    })
     console.log(piecesFiltrees);
     fiches.innerHTML = '';
     genererPieces(piecesFiltrees);
}

const nomsAb = pieces.map(pieces => pieces.nom),
nomDis = pieces.map(pieces => pieces.nom + ' - ' +pieces.prix+ " $ ");


for(let i = pieces.length - 1; i >= 0; i--){
    if(pieces[i].prix > 35){
        nomsAb.splice(i,1);
    }
    
    
    if (!pieces[i].disponibilite){
        nomDis.splice(i,1);
    } 
}

const filtreParPrix = document.querySelector("#fprix");
filtreParPrix.onchange = () => {
    console.log(filtreParPrix.value)
    
    const piecesFiltrees = pieces.filter(pce => pce.prix <= filtreParPrix.value);
    fiches.innerHTML='';
    genererPieces(piecesFiltrees)
};

const abordElements = document.createElement('ul'),
dispoElements = document.createElement('ul')
for(let i = 0; i < nomsAb.length; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = nomsAb[i];
    abordElements.appendChild(nomElement)
}

for(let i = 0; i < nomDis.length; i++){
    const infoElement = document.createElement('li');
    infoElement.innerText = nomDis[i];
    dispoElements.appendChild(infoElement);
}

document.querySelector('.abordables').appendChild(abordElements);
document.querySelector('.dispo').appendChild(dispoElements);


//Gerer les pieces dans le localStorage
const btnMettreAJour = document.querySelector(".btn-maj");
btnMettreAJour.onclick = () => {
    window.localStorage.removeItem('pieces');
    const piecesElements = document.querySelectorAll(".fiches article button");
    for(let i = 0; i < piecesElements.length; i++){
        window.localStorage.removeItem(`avis${i+1}`);
    }
    location.reload();
}

showGraphicAVis();
showGraphiqueComment();