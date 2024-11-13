import type { IPrinter } from "./iprinter.interface"

export class ConsolePrinter implements IPrinter {
    print(message: any): void {
        console.log(message)
    }
}
