import { test, expect, describe } from "bun:test"
import { Deck } from "../src/deck"
import { Card } from "../src/card"

describe("Deck", () => {
    const deck = new Deck()
    describe("constructor", () => {
        test("init 52 cards", () => {
            expect(deck.cards.length).toBeCloseTo(52)
        })
    })

    describe("draw", () => {
        test('call less then 52 time, got a correct card', () => {
            for (let index = 0; index < 52; index++) {
                const card = Card.new(index)
                expect(deck.draw()!).toEqual(card)
            }
        })

        test(`call over 52 time,  got undefined`, () => {
            for (let index = 53; index <= 60; index++) {
                expect(deck.draw()).toBeUndefined()
            }
        })

    })

    describe("reset", () => {
        test("before reset, when call draw over 52 time, got undefined", () => {
            expect(deck.draw()).toBeUndefined()
        })
        test("after reset, call draw got Ace-Clubs", () => {
            deck.reset()
            const card = deck.draw()!
            expect(card).toEqual(Card.new(0))
        })
    })

    describe("shuffle", () => {
        const deck1 = new Deck()
        const deck2 = new Deck()
        test("before shuffle, the sequence of cards must match the cards in the init deck", () => {
            expect(deck1.cards).toEqual(deck2.cards)
        })
        test("after shuffle, the sequence of cards must not match the cards in the init deck", () => {
            deck2.shuffle()
            expect(deck1.cards).not.toEqual(deck2.cards)
        })
    })
})