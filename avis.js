export function ajoutListenerAvis(){
    const piecesElements = document.querySelectorAll(".fiches article button");
    for(let i = 0; i < piecesElements.length; i++){
        piecesElements[i].onclick = async(e) => {
           const id = e.target.dataset.id;
           console.log(id);
           fetch(`http://localhost:8081/pieces/${id}/avis`);
        }
    }
} 
