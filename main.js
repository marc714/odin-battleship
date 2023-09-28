// function Ship(type, lengthNum) {
//     const boatType = type;
//     let length = lengthNum;
//     let damage = 0;
//     let sunk = false;
    

//     // damage++ didn't work
//     // this.damage++ or damage = damage+1 didn't work
//     const hit = () => {
//         this.damage++
//     };

//     const isSunk = () => {
//         if(damage === length) {
//             sunk = true;
//         }
//     };

//     return { boatType, length, damage, sunk, hit, isSunk }
// }

const messageBox = document.querySelector(".message");
const reloadBtn = document.querySelector('#reload');
reloadBtn.addEventListener('click', ()=> location.reload())
messageBox.textContent = "Welcome to Battleship!"


function Ship(type, lengthNum) {
    return {
        boatType: type,
        length: lengthNum,
        damage: 0,
        sunk: false,

        // you need 'this' otherwise JS thinks damage is a variable
        hit() {
            this.damage++;   
        },

        isSunk() {
          if(this.damage == this.length) {
                this.sunk = true;
            }  
        }
    }
}

function Gameboard(player) {
    let gameBoardContainerOne = document.querySelector('#gameboard-first')
    let gameBoardContainerTwo = document.querySelector('#gameboard-second')

    const gridWidth = 10;
    const alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
    let gridNumber = 0;
    
    // css width/flex will be grid width before row break.
    for(let i = 1; i <= gridWidth; i++) {
        let rowNumber = i;
        for(let j = 0; j < alpha.length; j++) {
            let colLetter = alpha[j];
            let dataSetID = rowNumber + colLetter;

            const div = document.createElement('div');
            div.classList.add("grid");
            div.dataset.id = dataSetID;
            div.dataset.number = gridNumber + 1;
            div.dataset.ship = "empty";
            div.dataset.attack = "empty";
            
            gridNumber = gridNumber + 1;
            //div.textContent = gridNumber;
            // Note: DOM has this as "data-hor-edge"
            if(gridNumber % 10 == 0) {
                div.dataset.horEdge = "true"
            }
            if(gridNumber > 90) {
                div.dataset.vertEdge = "true"
            }

            // on click, place boat. on play, remove this on click.
            if(player == "player1") { 
                div.classList.add("player1")
                gameBoardContainerOne.append(div)}
            if(player == "player2") { 
                div.classList.add("player2")
                gameBoardContainerTwo.append(div)}
        }
    } 

    const receiveAttack = (datasetNum, gameboard, attackingPlayer) => {
        let grid = null;
        
        if(gameboard == "first") {
            grid = document.querySelector(`.grid.player1[data-number="${datasetNum}"]`)
        } 
        if(gameboard == "second") {
            grid = document.querySelector(`.grid.player2[data-number="${datasetNum}"]`)
        }
        
        if(grid.dataset.attack == "missed") return; // do nothing.

        if(grid.dataset.ship == 'empty') {
            console.log('i am empty')
            grid.style.backgroundColor = "black"
            grid.dataset.attack = "missed"
            messageBox.textContent = "You missed!"
        }

        if(grid.dataset.ship != "empty" && grid.dataset.attack == "empty") {
            grid.style.backgroundColor = "red"
            messageBox.textContent = "You hit!"
            grid.dataset.attack = "hit"
            let shipType = grid.dataset.ship
            if(gameboard == "first") {
                let ship = playerOneFleetWinCheck.find((element) => element.boatType == shipType)
                ship.hit()
                ship.isSunk()
            } else if(gameboard == "second") {
                let ship = playerTwoFleetWinCheck.find((element) => element.boatType == shipType)
                ship.hit()
                ship.isSunk()
            } 
        }

        // ship sunk check and turn legend red
        shipSunkCheck()

        // Win check
        let gameOver = winCheck()
        if(gameOver == "no") {
           if(attackingPlayer == "playerOne") {
            // then it's now computer's turn. else do nothing after Computer's turn.
            computerAttack();
           }
        } 
    };

    const allSunk = () => {

    };

    const missedShot = () => {

    }

    // TURN THIS INTO A FACTORY
    return { receiveAttack, allSunk, missedShot }
}

