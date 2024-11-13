import type { Card } from "./card"
import type { IController } from "./icontroller.interface"
import type { IPrinter } from "./iprinter.interface"

export class Player {
    private _id: number = Math.random()
    private _cards: Card[] = []
    private _points: number = 0
    private _bet: number = 0
    constructor(public printer: IPrinter, private _controller: IController, private _name: string, private _coins: number) {
        this._id = Math.random()
        this._controller.setContext(this)
    }
    get id(): number { return this._id }
    get controller(): IController { return this._controller }
    get coins(): number { return this._coins }

    set coins(value: number) {
        this._coins += value
    }

    get bet(): number { return this._bet }
    set bet(value: number) { this._bet = value }

    get name(): string { return this._name }
    get cards(): Card[] { return [...this._cards] }
    get points(): number {
        return this._points
    }

    get isPok(): boolean {
        const isHave2Cards = this._cards.length === 2
        const is9points = this._points === 9
        const is8points = this._points === 8
        const is9or8Points = is8points || is9points
        const isPok = isHave2Cards && is9or8Points
        return isPok
    }

    get isDeng(): boolean {
        let isSameSuit = false
        if (this._cards.length >= 2)
            isSameSuit = this._cards[0].suit === this._cards[1].suit
        if (this._cards.length === 3)
            isSameSuit = isSameSuit && this._cards[0].suit === this._cards[2].suit
        return isSameSuit
    }

    get isThreeOfKind(): boolean {
        const isValidNumberOfCard = this._cards.length === 3
        if (!isValidNumberOfCard) return false
        let isSameNumber = this._cards[0].number === this._cards[1].number
        isSameNumber = isSameNumber && this._cards[0].number === this._cards[2].number
        return isSameNumber
    }

    get isStraight(): boolean {
        const isValidNumberOfCard = this._cards.length === 3
        if (!isValidNumberOfCard) return false
        const sortCards = this._cards.sort((a, b) => a.number - b.number)
        const isSequenceCard1andCard2 = sortCards[0].number === sortCards[1].number - 1
        const isSequenceCard2andCard3 = sortCards[1].number === sortCards[2].number - 1
        const isSequence = isSequenceCard1andCard2 && isSequenceCard2andCard3
        return isSequence
    }

    get isStraightFlush(): boolean {
        if (!this.isDeng) return false
        return this.isStraight
    }

    get isCourt(): boolean {
        const valid: boolean[] = []
        for (const card of this._cards) {
            if (card.number > 10) valid.push(true)
        }
        return valid.length === 3
    }

    toString(): string { return `${this.name}` }
    addCard(card: Card): number {
        if (this._cards.length < 3)
            this._cards.push(card)
        this.calculatePoints()
        return this._cards.length
    }
    private calculatePoints() {
        this._points = 0
        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i]
            this._points = (this._points + card.points) % 10
        }
    }

    get showHand(): string {
        let rs = ''
        for (const card of this._cards) {
            rs += `[${card.toString()}] `
        }
        return rs
    }

    clearCard() {
        this._points = 0
        this._cards = []
    }
}