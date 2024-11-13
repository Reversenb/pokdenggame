import type { IController } from "./icontroller.interface"
import { Player } from "./player"

const readline = require('readline')

function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })

    return new Promise(resolve => rl.question(query, (ans: Promise<string>) => {
        rl.close()
        resolve(ans)
    }))
}

export class PlayerController implements IController {
    context: Player | unknown
    async isHit(): Promise<boolean> {// ต้องการถามผู้เล่นจะรับ การ์ดเพิ่มไหม ?
        if (this.context instanceof Player) {
            this.context.printer.print(`  > points: ${this.context.points}`)//
            const ans = await askQuestion(' > อยากได้ไพ่เพิ่มมั้ย ? (y/n)')
            return ans.toLowerCase() === "y"
        }
        return false
    }
    async isPlayAgain(): Promise<boolean> {//ต้องการถามผู้เล่น จะเล่นต่อไหม กล้าป่าว
        if (this.context instanceof Player) {
            const ans = await askQuestion(' > จะเล่นต่อไหม กล้าป่าว ? (y/n)')
            return ans.toLowerCase() === "y"
        }
        return false
    }
    async setBet(limit: number): Promise<number> { //ต้องการถามผู้เล่น จะเดิมพันเท่าไหร่ แต่ต้องไม่เกิน limit
        if (this.context instanceof Player) {
            this.context.printer.print(`  > coins: ${this.context.coins}`)//
            const ans = await askQuestion(` > กำหนดจำนวนเงินเดิมพัน (limit:${limit}) ?`)
            let bet: number = +ans
            if (bet > limit)
                bet = limit
            if (bet > this.context.coins)
                bet = this.context.coins
            this.context.bet = bet
            return bet
        }
        return 0
    }
    setContext(p: Player): void {
        this.context = p
    }

}