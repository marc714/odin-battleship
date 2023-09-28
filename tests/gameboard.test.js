import { Gameboard } from "../main";
import { Ship } from "../main";



describe("gameboard tests", ()=> {
    let playerOneBoard;
    let playerTwoBoard;

	beforeEach(() => {
		playerOneBoard = Gameboard("player1");
        playerTwoBoard = Gameboard("player2");
        let gridOne = document.querySelector(`.grid.player1[data-number="55"`)
        let gridTwo = document.querySelector(`.grid.player1[data-number="55"`)
	});

    test('on attack, board notates attack/miss', ()=> {
        playerOneBoard.receiveAttack(55, "first", "playerTwo")
        
        expect(gridOne.dataset.attack).toBe("miss")
    })

})