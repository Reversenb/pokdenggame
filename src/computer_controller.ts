import type { IController } from "./icontroller.interface"
import { Player } from "./player"

export class ComputerController implements IController {
    context: Player | unknown
    async isHit(): Promise<boolean> {
        if (this.context instanceof Player)
            return this.context.points < 5
        return false
    }
    async isPlayAgain(): Promise<boolean> {
        return true
    }
    async setBet(limit: number): Promise<number> {
        if (this.context instanceof Player) {
            const bet = Math.ceil(this.context.coins * 0.25)
            if (bet > limit)
                return limit
            this.context.bet = bet
            return bet
        }
        return 0
    }
    setContext(p: Player): void {
        this.context = p
    }
}

export class CrazyComputerController extends ComputerController {
    async isHit(): Promise<boolean> {
        if (this.context instanceof Player)
            return this.context.points < 7
        return false
    }
    async setBet(limit: number): Promise<number> {
        if (this.context instanceof Player) {
            const bet = Math.ceil(this.context.coins * 0.80)
            if (bet > limit)
                return limit
            this.context.bet = bet
            return bet
        }
        return 0
    }
}