// Enemies our player must avoid
var Enemy = function(name, initialSpeed, stack) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Names for fun and image control
    this.name = name;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    if (this.name === "Steve") {
        this.sprite = 'images/enemy-bug-red.png';
    }
    else if (this.name === "Vicky") {
        this.sprite = 'images/enemy-bug-green.png';
    }
    else {
        this.sprite = 'images/enemy-bug.png';
    }

    // Initial speed variable for this enemy
    this.initialSpeed = initialSpeed;

    // Speed variable for this Enemy
    this.speed = this.initialSpeed;

    // Set stack order. This allowes nicer apperance when bugs ovelap.
    // The goal is to have the "front" bug lower on the screen in the lane.
    this.stack = stack;

    // standard starting values
    this.x = xStart;

    // Set initial Random y (lane) value
    this.laneSelection();

    // Log instantiation
    console.log("Welcoming the enemy "+this.name+" to the game.");
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // 'speed multiplier' * 'delta time' * 'Enemy speed'
    this.x += speedMultiple * dt * this.speed;
    // At end of row reset to start of new random row
    if (this.x > xEnd) {
        this.x = xStart;
        this.laneSelection();
    }

    // DEBUG logging level 2 (verbose)
    if(debug > 1){console.log("calling enemy update x="+this.x+" y="+this.y)}; 
}

