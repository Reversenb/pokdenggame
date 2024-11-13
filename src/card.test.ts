import { test, expect, describe } from "bun:test"
import { Card } from "../src/card"
import { CardSuit } from "../src/card_suit"
import { CardNumber } from "../src/card_number"

describe("Card", () => {
    describe("toString", () => {
        const test_cases: { name: string, card: Card, expect: string }[] = [
            { name: 'King Clubs', card: new Card(0, 13), expect: `${CardNumber[13]} ${CardSuit[0]}` },
            { name: 'Ace Spades', card: new Card(3, 1), expect: `${CardNumber[1]} ${CardSuit[3]}` },
            { name: 'Queen Hearts', card: new Card(2, 12), expect: `${CardNumber[12]} ${CardSuit[2]}` },
            { name: 'Seven Hearts', card: new Card(2, 7), expect: `${CardNumber[7]} ${CardSuit[2]}` },
            { name: 'Ten Diamonds', card: new Card(1, 10), expect: `${CardNumber[10]} ${CardSuit[1]}` },
        ]
        for (const test_case of test_cases) {
            test(test_case.name, () => {
                const got = test_case.card.toString()
                expect(got).toEqual(test_case.expect)
            })
        }
    })

    describe("number of card", () => {
        test("return correct number of card", () => {
            for (let index = 0; index < 13; index++) {
                expect(Card.new(index).number).toBeCloseTo(index + 1)
            }
        })
    })

    describe("Equal To", () => {
        const test_cases: { name: string, card1: Card, card2: Card, expect: boolean }[] = [
            { name: 'King Clubs not-equal-to Queen Hearts', card1: new Card(0, 13), card2: new Card(2, 12), expect: false },
            { name: 'King Clubs not-equal-to Ten Diamonds', card1: new Card(0, 13), card2: new Card(1, 10), expect: false },
            { name: 'King Clubs equal-to King Spades', card1: new Card(0, 13), card2: new Card(3, 13), expect: true },
            { name: 'King Clubs equal-to King King Diamonds', card1: new Card(0, 13), card2: new Card(1, 13), expect: true },
            { name: 'Ace Clubs equal-to King Ace Diamonds', card1: new Card(0, 1), card2: new Card(1, 1), expect: true },
        ]
        for (const test_case of test_cases) {
            test(test_case.name, () => {
                const got = test_case.card1.numberEqualTo(test_case.card2)
                expect(got).toEqual(test_case.expect)
            })
        }
    })

    describe("static new method", () => {
        const test_cases: { cardIndex: number, expect: Card }[] = [
            { cardIndex: 0, expect: new Card(CardSuit.Clubs, CardNumber.Ace) },
            { cardIndex: 12, expect: new Card(CardSuit.Clubs, CardNumber.King) },
            { cardIndex: 13, expect: new Card(CardSuit.Diamonds, CardNumber.Ace) },
            { cardIndex: 14, expect: new Card(CardSuit.Diamonds, CardNumber.Two) },
            { cardIndex: 15, expect: new Card(CardSuit.Diamonds, CardNumber.Three) },
            { cardIndex: 50, expect: new Card(CardSuit.Spades, CardNumber.Queen) },
            { cardIndex: 51, expect: new Card(CardSuit.Spades, CardNumber.King) },
            { cardIndex: 120, expect: new Card(CardSuit.Diamonds, CardNumber.Four) },
            { cardIndex: 999, expect: new Card(CardSuit.Clubs, CardNumber.Queen) },
            { cardIndex: 1025, expect: new Card(CardSuit.Hearts, CardNumber.Queen) },
            { cardIndex: 1333, expect: new Card(CardSuit.Hearts, CardNumber.Eight) },
            { cardIndex: 1543, expect: new Card(CardSuit.Hearts, CardNumber.Ten) },
            { cardIndex: 3210, expect: new Card(CardSuit.Hearts, CardNumber.King) },
            { cardIndex: 4433, expect: new Card(CardSuit.Diamonds, CardNumber.Ace) },
            { cardIndex: 4567, expect: new Card(CardSuit.Spades, CardNumber.Five) },
        ]
        test("create a correct card", () => {
            for (const test_case of test_cases) {
                expect(Card.new(test_case.cardIndex)).toEqual(test_case.expect)
            }
        })

    })

    describe("points", () => {
        test(`card number less than 10 return that number, if more than 10 return 0`, () => {
            for (let index = 0; index < 52; index++) {
                const card = Card.new(index)
                let point: number = card.number
                if (point >= 10) point = 0
                expect(card.points).toBeCloseTo(point)
            }
        })
    })
})