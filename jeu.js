// ============================================================
// PARAMETRES
// ============================================================

const tempo = 120;

const dureeNoire = 60 / tempo;

const nombreQuestions = 10;


// ============================================================
// RYTHMES
//
// 1   = noire
// 0.5 = croche
//
// Toutes les cellules durent 4 temps.
// ============================================================

const rythmes = [

    {
        nom: "♩  ♩  ♩  ♩",
        valeurs: [1, 1, 1, 1]
    },

    {
        nom: "♩  ♪ ♪  ♩  ♩",
        valeurs: [1, 0.5, 0.5, 1, 1]
    },

    {
        nom: "♪ ♪  ♩  ♩  ♩",
        valeurs: [0.5, 0.5, 1, 1, 1]
    },

    {
        nom: "♩  ♩  ♪ ♪  ♩",
        valeurs: [1, 1, 0.5, 0.5, 1]
    },

    {
        nom: "♩  ♪ ♪  ♪ ♪  ♩",
        valeurs: [
            1,
            0.5,
            0.5,
            0.5,
            0.5,
            1
        ]
    },

    {
        nom: "♪ ♪  ♪ ♪  ♩  ♩",
        valeurs: [
            0.5,
            0.5,
            0.5,
            0.5,
            1,
            1
        ]
    }

];


// ============================================================
// VARIABLES DU JEU
// ============================================================

let score = 0;
let question = 0;

let bonneReponse = null;
let propositions = [];

let audioContext = null;


// ============================================================
// ELEMENTS HTML
// ============================================================

const elementQuestion =
    document.getElementById("question");

const elementMessage =
    document.getElementById("message");

const elementScore =
    document.getElementById("score");

const zoneReponses =
    document.getElementById("reponses");

const boutonEcouter =
    document.getElementById("ecouter");

const boutonSuivant =
    document.getElementById("suivant");

const fenetreFelicitations =
    document.getElementById("felicitations");

const boutonRejouer =
    document.getElementById("rejouer");


// ============================================================
// AUDIO
// ============================================================

function obtenirAudioContext() {

    if (audioContext === null) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    return audioContext;
}


// ============================================================
// CREER UNE PERCUSSION
// ============================================================

function creerPercussion(instant) {

    const contexte =
        obtenirAudioContext();

    // Oscillateur grave
    const oscillateur =
        contexte.createOscillator();

    // Volume
    const gain =
        contexte.createGain();

    oscillateur.type = "sine";

    // Départ légèrement plus aigu
    oscillateur.frequency.setValueAtTime(
        220,
        instant
    );

    // Descente rapide de fréquence
    oscillateur.frequency.exponentialRampToValueAtTime(
        120,
        instant + 0.06
    );


    // Attaque immédiate
    gain.gain.setValueAtTime(
        0.8,
        instant
    );

    // Extinction très rapide
    gain.gain.exponentialRampToValueAtTime(
        0.001,
        instant + 0.08
    );


    oscillateur.connect(gain);

    gain.connect(
        contexte.destination
    );


    oscillateur.start(
        instant
    );

    oscillateur.stop(
        instant + 0.09
    );
}


// ============================================================
// JOUER UNE CELLULE COMPLETE
// ============================================================

function jouerRythme(rythme) {

    const contexte =
        obtenirAudioContext();

    const debut =
        contexte.currentTime + 0.10;

    let position = 0;

    rythme.valeurs.forEach(
        (valeur) => {

            const instant =
                debut +
                position * dureeNoire;

            creerPercussion(
                instant
            );

            position += valeur;
        }
    );
}


// ============================================================
// ECOUTER
// ============================================================

async function ecouter() {

    if (bonneReponse === null) {
        return;
    }

    const contexte =
        obtenirAudioContext();

    if (contexte.state === "suspended") {
        await contexte.resume();
    }

    jouerRythme(
        bonneReponse
    );
}


// ============================================================
// MELANGER UNE LISTE
// ============================================================

function melanger(tableau) {

    const copie = [...tableau];

    for (
        let i = copie.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copie[i],
            copie[j]
        ] = [
            copie[j],
            copie[i]
        ];
    }

    return copie;
}


// ============================================================
// NOUVELLE QUESTION
// ============================================================

function nouvelleQuestion() {

    if (question >= nombreQuestions) {

        finDuJeu();

        return;
    }


    question++;

    elementQuestion.textContent =
        "Question "
        + question
        + " / "
        + nombreQuestions;


    elementMessage.textContent =
        "Écoute le rythme";

    elementMessage.style.color =
        "#ffcc55";


    // Choisir le bon rythme
    bonneReponse =
        rythmes[
            Math.floor(
                Math.random()
                * rythmes.length
            )
        ];


    // Récupérer les mauvaises réponses
    let mauvaises =
        rythmes.filter(
            rythme =>
                rythme !== bonneReponse
        );


    mauvaises =
        melanger(mauvaises)
        .slice(0, 3);


    propositions =
        melanger(
            [
                ...mauvaises,
                bonneReponse
            ]
        );


    afficherReponses();


    boutonSuivant.disabled =
        true;
}


