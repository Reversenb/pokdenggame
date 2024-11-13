import type { Deck } from "./deck"
import type { IPrinter } from "./iprinter.interface"
import type { Player } from "./player"
import { PlayerController } from "./player_controller"

type VersusResult = { winner: Player, loser: Player, isTie: boolean }

export class PokDengGame {
    private _round = 1
    private _players: Player[] = []
    constructor(private _betLimit: number, private _dealer: Player, private _printer: IPrinter, private _deck: Deck) { }
    get round() { return this._round }
    addPlayer(p: Player) {
        this._players.push(p)
    }
    removePlayerNoCoins() {
        const playerHasCoins = this._players.filter((p) => p.coins > 0)
        const playerHasNoCoins = this._players.filter(p => p.coins <= 0)
        for (const player of playerHasNoCoins) {
            this._printer.print(` > kick ${player.name}`)
        }
        this._players = playerHasCoins
    }
    //todo:
    async play() {
        this._printer.print(`> round ${this._round}`)
        this._deck.reset()
        this._deck.shuffle()
        //แจกไพ่ใบที่ 1
        for (const player of this._players) {
            player.addCard(this._deck.draw()!)
        }
        this._dealer.addCard(this._deck.draw()!)
        //แสดงไพ่ในมือ เฉพาะผู้เล่นที่เป็นคน และ เจ้ามือ
        this._printer.print(`dealer 1st card: ${this._dealer.cards[0]}`)
        for (const player of this._players) {
            if (player instanceof PlayerController)
                this._printer.print(`${player.name} 1st card: ${this._dealer.cards[0]}`)
        }
        this._printer.print(`----------------------------`)
        //ลงเดิมพันเท่าไหร่
        for (const player of this._players) {
            await player.controller.setBet(this._betLimit)
        }
        //แจกไพ่ใบที่ 2
        for (const player of this._players) {
            player.addCard(this._deck.draw()!)
        }
        this._dealer.addCard(this._deck.draw()!)
        //แจกใบที่ 3
        for (const player of this._players) {
            const isHit = await player.controller.isHit()
            if (isHit) {
                player.addCard(this._deck.draw()!)
            }
        }
        const isHit = await this._dealer.controller.isHit()
        if (isHit) {
            this._dealer.addCard(this._deck.draw()!)
        }
        //วัดผล
        this._printer.print(`----------------------------`)
        for (const player of this._players) {
            const result = this.vs(this._dealer, player)
            if (result.isTie) {
                this._printer.print(` dealer vs ${player.name} is tie`)
            } else {
                this._printer.print(` > ${result.winner.name} win`)
                this._printer.print(` > ${result.winner.showHand}`)
                let winnerReward = result.winner.bet
                if (result.winner.isDeng) winnerReward *= result.winner.cards.length
                if (result.winner.isStraightFlush) winnerReward *= 2
                if (result.winner.isStraight || result.winner.isCourt || result.winner.isThreeOfKind) winnerReward *= 1.5
                this._printer.print(`   > ${result.winner.name} got ${winnerReward} coins`)
                result.winner.coins = winnerReward
                this._printer.print(` > ${result.loser.name} lose`)
                this._printer.print(` > ${result.loser.showHand}`)
                this._printer.print(`   > ${result.loser.name} got -${result.loser.bet} coins`)
                result.loser.coins = -result.loser.bet
            }
        }
        this.nextRound()
    }

    nextRound() {
        this._round++
        this.removePlayerNoCoins()
        for (const player of this._players) {
            player.clearCard()
        }
        this.play()
    }

