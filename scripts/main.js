window.onload = () => {
    // Point d'entrée du script
    // C'est ici qu'on initialise les classes
    // et qu'on gère le bouton play pour lancer une partie
    // On doit aussi gérer l'affichage et le désaffichage du bouton "play"
}

/**
 * Classe qui représente le Jeu JanKenPon et permet de lancer une partie
 */
class Game {
    /**
     * 
     * @param {Player} player1 
     * @param {Player} player2 
     * @param {String} hand_container_selector 
     */
    constructor(player1, player2, hand_container_selector) {
        this.player1 = player1
        this.player2 = player2
        this.is_animation_end = false // animationend event is fired twice because each element will trigger the event thats why we need a boolean
        this.hand_container_element = document.querySelector(hand_container_selector)
    }

    play() {
        this.reset()
        this.hand_container_element.classList.toggle('shuffle') // Lance l'animation de jeu

        this.hand_container_element.addEventListener('animationend', () => {
            if (this.is_animation_end) return
            this.is_animation_end = true

            /**
             ***********************
             ***********************
             * @TODO
             * Section coeur qui gère la logique d'une partie lancée
             * Il faut récupérer le choix de chaque joueur
             * Mettre à jour les mains
             * Déterminer qui a gagné
             ***********************
             ***********************
             */

            this.hand_container_element.classList.toggle('shuffle')
            this.onPlayed()
        })
    }

    reset() {
        this.is_animation_end = false
        this.player1.resetHand()
        this.player2.resetHand()
    }

    onPlayed = () => {}
}

/**
 * Classe Player qui représente un joueur
 */
class Player {
    /**
     * 
     * @param {ScoreUI} scoreUI 
     * @param {HandUI} handUI 
     */
    constructor(scoreUI, handUI) {
        this.scoreUI = scoreUI
        this.handUI = handUI
    }

    win() { this.scoreUI.adddPoint() }

    getChoice() { return JanKenPon.getRandom() }

    resetHand() { throw "[Error] Not implemented" }
}

/**
 * Classe HandUI qui permet de gérer une main qui représente Jan-Ken-Pon sur la page web
 */
class HandUI {
    /**
     * 
     * @param {String} hand_selector 
     */
    constructor(hand_selector) {
        this.element = document.querySelector(hand_selector)
        this.image_element = null
        this.reset()
    }

    set image(image_name) { this.image_element.setAttribute('src', `images/${image_name}.png`) }

    updateUI(element) { this.image = element.name }

    reset() { this.updateUI(JanKenPon.default) }
}

/**
 * Classe ScoreUI qui permet de gérer un score sur la page web
 */
class ScoreUI {
    /**
     * 
     * @param {String} score_selector 
     */
    constructor(score_selector) {
        this.reset()
    }

    get score() { return this.scoreValue }
    set score(value) {
        this.scoreValue = parseInt(value, 10)
        this.updateUI()
    }

    updateUI() { throw "[Error] Not implemented" }

    addPoint() { throw "[Error] Not implemented" }

    reset() { this.score = 0 }
}

/**
 * Classe utilitaire qui gère les éléments Pierre/Feuille/Ciseaux
 */
class JanKenPon {
    static ELEMENTS = {
        ROCK: { name: "rock", isBeatenBy: element => element.name === this.ELEMENTS.SCISSOR.name },
        PAPER: { name: "papeer", isBeatenBy: element => element.name === this.ELEMENTS.ROCK.name },
        SCISSOR: { name: "scissor", isBeatenBy: element => element.name === this.ELEMENTS.PAPER.name }
    }

    static default = this.ELEMENTS.PAPER

    /**
     * Récupère au hasard un élément Pierre, Feuille ou Ciseau
     */
    static getRandom() {
        const ELEMENTS_ARRAY = Object.keys(this.ELEMENTS)
            , RANDOM_NUM = Math.floor(Math.random() * ELEMENTS_ARRAY.length)

        return this.ELEMENTS[ELEMENTS_ARRAY[RANDOM_NUM]]
    }
}