import { CardNumber } from "./card_number"
import { CardSuit } from "./card_suit"

export class Card {
    constructor(private _suit: CardSuit, private _number: CardNumber) { }

    get suit(): CardSuit {
        return this._suit
    }
    get number(): CardNumber {
        return this._number
    }
    get points(): number {
        if (this.number >= 10)
            return 0
        return this._number
    }
    toString(): string {
        return `${CardNumber[this.number]} ${CardSuit[this._suit]}`
    }
    numberEqualTo(other: Card): boolean {
        return this.number === other.number
    }
    static new(index: number): Card {
        index = Math.abs(index) % 52
        const suit = Math.floor(index / 13)
        const number = (index % 13) + 1
        return new Card(suit, number)
    }
}