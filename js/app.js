// Enemies our player must avoid
var Enemy = function(name, speed, stack) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Names for fun
    this.name = name;

    // Speed variable for this Enemy
    this.speed = speed;

    // Set stack order. This allowes nicer apperance when bugs ovelap.
    // The goal is to have the "front" bug lower on the screen in the lane.
    this.stack = stack;

    // standard starting values
    this.x = xStart;

    // Set initial Random y (lane) value
    this.laneSelection();

    // Logging
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
//
//    // Update location for collision detection. Because the bugs 
//    // run off screen need to set max loc value. The number of columns 
//    // in this lane or 'laneLocation' = (x + 'image offset') / 'columnWidth'
//    var laneLocation = Math.floor((this.x + 80) / 101);
//    if (laneLocation < 5) {
//        this.loc = this.base + laneLocation;
//    }

    // DEBUG logging level 2 (verbose)
    if(debug > 1){console.log("calling enemy update x="+this.x+" y="+this.y)}; 
//+" loc="+this.loc)};
}

// When instantiated, and when at end of row a new random lane
// should be set for any Enemy
Enemy.prototype.laneSelection = function(lane) {
    // set a new random lane between 1 and 3
    this.lane = Math.round((Math.random() * 2) + 1);
    
    // New y is ('lane number' * 'rowHeight') - 'height adjustment' + ('stack adjustment')
    this.y = (this.lane * rowHeight) - 35 + (this.stack * stackHeight);
    
//    // Set base location for collision detection ('lane' * 5[rows]) + 5 [water]
//    this.base = (this.lane * 5);
    // DEBUG level 1
    if(debug > 0){console.log("Enemy "+this.name+" is now in lane "+this.lane)};
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(loc){
    // Image for this player
    this.sprite = 'images/char-cat-girl.png';
    //this.sprite = 'images/enemy-bug.png';

    // Starting location
    this.loc = loc;

    // Set the initial coordinates of x and y based on locaiton
    this.moveTo(loc);

    this.message = "Run to WATER";

    this.score = "0";

    // log instatiation
    console.log("Welcoming a new player to the game.");
};

Player.prototype.update = function(){
    // Did the player win?
    if (this.loc < 5) {
        this.loc = 27;
        this.moveTo(this.loc);
        this.message = "YOU WON!";
        this.score++;
        console.log("Player won!!!");
    }
    // Is there a bug on you?
    allEnemies.forEach(function(enemy) {
        //if (enemy.loc === player.loc || ((enemy.loc - 1) === player.loc && enemy.x < (player.x + 80))) {
        if (enemy.lane === player.row && (enemy.x + 78) > player.x && enemy.x < (player.x + 80)) {
            console.log("THE BUG "+enemy.name+" GOT THE PLAYER at loc="+player.loc+"!!!");
            player.loc = 27;
            player.moveTo(player.loc);
            player.message = enemy.name+" ATE YOU!!";
            player.score = 0;
            freeze = 1;
            
        }
    });
};


Player.prototype.moveTo = function(loc){
    this.row = Math.floor(loc / 5);
    this.column = loc - (this.row * 5);
    this.y = (83 * this.row) - 20;
    this.x = 101 * this.column;
    //this.x = 202;
    //this.y = 302;

    if(debug > 0){console.log("For player moveTo changed values to row="+this.row+" loc="+this.loc+" x="+this.x+" y="+this.y)};
};
Player.prototype.render = function(){
    // Render the image on the canvas
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    // Render the player message on the canvas
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#FFF";
    ctx.font = "bold 10pt Comic Sans MS";
    ctx.fillText("Score:"+this.score, 40, 70);

    ctx.font = "bold 36pt Comic Sans MS";
    //ctx.lineWidth = "3";
    ctx.textAlign = "center";
    ctx.fillText(this.message, 250, 445);
    ctx.strokeText(this.message, 250, 445);

    // DEBUG logging level 2 or higher
    if(debug > 1){console.log("Calling player render")};
};
Player.prototype.handleInput = function(move){
    // Unfreeze the game on player input.
    freeze = 0;
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
    this.moveTo(this.loc);

    // Reset message to blank
    this.message = " ";

    // DEBUG logging
    if(debug > 0){console.log("Moving player via handleInput argument "+move+" to new location of "+this.loc)};
};


// Configuration parameters asigned as variables
var speedMultiple = 20;
var stackHeight = 4;
var rowHeight = 83
var freeze = 0;
var debug = 0;
var xStart = -80;
var xEnd = 650;




// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player(27);
var icky = new Enemy("Icky", 5, 1)
var sticky = new Enemy("Sticky", 2, 2)
var tricky = new Enemy("Tricky", 4, 3)
var vicky = new Enemy("Vicky", 7, 4)
var micky = new Enemy("Micky", 10, 5)
//var nicky = new Enemy("nicky", 10, 1)
//var ricky = new Enemy("ricky", 3, 3)
//var picky = new Enemy("picky", 3, 3)
//var steve = new Enemy("steve", 1, 4)

//var allEnemies = [icky,sticky,tricky,vicky,micky];
var allEnemies = [icky,sticky,tricky];
//var allEnemies = [sticky];





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