function winCheck() {
    let gameOverOne = true;
    let gameOverTwo = true;
    let playerOneCounter = null;
    let playerTwoCounter = null;
    playerOneFleetWinCheck.forEach(ship => {
        console.log(ship.sunk)
        // if any of the ship's are not sunk, gameover is false
        if(ship.sunk == false) {
            gameOverOne = false;
        }
        if(ship.sunk == true) {
            playerOneCounter++ 
        }
    })
    playerTwoFleetWinCheck.forEach(ship => {
        if(ship.sunk == false) {
            gameOverTwo = false;
        }
        if(ship.sunk == true) {
            playerTwoCounter++ 
        }
    })   

    if(gameOverOne == false && gameOverTwo == false) return "no";
    if(gameOverTwo == true || gameOverTwo == true) {
        // do this
        console.log("playerOne counter: " + playerOneCounter)
        console.log("playerTwo counter: " + playerTwoCounter)
        if(playerOneCounter > playerTwoCounter) {
            messageBox.textContent = "Computer wins!";
        } else if(playerOneCounter < playerTwoCounter) {
            messageBox.textContent = "Player One wins!"
        }
        
        // run end game function. Pop up with restart game? 
        endGame();
        return "yes";
    }
}

function computerAttack() {
    // FUTURE: Add AI here. Possibly do an attack queue. 
    let attackNum = Math.floor(Math.random() * 101);
    //let grid = document.querySelector(`.player1[data-number="${randomNum}"]`)
    firstGameboard.receiveAttack(attackNum, "first")

    // Legend, ship sunk check
    shipSunkCheck();

    // run win check to see if game end
    let gameOver = winCheck()
        if(gameOver == false) {
           //Player's turn
            messageBox.textContent = "Keep shooting."
        }
        if(gameOver == true) {
            // do something
            // end game function
            messageBox.textContent = "Game over."
            endGame();
        } 
}

// check if ship is sunk. turn legend red.
function shipSunkCheck() {
    const carrier = document.querySelector('.legend-one .carrier')
    const battleship = document.querySelector('.legend-one .battleship')
    const destroyer = document.querySelector('.legend-one .destroyer')
    const submarine = document.querySelector('.legend-one .submarine')
    const patrol = document.querySelector('.legend-one .patrol')
    const pcCarrier = document.querySelector('.legend-two .carrier')
    const pcBattleship = document.querySelector('.legend-two .battleship')
    const pcDestroyer = document.querySelector('.legend-two .destroyer')
    const pcSubmarine = document.querySelector('.legend-two .submarine')
    const pcPatrol = document.querySelector('.legend-two .patrol')
    playerOneFleetWinCheck.forEach(ship => {
        if(ship.sunk == true) {
            switch(ship.boatType) {
                case "carrier":
                    carrier.style.color = "red"
                    break;
                case "battleship":
                    battleship.style.color = "red"
                    break;
                case "destroyer":
                    destroyer.style.color = "red"
                    break;
                case "submarine":
                    submarine.style.color = "red"
                    break;
                case "patrol":
                    patrol.style.color = "red"   
            }
        }
    })
    playerTwoFleetWinCheck.forEach(ship => {
        if(ship.sunk == true) {
            switch(ship.boatType) {
                case "carrier":
                    pcCarrier.style.color = "red"
                    break;
                case "battleship":
                    pcBattleship.style.color = "red"
                    break;
                case "destroyer":
                    pcDestroyer.style.color = "red"
                    break;
                case "submarine":
                    pcSubmarine.style.color = "red"
                    break;
                case "patrol":
                    pcPatrol.style.color = "red"   
            }
        }
    })
}


// boat direction placement
let direction = "hor";
let btnBoatDirectionVertical = document.querySelector("#boat-direction-vertical")
let btnBoatDirectionHorizontal = document.querySelector("#boat-direction-horizontal")
btnBoatDirectionVertical.addEventListener('click', ()=> {
    direction = "vert"
    console.log(direction)
})
btnBoatDirectionHorizontal.addEventListener('click', ()=> {
    direction = "hor"
    console.log(direction)
})

const carrier = Ship("carrier", 5)
const battleship = Ship("battleship", 4)
const destroyer = Ship("destroyer", 3)
const submarine = Ship("submarine", 3)
const patrol = Ship("patrol", 2)

