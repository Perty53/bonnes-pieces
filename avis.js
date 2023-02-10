export function ajoutListenerAvis(){
    const piecesElements = document.querySelectorAll(".fiches article button");
    for(let i = 0; i < piecesElements.length; i++){
        piecesElements[i].onclick = async(e) => {
           const id = e.target.dataset.id;
           const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
           const avis = await reponse.json();
           const pieceElement = e.target.parentElement;
            const avisElement = document.createElement('p');
            pieceElement.appendChild(avisElement);
            
           for(let i = 0; i < avis.length; i++){
            avisElement.innerHTML = `${avis[i].utilisateur} : ${avis[i].commentaire} <br>`;
           }
        }
    }
} 