// ============================================================
// AFFICHER LES REPONSES
// ============================================================

function afficherReponses() {

    zoneReponses.innerHTML = "";


    propositions.forEach(
        (rythme, index) => {

            const bouton =
                document.createElement(
                    "button"
                );

            bouton.className =
                "reponse";

            bouton.textContent =
                rythme.nom;


            bouton.addEventListener(
                "click",
                () => verifierReponse(
                    index,
                    bouton
                )
            );


            zoneReponses.appendChild(
                bouton
            );
        }
    );
}


// ============================================================
// VERIFIER LA REPONSE
// ============================================================

function verifierReponse(
    index,
    boutonChoisi
) {

    const choix =
        propositions[index];

    const boutons =
        document.querySelectorAll(
            ".reponse"
        );


    boutons.forEach(
        bouton => {
            bouton.disabled = true;
        }
    );


    if (choix === bonneReponse) {

        score++;

        elementMessage.textContent =
            "✓ Bonne réponse !";

        elementMessage.style.color =
            "#55dd88";

        boutonChoisi.classList.add(
            "correcte"
        );

    } else {

        elementMessage.textContent =
            "✗ Mauvaise réponse";

        elementMessage.style.color =
            "#ff6666";

        boutonChoisi.classList.add(
            "incorrecte"
        );


        // Montrer également
        // la bonne réponse

        boutons.forEach(
            (bouton, numero) => {

                if (
                    propositions[numero]
                    === bonneReponse
                ) {

                    bouton.classList.add(
                        "correcte"
                    );
                }

            }
        );
    }


    elementScore.textContent =
        "Score : " + score;


    boutonSuivant.disabled =
        false;
}


// ============================================================
// FIN DU JEU
// ============================================================

function finDuJeu() {

    boutonEcouter.disabled =
        true;

    boutonSuivant.disabled =
        true;


    if (score === nombreQuestions) {

        elementMessage.textContent =
            "PARFAIT ! 10 / 10";

        elementMessage.style.color =
            "#ffd700";

        lancerFelicitations();

    } else {

        elementMessage.textContent =
            "Partie terminée ! Score final : "
            + score
            + " / "
            + nombreQuestions;

        elementMessage.style.color =
            "#55dd88";
    }
}


// ============================================================
// CONFETTIS
// ============================================================

function lancerFelicitations() {

    fenetreFelicitations.classList.remove(
        "cache"
    );


    const canvas =
        document.getElementById(
            "confettis"
        );

    const ctx =
        canvas.getContext("2d");


    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;


    const couleurs = [

        "#FFD700",
        "#FF5555",
        "#55DD88",
        "#5599FF",
        "#FF66CC",
        "#FFFFFF"

    ];


    const confettis = [];


    for (let i = 0; i < 120; i++) {

        confettis.push({

            x:
                Math.random()
                * canvas.width,

            y:
                Math.random()
                * canvas.height
                - canvas.height,

            taille:
                4
                + Math.random() * 8,

            vitesse:
                2
                + Math.random() * 5,

            couleur:
                couleurs[
                    Math.floor(
                        Math.random()
                        * couleurs.length
                    )
                ],

            oscillation:
                Math.random() * 6.28

        });
    }


    function animer() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        confettis.forEach(
            confetti => {

                confetti.y +=
                    confetti.vitesse;

                confetti.oscillation +=
                    0.05;

                confetti.x +=
                    Math.sin(
                        confetti.oscillation
                    );


                if (
                    confetti.y
                    > canvas.height
                ) {

                    confetti.y =
                        -20;

                    confetti.x =
                        Math.random()
                        * canvas.width;
                }


                ctx.fillStyle =
                    confetti.couleur;

                ctx.fillRect(
                    confetti.x,
                    confetti.y,
                    confetti.taille,
                    confetti.taille
                );

            }
        );


        if (
            !fenetreFelicitations
            .classList
            .contains("cache")
        ) {

            requestAnimationFrame(
                animer
            );
        }
    }


    animer();
}


// ============================================================
// REJOUER
// ============================================================

function rejouer() {

    score = 0;
    question = 0;

    bonneReponse = null;

    elementScore.textContent =
        "Score : 0";

    boutonEcouter.disabled =
        false;

    fenetreFelicitations
        .classList
        .add("cache");

    nouvelleQuestion();
}


// ============================================================
// EVENEMENTS
// ============================================================

boutonEcouter.addEventListener(
    "click",
    ecouter
);


boutonSuivant.addEventListener(
    "click",
    nouvelleQuestion
);


boutonRejouer.addEventListener(
    "click",
    rejouer
);


// ============================================================
// DEMARRAGE
// ============================================================

nouvelleQuestion();