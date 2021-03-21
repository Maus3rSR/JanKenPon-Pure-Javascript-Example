window.onload = () => {
    const player1 = new Player(
            new ScoreUI('.score__left'),
            new HandUI('.hand__left')
        )
        , player2 = new Player(
            new ScoreUI('.score__right'),
            new HandUI('.hand__right')
        )
        , game = new Game(player1, player2, '.hand_container')

    document.querySelector('#play_button').addEventListener('click', event => {
        event.target.hidden = true
        game.onPlayed = () => event.target.hidden = false
        game.play()
    })
}

class Game {
    constructor(player1, player2, hand_container_selector) {
        this.player1 = player1
        this.player2 = player2
        this.is_animation_end = false // animationend event is fired twice because each element will trigger the event thats why we need a boolean

        this.hand_container_element = document.querySelector(hand_container_selector)
    }

    play() {
        this.reset()
        this.hand_container_element.classList.toggle('shuffle')

        this.hand_container_element.addEventListener('animationend', () => {
            if (this.is_animation_end) return

            const element1 = this.player1.getChoice()
                , element2 = this.player2.getChoice()

            this.is_animation_end = true
            this.player1.handUI.updateUI(element1)
            this.player2.handUI.updateUI(element2)

            if (element1.isBeatenBy(element2)) this.player2.win()
            else if (element2.isBeatenBy(element1)) this.player1.win()
            
            this.hand_container_element.classList.toggle('shuffle')
            this.onPlayed()
        })
    }

    reset() {
        this.is_animation_end = false
        this.player1.handUI.reset()
        this.player2.handUI.reset()
    }

    onPlayed = () => {}
}

class Player {
    constructor(scoreUI, handUI) {
        this.scoreUI = scoreUI
        this.handUI = handUI
    }

    win() { this.scoreUI.addPoint() }
    getChoice() { return JanKenPon.getRandom() }
}

class HandUI {
    constructor(hand_selector) {
        this.element = document.querySelector(hand_selector)
        this.image_element = this.element.querySelector('img')
        this.reset()
    }

    set image(image_name) { this.image_element.setAttribute('src', `images/${image_name}.png`) }

    updateUI(element) { this.image = element.name }
    reset() { this.updateUI(JanKenPon.default) }
}

class ScoreUI {
    constructor(score_selector) {
        this.element = document.querySelector(score_selector)
        this.reset()
    }

    get score() { return this.scoreValue }
    set score(value) {
        this.scoreValue = parseInt(value, 10)
        this.updateUI()
    }

    updateUI() { this.element.textContent = this.score }
    addPoint() { this.score++ }
    reset() { this.score = 0 }
}

class JanKenPon {
    static ELEMENTS = {
        ROCK: { name: "rock", isBeatenBy: element => element.name === this.ELEMENTS.PAPER.name },
        PAPER: { name: "paper", isBeatenBy: element => element.name === this.ELEMENTS.SCISSOR.name },
        SCISSOR: { name: "scissor", isBeatenBy: element => element.name === this.ELEMENTS.ROCK.name }
    }

    static default = this.ELEMENTS.ROCK

    static getRandom() {
        const ELEMENTS_ARRAY = Object.keys(this.ELEMENTS)
            , RANDOM_NUM = Math.floor(Math.random() * ELEMENTS_ARRAY.length)

        return this.ELEMENTS[ELEMENTS_ARRAY[RANDOM_NUM]]
    }
}