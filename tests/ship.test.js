import { Ship } from "../main";

// https://jestjs.io/docs/expect



describe("Ship function", () => {
    test("ship gets hit, damage goes up by 1", ()=> {
        let testShip = Ship("battleship", 4);
        testShip.hit();

        expect(testShip).toHaveProperty('damage', 1)
    });
    test("ship is sunk", () => {
        let testShipSunk = Ship("submarine", 1);
        let testShipNotSunk = Ship("destroyer", 3);

        testShipSunk.hit();
        testShipSunk.isSunk();

        testShipNotSunk.hit();
        testShipNotSunk.isSunk();

        expect(testShipSunk).toHaveProperty('sunk', true)
        expect(testShipNotSunk).toHaveProperty('sunk', false)
    });
    
})