// When instantiated, and when at end of row a new random lane
// should be set for any Enemy
Enemy.prototype.laneSelection = function(lane) {
    // set a new random lane between 1 and 3
    this.lane = Math.floor((Math.random() * maxLanes) + 1);
    
    // New y is ('lane number' * 'rowHeight') - 'height adjustment' + ('stack adjustment')
    this.y = (this.lane * rowHeight) - 35 + (this.stack * stackHeight);
    
    // DEBUG level 1
    if(debug > 0){console.log("Enemy "+this.name+" is now in lane "+this.lane)};
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Reset the enemy to its initial speed after game restart
Enemy.prototype.reset = function() {
    this.speed = this.initialSpeed;

    // DEBUG level 1
    if(debug > 0){console.log("Enemy "+this.name+" was reset to start values")};
}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(loc){
    // Starting location
    this.loc = loc;

    // Set the initial coordinates of x and y based on locaiton
    this.moveTo(loc);

    // Initialize game flow values like score and such
    this.reset();

    // Log instatiation
    console.log("Welcoming a new player to the game.");
};

// Update player and handle mechanics of collisions, lives
// and difficulty. Player attributes are the ones that 
// control the flow and function of the game play. 
Player.prototype.update = function(){
    // Collision detection
    // Is there a bug on you?
    allEnemies.forEach(function(enemy) {
        if (enemy.lane === player.row && (enemy.x + 78) > player.x && enemy.x < (player.x + 80)) {
            // Log the collision
            console.log("THE BUG "+enemy.name+" GOT THE PLAYER at loc="+player.loc+"!!!");
            
            // Put player out of bounds, then next move will bring them to start position
            player.loc = 32;
            
            // decrease lives 
            player.lives--;

            // Is the game over? (out of lives)
            if (player.lives < 0) {
                player.message = "GAME OVER";

                // Temporarily set lives back to 0 so when rendered -1 is not seen
                player.lives = 0;

                // Log GAME OVER
                console.log(player.message)
            }
            else {
                player.message = "Try again";
            }
            
            // Pause game
            freeze = 1;
        }
    });

    // Did the player score?
    // Manage level and difficulty increases 
    if (this.loc < 5) {
        this.loc = 27;
        this.moveTo(this.loc);
        this.score++;
        this.level++;
        this.message = "Level "+this.level;
        console.log("Player GOAL!!!");

        // Difficulty increased based on player level
        if (this.level === 5) {
            tricky.reset();
            allEnemies.push(micky,nicky);
            this.message = "Pink Levels";
            this.sprite = 'images/char-pink-girl.png';
            console.log("Difficulty Pink");
        }
        else if (this.level === 10) {
            tricky.reset();
            sticky.speed = sticky.speed + 5;
            allEnemies.push(ricky);
            this.message = "Kitty Levels";
            this.sprite = 'images/char-cat-girl.png';
            console.log("Difficulty Kitty");
        }
        else if (this.level === 15) {
            tricky.reset();
            nicky.speed = nicky.speed + 5;
            allEnemies.push(picky);
            this.message = "Mage Levels";
            this.sprite = 'images/char-horn-girl.png';
            console.log("Difficulty Mage");
        }
        // Boss levels
        else if (this.level === 20) {
            tricky.reset();
            picky.speed = picky.speed + 5;
            allEnemies.push(steve);
            this.message = "Boss Levels";
            this.sprite = 'images/char-princess-girl.png';
            console.log("Difficulty BOSS LEVELS");
        }
        else {
            // Minor difficulty increase for each level.
            tricky.speed = tricky.speed + 2;
            // Medium difficulty increase higher levels.
            if (this.level > 15) {
                ricky.speed = ricky.speed + 3;
            }
            // Major difficulty increase for boss levels.
            if (this.level >= 20) {
                steve.speed = steve.speed + 5;
            }
            // CRAZY LEVELS.
            if (this.level >= 25) {
                allEnemies.forEach(function(enemy) {
                    enemy.speed++;
                });
                // Incase someone gets this far. Making the game even crazier
                // With a fourth lane of enemies IN THE GRASS.
                maxLanes = 4;
            }
        }
    }
};

// Reset the player after game restart
Player.prototype.reset = function(){
    // Initial image for this player
    this.sprite = 'images/char-boy.png';

    // Start of game attributes
    this.message = "Jump to WATER";
    this.score = 0;
    this.level = 1;
    this.lives = 3

    // Reset the globals I modified for CRAZY levels
    // No more enemies in the grass.
    maxLanes = 3;

    // Log new game
    console.log("Player was reset.")
}

// Move a player to a new position on game board
Player.prototype.moveTo = function(loc){
    // Calculate the row and column based on location value
    this.row = Math.floor(loc / 5);
    this.column = loc - (this.row * 5);

    // Calculate x and y subtracting image width adjustment from y.
    this.y = (83 * this.row) - 20;
    this.x = 101 * this.column;

    // DEBUG level 1
    if(debug > 0){console.log("For player moveTo changed values to row="+this.row+" loc="+this.loc+" x="+this.x+" y="+this.y)};
};

// Along with player render also render player messages.
Player.prototype.render = function(){
    // Render the image on the canvas
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Render the player score and lives always
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 10pt Courier New";
    ctx.textAlign = "left";
    ctx.fillText("Score: "+this.score, 10, 70);
    ctx.fillText("Lives: "+this.lives, 111, 70);
    ctx.fillText("Level: "+this.level, 414, 70);

    // Render the player message on the canvas as needed
    if (this.message.match(/\w/)) {
        ctx.font = "bold 36pt Comic Sans MS";
        ctx.lineWidth = "2";
        ctx.textAlign = "center";
        ctx.fillText(this.message, 250, 445);
        ctx.strokeText(this.message, 250, 445);
    }

    // DEBUG logging level 2 or higher
    if(debug > 1){console.log("Calling player render")};
};



Player.prototype.handleInput = function(move){
    // Unfreeze the game on player input.
    freeze = 0;

    // Start new game if needed. Or if they cancel leave
    // paused. This would be better if not using JS confirm
    // dialogue. But for now it functions as needed. Maybe
    // for fun later I will create a custom in game dialogue.
    if (player.message === "GAME OVER") {
        var newGame = confirm("Do you want to start a new game?");
        if (newGame !== true) {
            freeze = 1;
            return;
        }
        else {
            allEnemies = [icky,sticky,tricky,vicky];
            allEnemies.forEach(function(enemy) {
                enemy.reset();
            });
            player.reset();
        }
    }

    // Move in requested direction if not moving out of bounds
    if (move === "up" && this.loc > 4) {
        this.loc = this.loc - 5;
    }
    else if (move === "down" && this.loc < 25) {
        this.loc = this.loc + 5;
    }
    else if (move === "left" && (this.loc % 5 !== 0)) {
        this.loc = this.loc - 1;
    }
    else if (move === "right" && (this.loc % 5 !== 4)) {
        this.loc = this.loc + 1;
    }
    // out of bounds recovery
    if (this.loc > 29 || this.loc < 0) {
        this.loc = 27;
    }
    this.moveTo(this.loc);

    // Reset message to blank
    this.message = " ";

    // DEBUG logging
    if(debug > 0){console.log("Moving player via handleInput argument "+move+" to new location of "+this.loc)};
};

// Log some info to console on game load
console.log("Welcome to Rich's game");
console.log("Enter debug=1 or debug=2 into console to trigger debugging if desired.")

// Configuration parameters asigned as variables
var speedMultiple = 20;
var stackHeight = 3;
var rowHeight = 83
var maxLanes = 3;
var freeze = 0;
var debug = 0;
var xStart = -100;
var xEnd = 550;

// Now instantiate the objects.
// Place the player object in a variable called player
var player = new Player(27);

// Bring some enemies into the game.
var icky = new Enemy("Icky", 7, 1)
var sticky = new Enemy("Sticky", 3, 2)
var tricky = new Enemy("Tricky", 4, 3)
var vicky = new Enemy("Vicky", 1, 4)
var micky = new Enemy("Micky", 6, 5);
var nicky = new Enemy("Nicky", 9, 6);
var ricky = new Enemy("Ricky", 5, 7);
var picky = new Enemy("Picky", 12, 8);
var steve = new Enemy("Steve", 30, 9);

// Place all enemy objects in an array called allEnemies
// Initial enemy set on easy mode.
var allEnemies = [icky,sticky,tricky,vicky];


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    // Modified to only print to console if debug is enabled
    if(debug > 0){console.log("player input at "+e)};
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