const pcCarrier = Ship("carrier", 5)
const pcBattleship = Ship("battleship", 4)
const pcDestroyer = Ship("destroyer", 3)
const pcSubmarine = Ship("submarine", 3)
const pcPatrol = Ship("patrol", 2)

const playerOneFleet = [carrier, battleship, destroyer, submarine, patrol]
const playerTwoFleet = [pcCarrier, pcBattleship, pcDestroyer, pcSubmarine, pcPatrol]
const playerOneFleetWinCheck = [carrier, battleship, destroyer, submarine, patrol]
const playerTwoFleetWinCheck = [pcCarrier, pcBattleship, pcDestroyer, pcSubmarine, pcPatrol]

let enhancedElements = [];

// Note: totalGrid for player 1 only (event listener issues in gameflow() )
function placeBoat(fleetArray) {   
    let totalGrid = document.querySelectorAll(".grid.player1")
    
    totalGrid.forEach(gridElement => {
        enhancedElements.push({
            gridElement,
            hoverOn(e) {hover(fleetArray, "on", e)},
            hoverOff(e) {hover(fleetArray, "off", e)},
            legalBoat(e) {legalBoatPlacementCheck(e.target.dataset.number, fleetArray, fleetArray[0].boatType, fleetArray[0].length)}
        })
        enhancedElements.forEach(ee => {
            ee.gridElement.addEventListener('mouseenter', ee.hoverOn);
            ee.gridElement.addEventListener('mouseleave', ee.hoverOff);
            ee.gridElement.addEventListener('click', ee.legalBoat)
        })
    })   
    // totalGrid.forEach(element => {
    //     element.addEventListener('mouseenter', hover(fleetArray, "on"))
    //     element.addEventListener('mouseleave', hover(fleetArray, "off")) 

    //     element.addEventListener('click', (event)=> {
    //         let eventDatasetNumber = event.target.dataset.number;
    //         legalBoatPlacementCheck(eventDatasetNumber, fleetArray, fleetArray[0].boatType, fleetArray[0].length)
    //     })        
    // })
}

// placeBoat uses below callback on it's addEventListener. function checks to see if ALL required grids are avail/legal. Returns true/false.
function legalBoatPlacementCheck(datasetNumber, playerFleet, boatType, shipLength) {
    let length = shipLength;
    let queue = [];
    let playerBoard = null;
    if(playerFleet == playerOneFleet) { playerBoard = ".player1" }
    if(playerFleet == playerTwoFleet) { playerBoard = ".player2" }

    let curr = document.querySelector(`.grid${playerBoard}[data-number="${datasetNumber}"]`)

        // valid move check:
        if(direction == "hor") {
            while (length > 0) {    
                if(curr.dataset.ship == 'empty') {
                    queue.push(curr.dataset.number)
                }
                if(curr.dataset.ship != 'empty') {
                    queue.push("taken")
                }
                // Break loop if current grid is an Edge. I.e., skip "move to next grid"
                if(length !=1 && curr.dataset.horEdge == "true") {
                    break
                }

                // Move to next grid
                let currNumber = curr.dataset.number;
                //console.log("legalBoatPlacement currNumber: " + currNumber)
                let nextNumber = parseInt(currNumber) + 1;
                //console.log("legalBoatPlacement nextNumber: " + nextNumber)
                curr = document.querySelector(`.grid${playerBoard}[data-number="${nextNumber}"]`)
                
                length = length - 1;
            }
        }
        if(direction == "vert") {
            while (length > 0) {    
                if(curr.dataset.ship == 'empty') {
                    queue.push(curr.dataset.number)
                }
                if(curr.dataset.ship != 'empty') {
                    queue.push("taken")
                }
                // Break loop if current grid is an Edge. I.e., skip "move to next grid"
                // length=1 means your at the end of the ship. length >1 means there's more than 1 left and your at the edge.
                if(length !=1 && curr.dataset.vertEdge == "true") {
                    break
                }

                // Move to next grid
                let currNumber = curr.dataset.number;
                //console.log("legalBoatPlacement currNumber: " + currNumber)
                let nextNumber = parseInt(currNumber) + 10;
                //console.log("legalBoatPlacement nextNumber: " + nextNumber)
                curr = document.querySelector(`.grid${playerBoard}[data-number="${nextNumber}"]`)
                
                length = length - 1;
            }
        }    

    // actual element change
    // if Queue doesn't include 'taken' and length of ship is 0. Greater than 0 = boat length broken off by an edge.
    if(!queue.includes('taken') && length == 0) { 
        queue.forEach(el => {
            let square = document.querySelector(`.grid${playerBoard}[data-number="${el}"]`)
            square.dataset.ship = boatType
            if(playerFleet == playerOneFleet) {
              square.style.backgroundColor = "blue"
              square.textContent = shipLength;
              square.classList.add("occupied")  
            }            
        })
        // remove first boat in fleet
        playerFleet.shift();
    }

    // Action after all playerFleetOne boats placed.
    if(playerOneFleet.length == 0 && playerTwoFleet.length == 5) {
        // placeBoat(playerTwoFleet)
        computerPlacement(playerTwoFleet);
    }
}
// curried
// function legalBoatPlacementCheck(datasetNumber, playerFleet, boatType, shipLength) {
//     let curriedFunction = function actualFunction(e) {
//         let length = shipLength;
//         let queue = [];
//         let playerBoard = null;
//         if(playerFleet == playerOneFleet) { playerBoard = ".player1" }
//         if(playerFleet == playerTwoFleet) { playerBoard = ".player2" }
    
