# 🎵 Jeu de reconnaissance rythmique

Petit jeu pédagogique interactif consacré à la reconnaissance auditive du rythme.

Le joueur écoute une cellule rythmique puis doit identifier, parmi quatre propositions, celle qui correspond au rythme entendu.

## 🎯 Objectif pédagogique

Le jeu permet de travailler :

- la pulsation ;
- la distinction entre noires et croches ;
- la reconnaissance de cellules rythmiques ;
- la mémoire auditive ;
- la régularité métrique.

Le tempo actuel est fixé à **120 BPM**.

## 🎮 Comment jouer ?

1. Cliquer sur **ÉCOUTER**.
2. Écouter attentivement la cellule rythmique.
3. Choisir l'une des quatre réponses proposées.
4. Le jeu indique si la réponse est correcte.
5. Cliquer sur **QUESTION SUIVANTE**.

Une partie comporte **10 questions**.

Un score de **10/10** déclenche une animation de félicitations. 🎉

## 🔊 Audio

Le moteur sonore utilise la Web Audio API du navigateur.

Les événements rythmiques sont positionnés sur l'horloge audio afin de respecter précisément les durées relatives :

- noire = 1 temps ;
- croche = 1/2 temps.

À 120 BPM :

- noire = 0,5 seconde ;
- croche = 0,25 seconde.

## 💻 Technologies utilisées

Le jeu fonctionne entièrement dans le navigateur avec :

- HTML
- CSS
- JavaScript
- Web Audio API

Aucune installation Python n'est nécessaire pour jouer à la version web.

## 📁 Structure du projet

```text
jeu-rythmique/
├── index.html
├── style.css
├── jeu.js
└── README.md