    vs(p1: Player, p2: Player): VersusResult {
        let result: VersusResult = {
            winner: p1,
            loser: p2,
            isTie: false
        }
        result = this.checkPok(p1, p2, result)//
        result = this.checkStraightFlush(p1, p2, result)//
        result = this.checkStraight(p1, p2, result)//
        result = this.checkThreeOfKind(p1, p2, result)//
        result = this.checkCourt(p1, p2, result)//
        result = this.checkPoints(p1, p2, result)//
        return result
    }
    checkPoints(p1: Player, p2: Player, result: VersusResult): VersusResult {
        if (!p1.isPok && !p1.isStraight && !p1.isStraightFlush && !p1.isThreeOfKind && !p1.isCourt &&
            !p2.isPok && !p2.isStraight && !p2.isStraightFlush && !p2.isThreeOfKind && !p2.isCourt) {
            if (p1.points > p2.points) {
                result.winner = p1
                result.loser = p2
                result.isTie = false
            } else if (p2.points > p1.points) {
                result.winner = p2
                result.loser = p1
                result.isTie = false
            } else {
                result.isTie = true
            }
        }
        return result
    }
    checkCourt(p1: Player, p2: Player, result: VersusResult): VersusResult {
        if (p1.isCourt && !p2.isCourt && !p2.isThreeOfKind && !p2.isPok && !p2.isStraightFlush && !p2.isStraight) {
            result.winner = p1
            result.loser = p2
            result.isTie = false
        } else if (p2.isCourt && !p1.isCourt && !p1.isThreeOfKind && !p1.isPok && !p1.isStraightFlush && !p1.isStraight) {
            result.winner = p2
            result.loser = p1
            result.isTie = false
        } else if (p1.isCourt && p2.isCourt) {
            result.isTie = true
        }
        return result
    }
    checkThreeOfKind(p1: Player, p2: Player, result: VersusResult): VersusResult {
        if (p1.isThreeOfKind && !p2.isThreeOfKind && !p2.isPok && !p2.isStraightFlush && !p2.isStraight) {
            result.winner = p1
            result.loser = p2
            result.isTie = false
        } else if (p2.isThreeOfKind && !p1.isThreeOfKind && !p1.isPok && !p1.isStraightFlush && !p1.isStraight) {
            result.winner = p2
            result.loser = p1
            result.isTie = false
        } else if (p1.isThreeOfKind && p2.isThreeOfKind) {
            result.isTie = true
        }
        return result
    }
    checkStraight(p1: Player, p2: Player, result: VersusResult): VersusResult {
        if (p2.isStraight && !p1.isStraight && !p1.isPok && !p1.isStraightFlush) {
            result.winner = p2
            result.loser = p1
            result.isTie = false
        } else if (p1.isStraight && !p2.isStraight && !p2.isPok && !p2.isStraightFlush) {
            result.winner = p1
            result.loser = p2
            result.isTie = false
        } else if (p1.isStraight && p2.isStraight) {
            result.isTie = true
        }
        return result
    }
    checkStraightFlush(p1: Player, p2: Player, result: VersusResult): VersusResult {
        if (p1.isStraightFlush && !p2.isStraightFlush! && p2.isPok) {
            result.winner = p1
            result.loser = p2
            result.isTie = false
        } else if (p2.isStraightFlush && !p1.isStraightFlush! && p1.isPok) {
            result.winner = p2
            result.loser = p1
            result.isTie = false
        } else if (p1.isStraightFlush && p2.isStraightFlush) {
            result.isTie = true
        }
        return result
    }

    private checkPok(p1: Player, p2: Player, result: VersusResult): VersusResult {
        if (p1.isPok && p2.isPok) {
            if (p1.cards.length === 3 && p2.cards.length === 2) {
                result.winner = p2
                result.loser = p1
                result.isTie = false
            } else if (p1.cards.length === 2 && p2.cards.length === 3) {
                result.winner = p1
                result.loser = p2
                result.isTie = false
            } else {
                result.isTie = true
            }
        }
        else if (p2.isPok && !p1.isPok) {
            result.winner = p2
            result.loser = p1
            result.isTie = false
        }
        else if (!p2.isPok && p1.isPok) {
            result.winner = p1
            result.loser = p2
            result.isTie = false
        }
        return result
    }


}