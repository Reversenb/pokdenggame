import { ComputerController, CrazyComputerController } from "./src/computer_controller"
import { ConsolePrinter } from "./src/console_printer"
import { Deck } from "./src/deck"
import { Player } from "./src/player"
import { PlayerController } from "./src/player_controller"
import { PokDengGame } from "./src/pokdeng_game"

const consolePrint = new ConsolePrinter()
const dealer = new Player(consolePrint, new ComputerController(), 'dealer', 1000000)
const player = new Player(consolePrint, new PlayerController(), 'xkalux', 5000)
const com1 = new Player(consolePrint, new ComputerController(), 'Menta', 5000)
const com2 = new Player(consolePrint, new CrazyComputerController(), 'Manita', 5000)

const game = new PokDengGame(1000, dealer, consolePrint, new Deck())
game.addPlayer(player)
game.addPlayer(com1)
game.addPlayer(com2)
game.play()