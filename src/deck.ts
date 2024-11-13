import { Card } from "./card"

export class Deck {
    private _cards: Card[] = []
    get cards(): Card[] {
        return [...this._cards]
    }
    private _next: number = 0 // index ของ cards ที่จะแจก
    constructor() {
        this.reset()
    }
    shuffle() {//สับไพ่
        for (let index = 0; index < 100; index++) {
            const start = Math.floor(Math.random() * 52)
            const end = Math.floor(Math.random() * 52)
            const hold = this._cards[start]
            this._cards[start] = this._cards[end]
            this._cards[end] = hold
        }
    }
    draw(): Card | undefined {//แจกไพ่
        if (this._next < this._cards.length) {
            const card = this._cards[this._next]
            this._next++
            return card
        }
        return undefined
    }
    reset() {
        this._next = 0
        for (let index = 0; index < 52; index++) {
            this._cards[index] = Card.new(index)
        }
    }
}