//         let curr = document.querySelector(`.grid${playerBoard}[data-number="${datasetNumber}"]`)
    
//             // valid move check:
//             if(direction == "hor") {
//                 while (length > 0) {    
//                     if(curr.dataset.ship == 'empty') {
//                         queue.push(curr.dataset.number)
//                     }
//                     if(curr.dataset.ship != 'empty') {
//                         queue.push("taken")
//                     }
//                     // Break loop if current grid is an Edge. I.e., skip "move to next grid"
//                     if(curr.dataset.horEdge == "true") {
//                         break
//                     }
    
//                     // Move to next grid
//                     let currNumber = curr.dataset.number;
//                     //console.log("legalBoatPlacement currNumber: " + currNumber)
//                     let nextNumber = parseInt(currNumber) + 1;
//                     //console.log("legalBoatPlacement nextNumber: " + nextNumber)
//                     curr = document.querySelector(`.grid${playerBoard}[data-number="${nextNumber}"]`)
                    
//                     length = length - 1;
//                 }
//             }
//             if(direction == "vert") {
//                 while (length > 0) {    
//                     if(curr.dataset.ship == 'empty') {
//                         queue.push(curr.dataset.number)
//                     }
//                     if(curr.dataset.ship != 'empty') {
//                         queue.push("taken")
//                     }
//                     // Break loop if current grid is an Edge. I.e., skip "move to next grid"
//                     if(curr.dataset.vertEdge == "true") {
//                         break
//                     }
    
//                     // Move to next grid
//                     let currNumber = curr.dataset.number;
//                     //console.log("legalBoatPlacement currNumber: " + currNumber)
//                     let nextNumber = parseInt(currNumber) + 10;
//                     //console.log("legalBoatPlacement nextNumber: " + nextNumber)
//                     curr = document.querySelector(`.grid${playerBoard}[data-number="${nextNumber}"]`)
                    
//                     length = length - 1;
//                 }
//             }    
    
//         // actual element change
//         // if Queue doesn't include 'taken' and length of ship is 0. Greater than 0 = boat length broken off by an edge.
//         if(!queue.includes('taken') && length == 0) { 
//             queue.forEach(el => {
//                 let square = document.querySelector(`.grid${playerBoard}[data-number="${el}"]`)
//                 square.dataset.ship = boatType
//                 square.style.backgroundColor = "blue"
//                 square.textContent = shipLength;
//                 square.classList.add("occupied")
//             })
//             // remove first boat in fleet
//             playerFleet.shift();
//         }
    
//         // Action after all playerFleetOne boats placed.
//         if(playerOneFleet.length == 0 && playerTwoFleet.length == 5) {
//             // placeBoat(playerTwoFleet)
//             computerPlacement(playerTwoFleet);
//         }
//     }
//     return curriedFunction;
// }

