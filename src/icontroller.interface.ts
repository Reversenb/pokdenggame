import type { Player } from "./player"

export interface IController {
    context: Player | unknown
    isHit(): Promise<boolean>
    isPlayAgain(): Promise<boolean>
    setBet(limit: number): Promise<number>
    setContext(p: Player): void
}