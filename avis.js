export function ajoutListenerAvis(){
    const piecesElements = document.querySelectorAll(".fiches article button");
    for(let i = 0; i < piecesElements.length; i++){
        piecesElements[i].onclick = async (e) => {
            const idBtn = e.target.dataset.id;
            const reponse = await fetch(`http://localhost:8081/pieces/${idBtn}/avis`),
            avis = await reponse.json(),
            avisElement = document.createElement('p');

            const parentEl = e.target.parentElement;
            for(let i = 0; i < avis.length; i++){
                avisElement.innerHTML += `${avis[i].utilisateur} : ${avis[i].commentaire} <br>`;
            }
            
            parentEl.appendChild(avisElement);


        }
    }
}
