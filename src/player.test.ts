import { test, expect, describe } from "bun:test"
import type { IController } from "../src/icontroller.interface"
import { Player } from "../src/player"
import { Card } from "../src/card"
import { ConsolePrinter } from "./console_printer"

const fakeController: IController = {
    context: null as unknown as Player,
    isHit: async (): Promise<boolean> => false,
    isPlayAgain: async (): Promise<boolean> => false,
    setBet: async (limit: number): Promise<number> => { return limit },
    setContext: function (p: Player): void {
        this.context = p
    }
}

const player = new Player(new ConsolePrinter(), fakeController, "test-player", 5000)

describe("Player", () => {
    describe("init value", () => {
        test("have an id", () => {
            expect(player.id).toBeGreaterThan(0) //ok
        })
        test("have a coins", () => {
            expect(player.coins).toBeCloseTo(5000) //ok
        })
        test("have a name", () => {
            expect(player.name).toEqual('test-player') //ok
        })
        test("default bet is 0", () => {
            expect(player.bet).toBeCloseTo(0)//ok
        })
        test("default cards is empty", () => {
            expect(player.cards).toBeEmpty()//ok
        })
        test("default points is 0", () => {
            expect(player.points).toBeCloseTo(0)//ok
        })
        test("controller.context = player", () => {
            expect(player.controller.context).toEqual(player)//
        })
    })

    describe("addCard and clearCard method", () => {
        test("add AceClubs got AceClubs", () => {
            const card = Card.new(0)
            player.addCard(card)
            expect(player.cards[0]).toEqual(card)
        })
        test("cannot add more than 3 cards", () => {
            player.addCard(Card.new(1))
            player.addCard(Card.new(2))
            player.addCard(Card.new(3))
            expect(player.cards.length).toBeCloseTo(3)
        })
        test("clearCard set cards = 0", () => {
            player.clearCard()
            expect(player.cards.length).toBeCloseTo(0)
        })

        test("add AceClubs got 1 points", () => {
            player.addCard(Card.new(0))
            expect(player.points).toBeCloseTo(1)
        })
        test("clearCard set points = 0", () => {
            player.clearCard()
            expect(player.points).toBeCloseTo(0)
        })
        test("add more than one card, points less than 10", () => {
            //add AceClubs abd NineClubs got 0 points
            player.clearCard()
            expect(player.points).toBeCloseTo(0)
            player.addCard(new Card(0, 1))
            player.addCard(new Card(0, 9))
            expect(player.points).toBeCloseTo(0)

            //add KingClubs abd QueenClubs got 0 points
            player.clearCard()
            expect(player.points).toBeCloseTo(0)
            player.addCard(new Card(0, 13))
            player.addCard(new Card(0, 12))
            expect(player.points).toBeCloseTo(0)

            //add JackClubs abd QueenClubs got 0 points
            player.clearCard()
            expect(player.points).toBeCloseTo(0)
            player.addCard(new Card(0, 11))
            player.addCard(new Card(0, 12))
            expect(player.points).toBeCloseTo(0)

            //add JackClubs, QueenClubs, and AceClubs got 1 points
            player.clearCard()
            expect(player.points).toBeCloseTo(0)
            player.addCard(new Card(0, 11))
            player.addCard(new Card(0, 12))
            player.addCard(new Card(0, 1))
            expect(player.points).toBeCloseTo(1)

            //add SeventClubs and TwoClubs got 9 points
            player.clearCard()
            expect(player.points).toBeCloseTo(0)
            player.addCard(new Card(0, 7))
            player.addCard(new Card(0, 2))
            expect(player.points).toBeCloseTo(9)
        })
    })

    describe("coins", () => {
        test("starting at 5000 coins, add 500 coins; the total is 5500.", () => {
            expect(player.coins).toBeCloseTo(5000)
            player.coins = 500
            expect(player.coins).toBeCloseTo(5500)
        })
        test("starting at 5500 coins, add -500 coins; the total is 5000.", () => {
            expect(player.coins).toBeCloseTo(5500)
            player.coins = -500
            expect(player.coins).toBeCloseTo(5000)
        })
    })

    describe("isPok", () => {
        test("false if cards.length = 1", () => {
            player.clearCard()
            expect(player.cards).toBeEmpty()
            player.addCard(new Card(2, 9))
            expect(player.isPok).toBeFalse()
        })
        test("false if cards.length > 2", () => {
            player.clearCard()
            expect(player.cards).toBeEmpty()
            player.addCard(new Card(2, 9))
            player.addCard(new Card(2, 9))
            player.addCard(new Card(2, 9))
            expect(player.isPok).toBeFalse()
        })
        test("true if cards.length = 2 and points = 8 or 9", () => {
            player.clearCard()
            expect(player.cards).toBeEmpty()
            player.addCard(new Card(2, 1))
            player.addCard(new Card(2, 1))
            player.addCard(new Card(2, 7))
            expect(player.isPok).toBeFalse()

            player.clearCard()
            expect(player.cards).toBeEmpty()
            player.addCard(new Card(2, 1))
            player.addCard(new Card(2, 7))
            expect(player.isPok).toBeTrue()

            player.clearCard()
            expect(player.cards).toBeEmpty()
            player.addCard(new Card(2, 5))
            player.addCard(new Card(2, 4))
            expect(player.isPok).toBeTrue()
        })
    })

    describe("isDeng", () => {
        test("false if suits not matched", () => {
            player.clearCard()
            player.addCard(new Card(2, 5))
            player.addCard(new Card(3, 4))
            expect(player.isDeng).toBeFalse()

            player.clearCard()
            player.addCard(new Card(2, 5))
            player.addCard(new Card(3, 4))
            player.addCard(new Card(1, 4))
            expect(player.isDeng).toBeFalse()
        })
        test("true if suits matched", () => {
            player.clearCard()
            player.addCard(new Card(2, 5))
            player.addCard(new Card(2, 4))
            expect(player.isDeng).toBeTrue()

            player.clearCard()
            player.addCard(new Card(2, 5))
            player.addCard(new Card(2, 4))
            player.addCard(new Card(2, 4))
            expect(player.isDeng).toBeTrue()
        })
    })

    describe("isThreeOfKind", () => {
        test("false if number of cards less than 3", () => {
            player.clearCard()
            expect(player.isThreeOfKind).toBeFalse()

            player.addCard(new Card(2, 5))
            expect(player.isThreeOfKind).toBeFalse()

            player.addCard(new Card(2, 7))
            expect(player.isThreeOfKind).toBeFalse()
        })
        test("false if card number not matched", () => {
            player.clearCard()
            player.addCard(new Card(1, 7))
            player.addCard(new Card(2, 1))
            player.addCard(new Card(3, 9))
            expect(player.isThreeOfKind).toBeFalse()

            player.clearCard()
            player.addCard(new Card(1, 12))
            player.addCard(new Card(2, 4))
            player.addCard(new Card(3, 6))
            expect(player.isThreeOfKind).toBeFalse()

        })
        test("true if card number matched", () => {
            player.clearCard()
            player.addCard(new Card(1, 7))
            player.addCard(new Card(2, 7))
            player.addCard(new Card(3, 7))
            expect(player.isThreeOfKind).toBeTrue()

            player.clearCard()
            player.addCard(new Card(1, 12))
            player.addCard(new Card(2, 12))
            player.addCard(new Card(3, 12))
            expect(player.isThreeOfKind).toBeTrue()
        })
    })

    describe("isStraight", () => {
        test("false if number of cards less than 3", () => {
            player.clearCard()
            expect(player.isStraight).toBeFalse()

            player.addCard(new Card(2, 5))
            expect(player.isStraight).toBeFalse()

            player.addCard(new Card(2, 7))
            expect(player.isStraight).toBeFalse()
        })
        test("false if card numbers are not in sequence", () => {
            player.clearCard()
            player.addCard(new Card(1, 7))
            player.addCard(new Card(2, 7))
            player.addCard(new Card(3, 7))
            expect(player.isStraight).toBeFalse()

            player.clearCard()
            player.addCard(new Card(1, 2))
            player.addCard(new Card(2, 7))
            player.addCard(new Card(3, 10))
            expect(player.isStraight).toBeFalse()
        })
        test("true if card numbers are in sequence", () => {
            player.clearCard()
            player.addCard(new Card(1, 1))
            player.addCard(new Card(2, 2))
            player.addCard(new Card(3, 3))
            expect(player.isStraight).toBeTrue()

            player.clearCard()
            player.addCard(new Card(1, 11))
            player.addCard(new Card(2, 12))
            player.addCard(new Card(3, 13))
            expect(player.isStraight).toBeTrue()
        })
    })

    describe("isStraightFlush", () => {
        test("false if isStraight not true ", () => {
            player.clearCard()
            player.addCard(new Card(1, 11))
            player.addCard(new Card(1, 1))
            player.addCard(new Card(1, 3))
            expect(player.isStraight).toBeFalse()

            player.clearCard()
            player.addCard(new Card(1, 7))
            player.addCard(new Card(1, 2))
            player.addCard(new Card(1, 13))
            expect(player.isStraight).toBeFalse()
        })
        test("true if suits matched", () => {
            player.clearCard()
            player.addCard(new Card(1, 11))
            player.addCard(new Card(1, 12))
            player.addCard(new Card(1, 13))
            expect(player.isStraightFlush).toBeTrue()
            player.clearCard()
            player.addCard(new Card(2, 4))
            player.addCard(new Card(2, 5))
            player.addCard(new Card(2, 6))
            expect(player.isStraightFlush).toBeTrue()
        })
    })

    describe("isCourt", () => {
        test("false if number of cards less than 3", () => {
            player.clearCard()
            expect(player.isCourt).toBeFalse()

            player.addCard(new Card(2, 5))
            expect(player.isCourt).toBeFalse()

            player.addCard(new Card(2, 7))
            expect(player.isCourt).toBeFalse()
        })
        test("false if all card number less than 11", () => {
            player.clearCard()
            player.addCard(new Card(2, 4))
            player.addCard(new Card(2, 5))
            player.addCard(new Card(2, 12))
            expect(player.isCourt).toBeFalse()

            player.clearCard()
            player.addCard(new Card(2, 11))
            player.addCard(new Card(2, 13))
            player.addCard(new Card(2, 6))
            expect(player.isCourt).toBeFalse()
        })
        test("true if all card number more than 10", () => {
            player.clearCard()
            player.addCard(new Card(1, 11))
            player.addCard(new Card(2, 12))
            player.addCard(new Card(2, 13))
            expect(player.isCourt).toBeTrue()

            player.clearCard()
            player.addCard(new Card(1, 13))
            player.addCard(new Card(2, 12))
            player.addCard(new Card(2, 13))
            expect(player.isCourt).toBeTrue()
        })
    })

})