function hover(fleetArray, toggle, event) {
    if(fleetArray.length == 0) return;
    let length = fleetArray[0].length;
    let curr = event.target;
    let legalMoveArr = []
    let illegalMoveArr = [];
    let edgeCase = false;

    while(length > 0) {
        if(direction == "hor") {
            //console.log(curr)
            if(curr.dataset.ship == 'empty') {
                // if(toggle == "on") { curr.style.backgroundColor = "green" }
                // if(toggle == "off") { curr.style.backgroundColor = "grey" }
                legalMoveArr.push(curr)
            }
            if(curr.dataset.ship != 'empty') {
                // if(toggle == "on") { curr.style.backgroundColor = "red" }
                // if(toggle == "off") { curr.style.backgroundColor = "blue" }
                illegalMoveArr.push(curr)
            }
            if(length != 1 && curr.dataset.horEdge == "true") {
                edgeCase = true;
                break;
            }

            let tempNum = curr.dataset.number;
            let nextNumber = parseInt(tempNum) + 1
            curr = document.querySelector(`.grid[data-number="${nextNumber}"]`)
            length = length - 1;
        }

        if(direction == "vert") {
            //console.log(curr)
            if(curr.dataset.ship == 'empty') {
                // if(toggle == "on") { curr.style.backgroundColor = "green" }
                // if(toggle == "off") { curr.style.backgroundColor = "grey" }
                legalMoveArr.push(curr)
            }
            if(curr.dataset.ship != 'empty') {
                // if(toggle == "on") { curr.style.backgroundColor = "red" }
                // if(toggle == "off") { curr.style.backgroundColor = "blue" }
                illegalMoveArr.push(curr)
            }
            if(length != 1 && curr.dataset.vertEdge == "true") {
                edgeCase = true;
                break;
            }

            let tempNum = curr.dataset.number;
            let nextNumber = parseInt(tempNum) + 10
            curr = document.querySelector(`.grid[data-number="${nextNumber}"]`)
            length = length - 1;
        }
    }

    if(toggle == "on" && edgeCase == true) {
        legalMoveArr.forEach(el => el.style.backgroundColor = "red")
        illegalMoveArr.forEach(el => el.style.backgroundColor = "red")
    }
    if(toggle == "on" && edgeCase != true) {
        legalMoveArr.forEach(el => el.style.backgroundColor = "green")
        illegalMoveArr.forEach(el => el.style.backgroundColor = "red")
    }
    if(toggle == "off") {
        legalMoveArr.forEach(el => el.style.backgroundColor = "grey")
        illegalMoveArr.forEach(el => el.style.backgroundColor = "blue")
    }

}

/* curried:
// Turn off after fleet is empty
// actualHover(e), whereas 'e' is the event. Console log will show it as a Mouseevent when you hover over it (since this is on Mouseenter)
// e.target is the actual element itself. So the grid div.
function hover(fleetArray, toggle) {
    let curriedHover = function actualHover(e) {
        if(fleetArray.length == 0) return;
        let length = fleetArray[0].length;
        
        let curr = e.target;

        while(length > 0) {
            if(direction == "hor") {
                //console.log(curr)
                if(curr.dataset.ship == 'empty') {
                    if(toggle == "on") { curr.style.backgroundColor = "green" }
                    if(toggle == "off") { curr.style.backgroundColor = "grey" }
                }
                if(curr.dataset.ship != 'empty') {
                    if(toggle == "on") { curr.style.backgroundColor = "red" }
                    if(toggle == "off") { curr.style.backgroundColor = "blue" }
                }
                if(curr.dataset.horEdge == "true") {
                    break;
                }

                let tempNum = curr.dataset.number;
                let nextNumber = parseInt(tempNum) + 1
                curr = document.querySelector(`.grid[data-number="${nextNumber}"]`)
                length = length - 1;
            }

            if(direction == "vert") {
                //console.log(curr)
                if(curr.dataset.ship == 'empty') {
                    if(toggle == "on") { curr.style.backgroundColor = "green" }
                    if(toggle == "off") { curr.style.backgroundColor = "grey" }
                }
                if(curr.dataset.ship != 'empty') {
                    if(toggle == "on") { curr.style.backgroundColor = "red" }
                    if(toggle == "off") { curr.style.backgroundColor = "blue" }
                }
                if(curr.dataset.vertEdge == "true") {
                    break;
                }

                let tempNum = curr.dataset.number;
                let nextNumber = parseInt(tempNum) + 10
                curr = document.querySelector(`.grid[data-number="${nextNumber}"]`)
                length = length - 1;
            }        
        }
    }
    return curriedHover;
} */

