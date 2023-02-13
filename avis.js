export function ajoutListenerAvis(){
    const piecesElements = document.querySelectorAll(".fiches article button");
    for(let i = 0; i < piecesElements.length; i++){
        piecesElements[i].onclick = async (e) => {
            const idBtn = e.target.dataset.id;
            
            let avis = localStorage.getItem("avis");
            if(avis === null){
                 avis = await fetch(`http://localhost:8081/pieces/${idBtn}/avis`).then(avis => avis.json());

                 localStorage.setItem(`avis${i+1}`, JSON.stringify(avis));
            } else {
                avis = JSON.parse(avis);
            }
            
            const avisElement = document.createElement('p');

            const parentEl = e.target.parentElement;
            for(let i = 0; i < avis.length; i++){
                avisElement.innerHTML += `<b>${avis[i].utilisateur}</b> : <i>${avis[i].commentaire} </i><br>${avis[i].nbEtoiles??0} étoiles <br><br>`;
            }
            
            parentEl.appendChild(avisElement);


        }
    }
}

export function ajoutListenerEnvoyerAvis(){
    const formAvis = document.querySelector('.form-avis');
    formAvis.onsubmit = (e) => {
        e.preventDefault();

        const avis = JSON.stringify({"pieceId" : parseInt(e.target.querySelector('[name=piece-id]').value), 
        "utilisateur": e.target.querySelector('[name=utilisateur]').value,
        "commentaire":e.target.querySelector("[name=commentaire]").value,
        "nbEtoiles": parseInt(e.target.querySelector("[name=etoiles]").value)
        });

        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: avis
        });
    }
}
