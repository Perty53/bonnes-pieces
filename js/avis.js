export function ajoutListenerAvis() {
    const piecesElements = document.querySelectorAll(".fiches article button");
    for (let i = 0; i < piecesElements.length; i++) {
        piecesElements[i].onclick = async (e) => {
            const btn = e.target;
            const avisElement = document.createElement('p');
            avisElement.id = `avis-${i+1}`
            if (btn.dataset.content === "hide-av") {
                const idBtn = btn.dataset.id;

                let avis = localStorage.getItem("avis");
                if (avis === null) {
                    avis = await fetch(`http://localhost:8081/pieces/${idBtn}/avis`).then(avis => avis.json());

                    localStorage.setItem(`avis${i + 1}`, JSON.stringify(avis));
                } else {
                    avis = JSON.parse(avis);
                }

                

                const parentEl = e.target.parentElement;
                for (let i = 0; i < avis.length; i++) {
                    avisElement.innerHTML += `<b>${avis[i].utilisateur}</b> : <i>${avis[i].commentaire} </i><br>${avis[i].nbEtoiles ?? 0} étoiles <br><br>`;
                }

                parentEl.appendChild(avisElement);

                btn.dataset.content = "show-av";
                btn.textContent = "Masquer les avis";

            } else {
                document.querySelector(`#avis-${i+1}`).remove();
                btn.dataset.content = "hide-av";
                btn.textContent = "Afficher les avis";
            }

        }
    }
}


export function ajoutListenerEnvoyerAvis() {
    const formAvis = document.querySelector('.form-avis');
    formAvis.onsubmit = (e) => {
        e.preventDefault();

        const avis = JSON.stringify({
            "pieceId": parseInt(e.target.querySelector('[name=piece-id]').value),
            "utilisateur": e.target.querySelector('[name=utilisateur]').value,
            "commentaire": e.target.querySelector("[name=commentaire]").value,
            "nbEtoiles": parseInt(e.target.querySelector("[name=etoiles]").value)
        });

        fetch("http://localhost:8081/avis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: avis
        });
    }
}



export async function showGraphicAVis() {
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const nb_comments = [0, 0, 0, 0, 0];

    for (let av of avis) {
        nb_comments[av.nbEtoiles - 1]++;
    }

    const labels = ["1", "2", "3", "4", "5"].reverse();

    const data = {
        labels: labels,
        datasets: [{
            label: "Etoiles attribuées",
            data: nb_comments.reverse(),
            backgroundColor: ["rgba(75,255,10,1)", "rgba(55, 250, 10, .7)", "rgba(255,215,5,1)", "rgba(255, 120, 5, 1)", "rgba(255, 0, 0, 1)"],
            borderColor: "rgba(0,0,255,.2)",
            borderWidth: 1,
        }]

    }
    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: 'y',
        },
    }

    const graph = new Chart(document.querySelector("#graphique-avis"), config,);
    console.log(graph);
}

export async function showGraphiqueComment() {
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    const pieces = await fetch("http://localhost:8081/pieces").then(pieces => pieces.json());

    const nb_comments = [0, 0];
    for (let av of avis) {
        ((pieces[av.pieceId - 1]).disponibilite) ? nb_comments[0]++ : nb_comments[1]++;
    }

    const labels = ["Dispo", "Non Dispo"];

    const data = {
        labels: labels,
        datasets: [{
            label: "Nombre de commentaires",
            data: nb_comments,
            backgroundColor: ["rgb(0,255,0)", "rgb(255,0,0)"],
        }]
    }

    const config = {
        type: "bar",
        data: data,
        options: {
            indexAxis: "x",
        },
    }

    const graph = new Chart(document.querySelector("#graphique-comment"), config,);

}
