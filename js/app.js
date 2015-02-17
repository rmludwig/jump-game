// Enemies our player must avoid
var Enemy = function(name, initialSpeed, stack, sprite) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Names for fun and image control
    this.name = name;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = sprite;

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
    console.log('Welcoming the enemy '+this.name+' to the game.');
};

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
    if(debug > 1){console.log('calling enemy update x='+this.x+' y='+this.y)}; 
};

// When instantiated, and when at end of row a new random lane
// should be set for any Enemy
Enemy.prototype.laneSelection = function(lane) {
    // set a new random lane between 1 and 3
    this.lane = Math.floor((Math.random() * maxLanes) + 1);
    
    // New y is ('lane number' * 'rowHeight') - 'height adjustment' + ('stack adjustment')
    this.y = (this.lane * rowHeight) - 35 + (this.stack * stackHeight);
    
    // DEBUG level 1
    if(debug > 0){console.log('Enemy '+this.name+' is now in lane '+this.lane)};
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Reset the enemy to its initial speed after game restart
Enemy.prototype.reset = function() {
    this.speed = this.initialSpeed;

    // DEBUG level 1
    if(debug > 0){console.log('Enemy '+this.name+' was reset to start values')};
};



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
    console.log('Welcoming a new player to the game.');
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
            console.log('An Enemy named '+enemy.name+' GOT THE PLAYER at loc='+player.loc+'!!!');
            
            // Put player out of bounds, then next move will bring them to start position
            player.loc = 32;
            
            // decrease lives 
            player.lives--;

            // Is the game over? (out of lives)
            if (player.lives < 0) {
                player.message = 'GAME OVER';

                // Temporarily set lives back to 0 so when rendered -1 is not seen
                player.lives = 0;

                // Log GAME OVER
                console.log(player.message);
            }
            else {
                player.message = 'Try again';
            }
            
            // Pause game
            freeze = 1;
        }
    });

    // PowerUp achievments
    // Did player get a power up in time?
    if (powerUp.loc === player.loc && powerUp.visible === 1) {
            powerUp.collectReward();
    };

    // Did the player reach the goal?
    // Manage level and difficulty increases 
    if (this.loc < 5) {
        // After goal go to start position, increase game level, and increase score
        this.loc = 27;
        this.moveTo(this.loc);
        this.score = this.score + perLevelScore;
        currentGameLevel++;
        this.message = 'Level '+currentGameLevel;
        console.log('Player GOAL!!!');

        // Replace powerUps after score
        powerUp.moveToRandomLoc();
        powerUp.setRandomPowerUpType();

        // Difficulty increased based on player level
        if (currentGameLevel === 5) {
            perLevelScore = 2;
            tricky.reset();
            allEnemies.push(micky,nicky);
            this.message = 'Pink Levels';
            this.sprite = 'images/char-pink-girl.png';
            console.log('Difficulty Pink');
        }
        else if (currentGameLevel === 10) {
            perLevelScore = 3;
            tricky.reset();
            sticky.speed = sticky.speed + 5;
            allEnemies.push(ricky);
            this.message = 'Kitty Levels';
            this.sprite = 'images/char-cat-girl.png';
            console.log('Difficulty Kitty');
        }
        else if (currentGameLevel === 15) {
            perLevelScore = 5;
            tricky.reset();
            nicky.speed = nicky.speed + 5;
            allEnemies.push(picky);
            this.message = 'Mage Levels';
            this.sprite = 'images/char-horn-girl.png';
            console.log('Difficulty Mage');
        }
        // Boss levels
        else if (currentGameLevel === 20) {
            perLevelScore = 10;
            tricky.reset();
            picky.speed = picky.speed + 5;
            allEnemies.push(steve);
            this.message = 'Boss Levels';
            this.sprite = 'images/char-princess-girl.png';
            console.log('Difficulty BOSS LEVELS');
        }
        else {
            // Minor difficulty increase for each level.
            tricky.speed = tricky.speed + 2;
            // Medium difficulty increase higher levels.
            if (currentGameLevel > 15) {
                ricky.speed = ricky.speed + 3;
            }
            // Major difficulty increase for boss levels.
            if (currentGameLevel >= 20) {
                steve.speed = steve.speed + 5;
            }
            // CRAZY LEVELS.
            if (currentGameLevel >= 25) {
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
    this.message = 'Jump to WATER';
    this.score = 0;
    this.lives = 3;

    // Reset global game level
    currentGameLevel = startingGameLevel;

    // Reset global per level score
    perLevelScore = initialPerLevelScore;

    // Reset the global I modified for CRAZY levels
    // No more enemies in the grass.
    maxLanes = 3;

    // Log new game
    console.log('Player was reset.');
};

// Move a player to a new position on game board
Player.prototype.moveTo = function(loc){
    // Calculate the row and column based on location value
    this.row = Math.floor(loc / 5);
    this.column = loc - (this.row * 5);

    // Calculate x and y subtracting image width adjustment from y.
    this.y = (83 * this.row) - 20;
    this.x = 101 * this.column;

    // DEBUG level 1
    if(debug > 0){console.log('For player moveTo changed values to row='+this.row+' loc='+this.loc+' x='+this.x+' y='+this.y)};
};

// Along with player render also render player messages.
Player.prototype.render = function(){
    // Render the image on the canvas
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Render the player score and lives always
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 10pt Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('Score: '+this.score, 10, 70);
    ctx.fillText('Lives: '+this.lives, 111, 70);
    ctx.fillText('Level: '+currentGameLevel, 414, 70);

    // Render the player message on the canvas as needed
    if (this.message.match(/\w/)) {
        ctx.font = 'bold 36pt Comic Sans MS';
        ctx.lineWidth = '2';
        ctx.textAlign = 'center';
        ctx.fillText(this.message, 250, 445);
        ctx.strokeText(this.message, 250, 445);
    }

    // DEBUG logging level 2 or higher
    if(debug > 1){console.log('Calling player render')};
};

// As key strokes occure they will be processed against the 
// Player object in this function. Those movements will
// change the location of the player. Also these inputs 
// will be used to start the game again after GAME OVER.
Player.prototype.handleInput = function(move){
    // Unfreeze the game on player input.
    freeze = 0;

    // Start new game if needed. Or if they cancel leave
    // paused. This would be better if not using JS confirm
    // dialogue. But for now it functions as needed. Maybe
    // for fun later I will create a custom in game dialogue.
    if (player.message === 'GAME OVER') {
        var newGame = confirm('Do you want to start a new game?');
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
            powerUp.reset();
        }
    }

    // Move in requested direction if not moving out of bounds.
    // Move is accomplished by modifying the loc parameter as needed.
    if (move === 'up' && this.loc > 4) {
        this.loc = this.loc - 5;
    }
    else if (move === 'down' && this.loc < 25) {
        this.loc = this.loc + 5;
    }
    else if (move === 'left' && (this.loc % 5 !== 0)) {
        this.loc = this.loc - 1;
    }
    else if (move === 'right' && (this.loc % 5 !== 4)) {
        this.loc = this.loc + 1;
    }
    
    // out of bounds recovery
    if (this.loc > 29 || this.loc < 0) {
        this.loc = 27;
    }
    this.moveTo(this.loc);

    // Reset message to blank
    this.message = ' ';

    // DEBUG logging
    if(debug > 0){console.log('Moving player via handleInput argument '+move+' to new location of '+this.loc)};
};


// This is the class for power up objects. They will not
// move but will will have a variety of other behaviors.
// There will be one powr up per level.
var PowerUp = function(type){
    // Initialize all values via reset
    this.reset();

    // DEBUG level 1 log instatiation
    if(debug > 0){console.log('Added the PowerUp')};
};

// Reset the player after game restart
PowerUp.prototype.reset = function(){
    // Initial timeout value
    this.seconds = initialPowerUpSeconds;

    // Set initial values, these will change to new random
    // values as the object cycles through the game.
    this.moveToRandomLoc();
    this.setRandomPowerUpType();

    // Set special star BONUS values
    this.resetStar();

    // DEBUG level 1 when reset
    if(debug > 0){console.log('PowerUp was reset.')};
};

// Because star bonus's have special characteristics this 
// is needed to reset the star bonus after timeout or
// when all PowerUp's are reset.
PowerUp.prototype.resetStar = function(){
    // Initial star count and score for special star bonus
    this.starCount = 5;
    this.starScore = 1;

    // Initialize seconds to proper value if this was
    // not a full PowerUp reset. Like on star timeout.
    if (this.seconds !== initialPowerUpSeconds) {
        this.seconds = initialPowerUpSeconds - currentGameLevel | 3;
    }

    // DEBUG level 1 when star was reset
    if(debug > 0){console.log('PowerUp STAR was reset.')};
};

// Set a PowerUps random location outside of water and player start
PowerUp.prototype.moveToRandomLoc = function(){
    // Since this is being moved let's make it visible
    this.visible = 1;

    // Generate random location
    this.loc = Math.floor((Math.random() * 25) + 5);

    // Prevent players position from being new location.
    if (this.loc === 27) {
        this.loc = 25;
    }

    // Calculate the row and column based on location value
    this.row = Math.floor(this.loc / 5);
    this.column = this.loc - (this.row * 5);

    // Calculate x and y subtracting image width adjustment from y.
    this.y = (83 * this.row) - 20;
    this.x = 101 * this.column;

    // Each time this is called decrease the timeout until it is 1 second
    if (this.seconds > 3) {
        this.seconds--;
    }
    else {
        this.seconds = 3;
    }

    // Set the timeout time.
    var now = Date.now();
    this.timeout = now + (this.seconds * 1000);

    // DEBUG level 1
    if(debug > 0){console.log('For PowerUp the moveTo function changed values to seconds='+this.seconds+' row='+this.row+' loc='+this.loc+' x='+this.x+' y='+this.y)};
};

// Set a PowerUp type randomly
PowerUp.prototype.setRandomPowerUpType = function(){
    // Generate random type
    this.type = Math.floor((Math.random() * 10) + 1);

    // PowerUp sprites based in their type number
    if (this.type > 0 && this.type < 5) {
        this.sprite = 'images/Gem-sm-blue.png';
    }
    else if (this.type > 4 && this.type < 7) {
        this.sprite = 'images/Gem-sm-green.png';
    }
    else if (this.type === 7) {
        this.sprite = 'images/Gem-sm-orange.png';
    }
    else if (this.type === 8) {
        this.sprite = 'images/Heart-sm.png';
    }
    else if (this.type === 9) {
        this.sprite = 'images/Star-sm.png';
    }
    else if (this.type === 10) {
        this.sprite = 'images/Key-sm.png';
    }

    // DEBUG level 1
    if(debug > 0){console.log('New powerup type set to '+this.type)};
};

// Along with player render also render player messages.
PowerUp.prototype.render = function(){
    // Render the image on the canvas
    // ONLY if it is currelty visible.
    if (this.visible === 1) {

        // Manage the timeout here. If timed out set to invisible
        // and reset the star bonus PowerUp.
        var now = Date.now();
        if (this.timeout > now) {
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

            // DEBUG logging level 2 or higher
            if(debug > 1){console.log('Calling powerUp render')};
        }
        else {
            this.visible = 0;
            this.resetStar();
        }
    }
};

// Along with player render also render player messages.
PowerUp.prototype.collectReward = function(){
    // Once player reaches power up it dissapears
    this.visible = 0;

    // Provide different behavior for different types
    // Blue (type 1 - 4) 1 point.
    if (this.type > 0 && this.type < 5) {
        player.message = 'BONUS';
        player.score++;
        if(debug > 0){console.log('One point bonus')};
    }
    // Green (type 5 and 6) 2 points.
    else if (this.type > 4 && this.type < 7) {
        player.message = '2 x BONUS';
        player.score = player.score + 2;
        if(debug > 0){console.log('Two point bonus')};
    }
    // Orange (type 7) 5 points.
    else if (this.type === 7) {
        player.message = '5 x BONUS';
        player.score = player.score + 5;
        if(debug > 0){console.log('Five point bonus')};
    }
    // Heart is 1 more life
    else if (this.type === 8) {
        player.message = '1 UP';
        player.lives++;
        if(debug > 0){console.log('Extra life')};
    }
    // Star gives you five bonus's. Each one has higher
    // points and a quicker timeout.
    else if (this.type === 9) {
        player.score = player.score + this.starScore;

        // DEBUG level 1 for monitoring star bonus mechanics
        if(debug > 0){console.log('Star bonus points '+this.starScore+' timeout '+this.seconds+' and count '+this.starCount)};
        
        // move new star to location
        this.moveToRandomLoc();
        if (this.starCount === 5) {
            player.message = 'STAR POWER';
            this.starScore++;
            this.starCount--;
            this.seconds = 5;
        }
        else if (this.starCount < 5 && this.starCount > 0) {
            this.starScore++;
            this.starCount--;
        }
        else {
            // End of star bonus
            this.resetStar();
            this.visible = 0;
        }
    }
    // Key to next level bonus. If the player gets
    // the key they skip ahead one level by teleporting
    // to the water (finish line on current level).
    // AND they get 5 points too.
    else if (this.type === 10) {
        player.score = player.score + 10;
        player.loc = 2;
        if(debug > 0){console.log('Teleported to next level')};
    }
};



// Log some info to console on game load
console.log("Welcome to Rich's game");
console.log('Enter debug=1 or debug=2 into console to trigger debugging if desired.');

// Configuration parameters asigned as variables
var initialPowerUpSeconds = 20;
var initialPerLevelScore = 1;
var startingGameLevel = 1;
var speedMultiple = 20;
var stackHeight = 3;
var rowHeight = 83
var maxLanes = 3;
var freeze = 0;
var debug = 0;
var xStart = -100;
var xEnd = 550;

// Starting the game (this will be reset when player is reset)
var currentGameLevel = startingGameLevel;

// Add some PowerUp for fun.
var powerUp = new PowerUp();

// Now instantiate the objects.
// Place the player object in a variable called player
var player = new Player(27);

// Bring some enemies into the game.
var icky = new Enemy('Icky', 7, 1, 'images/enemy-bug.png');
var sticky = new Enemy('Sticky', 3, 2, 'images/enemy-bug.png');
var tricky = new Enemy('Tricky', 4, 3, 'images/enemy-bug.png');
var vicky = new Enemy('Vicky', 1, 4, 'images/enemy-bug-green.png');
var micky = new Enemy('Micky', 6, 5, 'images/enemy-bug.png');
var nicky = new Enemy('Nicky', 9, 6, 'images/enemy-bug.png');
var ricky = new Enemy('Ricky', 5, 7, 'images/enemy-bug.png');
var picky = new Enemy('Picky', 12, 8, 'images/enemy-bug.png');
var steve = new Enemy('Steve', 30, 9, 'images/enemy-bug-red.png');

// Place all enemy objects in an array called allEnemies
// Initial enemy set on easy mode.
var allEnemies = [icky,sticky,tricky,vicky];



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    // Modified to only print to console if debug is enabled
    if(debug > 0){console.log('player input at '+e)};
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