// can't pass shipLength into outside function
// function hover(e, shipLength) {
//     console.log(e.target);
// }

// let fleetCounterOne = 0;
// 'e' is the target grid. Don't forget including '.target'
// don't need a named function here since we don't need to remove the click listener
// https://stackoverflow.com/questions/44349497/how-to-continue-to-next-loop-iteration-only-after-a-button-press-in-javascript
// event handler is bubbling: https://javascript.info/bubbling-and-capturing
// https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation


/* gameflow: press play game. player 1 places boats. player 1 press Done button. player 2 places boats. since it's PC only it autostarts.
1) player 2 places boats steps -> run computerPlacement(). This function gets coordinates for the boat and places them in the DOM 
2) computerPlacemenet: runs placeBoat() for each ship type. Placeboat finds the legal grids they can place boats. Make AI/randomizer module.
3) FUTURE: placeBoat: runs getRandomInt() for random number that matches data-set-number. 
3a) FUTURE: gridSearch(randonNum) test to see if grid is occupied. If occupied, re-run.
3b) FUTURE: If not occupied, test to see if adjacent grids are occupied. Test X axis first, then Y. For every avail grid, increase randomGridShipSize++ until it matches shipTYpe.length.
4) gameflow(). game starts, players taking turns. win conditions checked after each turn. 
*/

let firstPlayer = null;
let secondPlayer = null;
let firstGameboard = null;
let secondGameboard = null;


let btnNewGame = document.querySelector('#new-game');
btnNewGame.addEventListener("click", ()=> {
    newGame("Tom", "Bob", "yes")
}, {once : true})

// when Start button is pressed (future: we can add fields for player names)
function newGame(player1name, player2name, bot) {
    btnNewGame.style.color = "#E8E8E8"
    let cover = document.querySelector('#cover')
    cover.style.display = "none"
    firstPlayer = Player(player1name, "yes")
    secondPlayer = Player(player2name, "bot")
    firstGameboard = Gameboard("player1");
    secondGameboard = Gameboard("player2");
    messageBox.textContent = "Place your fleet!";
    placeBoat(playerOneFleet);
}

// called by legalBoatPlacementCheck(playerFleetOne...).
function computerPlacement(playerFleet) {
    while(playerFleet.length > 0) {
        randomAxis()
        let randomNum = Math.floor(Math.random() * 101);
        console.log(randomNum)
        //reminder: this will check if the grid at randomNum is valid. If valid, it will auto place and move to next boat.
        legalBoatPlacementCheck(randomNum, playerFleet, playerFleet[0].boatType, playerFleet[0].length)
    }   
    gameFlow()
}

// if both axis are available, randomize
function randomAxis() {
    let randomNum = Math.random();
    if(randomNum > 0.49) {
        direction = "vert"
    } else {
        direction = "hor"
    }
}

function removeClickHover() {
    enhancedElements.forEach(ee => {
        ee.gridElement.removeEventListener('mouseenter', ee.hoverOn);
        ee.gridElement.removeEventListener('mouseleave', ee.hoverOff);
        ee.gridElement.removeEventListener('click', ee.legalBoat)
    })
}

// Main game loop. Invoked by computerPlacement()
function gameFlow(){
    removeClickHover(); // removes hover and click listeners
    messageBox.textContent = "Attack your enemy!"
    
    // turn on 'click' for attacking player2 board 
    let totalGridTwo = document.querySelectorAll('.grid.player2')    
    totalGridTwo.forEach(el => {
        el.addEventListener('click', (e)=> {
            secondGameboard.receiveAttack(e.target.dataset.number, "second", "playerOne");
            e.stopPropagation;
        }, {once : true})
    })

}


function Player(name, human) {
    // human: yes/no
    return {
        name,
        human: human
    }
}


// Get the modal
const modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

function endGame() {
    modal.style.display= "block"
}

function closeModal() {
    modal.style.display = "none"
}
span.addEventListener("click", ()=> {
    //closeModal()
    location.reload()
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


// export { Ship, Gameboard }