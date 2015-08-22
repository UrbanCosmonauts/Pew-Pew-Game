/*
  variable declarations
  Description:
   the global variables we need access to in order to change the velocity of our character and a few others. 
  author: Alex Leonetti
*/

var SPEED = 200;
var GRAVITY = 1;
var LOAD_PLAYER_BOL = false;
var DEAD_PLAYER_X = 1;
var POS_X = 0;
var ANGLE = [];
var RAD_ANGLE = [];
var POS_Y = 0;
var DECELERATE = [];
var ACCELERATE = [];
var SHOOT = [];
var LIVES = [];
var SCORES = [];
var RESET = false;
var RESETGAMEOVER = false;
var GAMECONTEXT;
var PLAYERS_ARRAY = [];
var NUM_PLAYERS = 0;
var TIME = 0
var invaderGreenCount = 0;
var invaderPinkCount = 0;
var invaderWhiteCount = 0;
var invaderYellowCount  = 0;


/*
  variable declarations
  Description:
   These global variables are necessary in order to clear intervals and timeouts when a level is over, as well as 
   when a player dies. 
  author: Alex Leonetti
*/

var players;


var lasers;
var laserInterval;

var invaderYellows;
var invaderYellowInterval;

var invaderPinks;
var invaderPinkInterval;

var invaderWhites;
var invaderWhiteInterval;

var invaderGreens;
var invaderGreenInterval;

var coins;
var coinInterval;

var heartBonuses;
var heartBonusInterval;

var boss;
var bossInterval;

var music;
var musicArray = ['fox', 'gorillaz', 'lucky'];
var randomSong = Math.floor(Math.random()*3);
var musicReset = false;
var musicLoop = true;
var jumpEffect;
var deadEffect;

/*
  updatePosition
  Description:
   This is what constantly updates POS_X and POS_Y allowing our player to move 
  author: Alex Leonetti
*/

var updatePosition = function(positionArray) {

  for(var i=0; i<positionArray.length; i++) {

    NUM_PLAYERS=positionArray.length;

    if(positionArray && positionArray[i]) {
      ANGLE[i] = positionArray[i].data.yAngle;
      RAD_ANGLE[i] = ANGLE[i]*(Math.PI / 180)
      DECELERATE[i] = positionArray[i].data.decelerate;
      ACCELERATE[i] = positionArray[i].data.accelerate;
      SHOOT[i] = positionArray[i].data.shoot;
      LIVES[i] = positionArray[i].data.lives;
      SCORES[i] = positionArray[i].data.score;
      if(RESET && ACCELERATE[i]) {
        GAMECONTEXT.move();
      }
      if(RESETGAMEOVER && ACCELERATE[i]) {
        GAMECONTEXT.reset();
      }
    }
  }
};

/*
  display
  Description:
   Creates a new display object, connects it to the server, and sets up the updatePosition function
   as the handler for every communciation event 
  author: Alex Leonetti
*/
var display = new Display();
display.connect();
display.setInformationHandler(updatePosition);


/*
  state
  Description:
   The state object of a phaser game typically holds a preload, create, and update function. 
  author: Alex Leonetti
*/
var state = {

  /*
    preload
    Description:
     Loads our assets, spritesheets, and images 
    author: Alex Leonetti
  */
  preload: function() {
    console.log(this)
    this.load.image("platform", "assets/platform.png");
    this.load.image("falling", "assets/falling.png");
    this.load.image("negative", "assets/negative.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("background", "assets/background.jpg");
    this.load.image("floating", "assets/floating.png");
    // this.load.spritesheet("player", "assets/hero.png", 33.16, 49);
    // this.load.image("player", "assets/spaceship.png");
    this.load.spritesheet("fish", "assets/fish.png", 30, 40);
    this.load.spritesheet("orangeDino", "assets/orange-dino.png", 34.5, 42);
    this.load.spritesheet("purpleDino", "assets/purple-dino.png", 118, 150);

    this.load.image("laser", "assets/laser.png");

    this.load.image('water', 'assets/water.png');
    this.load.audio('fox', ['assets/sounds/fox.mp3']);
    this.load.audio('gorillaz', ['assets/sounds/gorillaz.mp3']);
    this.load.audio('lucky', ['assets/sounds/lucky.mp3']);
    this.load.audio('dead', ['assets/sounds/dead.mp3']);
    this.load.audio('jump', ['assets/sounds/jump.mp3']);

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    // NEW ASSETS
    // Here be the new graphics from Nick. Do not remove any graphics
    // below.
    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    // backgrounds
    this.load.image('starsSmall', 'assets/backgrounds/stars-small.png');
    this.load.image('starsBig', 'assets/backgrounds/stars-big.png');
    this.load.image('boundaryTop', 'assets/bounds/boundary-top.png');
    this.load.image('boundaryBottom', 'assets/bounds/boundary-bottom.png');

    // players
    this.load.image('player1', 'assets/players/player1.png');
    this.load.image('player2', 'assets/players/player2.png');
    this.load.image('player3', 'assets/players/player3.png');
    this.load.image('player4', 'assets/players/player4.png');

    // enemies
    this.load.image('enemy1', 'assets/enemies/invader-green.png');
    this.load.image('enemy2', 'assets/enemies/invader-white.png');
    this.load.image('enemy3', 'assets/enemies/invader-pink.png');
    this.load.image('enemy4', 'assets/enemies/invader-yellow.png');

    //heart
    this.load.image('heartlive', 'assets/hearts/heart-lives.png');
    this.load.image('heartbonus', 'assets/hearts/hearts-bonus.png');
    
    //fire 
    this.load.image('fire', 'assets/fire/orange.png');
    
    //coins
    this.load.image('coin', 'assets/coins/coin-10.png'); 

    //boss
    this.load.image('boss', 'assets/boss/boss.png'); 

  },

  /*
    create
    Description:
     Adds the assets into the game on load
    author: Alex Leonetti
  */
  create: function() {

  /*
    music
    Description:
     Adds one of the three songs from the array randomly.
     Loop starts when song ends.
    author: Brian Chu
  */

    music = game.add.audio(musicArray[randomSong]);
    music.play();
  
    music.onStop.add(function(){
      if(musicLoop === true) {
        music.play()
      }  
    }, this);
   

    /*
      physics
      Description:
       This statement allows the physics engine to be a part of our game
      author: Alex Leonetti
    */
    this.physics.startSystem(Phaser.Physics.ARCADE);

    /**
     * backgrounds
     * Description: multiple backgrounds!
     */
    // add background colour
    game.stage.backgroundColor = 0x14141e;
    
    // add small stars and auto scroll
    this.bgStarsSmall = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'starsSmall');
    this.bgStarsSmall.autoScroll(-20, 0);
    
    // add big stars and auto scroll
    this.bgStarsBig = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'starsBig');
    this.bgStarsBig.autoScroll(-40, 0);
    
    // add top boundary
    this.bgBoundaryTop = this.add.tileSprite(0, 0, this.world.width, 108, 'boundaryTop');
    this.bgBoundaryTop.autoScroll(-400, 0);

    // add bottom boundary
    this.bgBoundaryBottom = this.add.tileSprite(0, this.world.height - 108, this.world.width, 108, 'boundaryBottom');
    this.bgBoundaryBottom.autoScroll(-400, 0);

    /*
      players
      Description:
       Put the players in a group object for future optimization and multiplayer ability.
       Not being used now.
      author: Alex Leonetti
    */
    players = game.add.group();
    players.enableBody = true;

    coins = game.add.group();
    coins.enableBody = true;
    /*
      player
      Description:
       Creates the player and adds the animations depending on the position in the sprite sheet
      author: Alex Leonetti
    */
    this.players = [];
    /*
      platforms
      Description:
       Object created that holds all types of platforms a player can jump on
      author: Alex Leonetti
    */
    platforms = game.add.group();
    platforms.enableBody = true;

    lasers = game.add.group();
    fire = game.add.group();
    invaderGreens = game.add.group();
    invaderPinks = game.add.group();
    invaderWhites = game.add.group();
    invaderYellows = game.add.group();
    heartBonuses = game.add.group();

    boss = game.add.group();



    /*
      text
      Description:
       This adds text to a phaser game
      author: Alex Leonetti
    */
    this.scoreText = this.add.text(
      this.world.centerX,
      this.world.height/2,
      "",
      {
          size: "32px",
          fill: "#FFF",
          align: "center"
      }
    );

    this.scoreText.anchor.setTo(0.5, 0.5);

    /*
      reset
      Description:
       Allows the game to load the reset state first when it is created
      author: Alex Leonetti
    */
    this.reset();
  },

  /*
    update
    Description:
     Constantly called by the phaser engine updating all aspects of the game
    author: Alex Leonetti
  */
  update: function() {
    TIME++;

    coins.forEach(function(c) {
      if(c && c.body.x < -100) {
        c.kill();
      }
    });

    invaderYellows.forEach(function(o) {
      if(o && o.body.x < -100) {
        o.kill();
      }
    });
    invaderGreens.forEach(function(p) {
      if(p && p.body.x < -150) {
        p.kill();
      }
    });
    invaderWhites.forEach(function(p) {
      if(p && p.body.x < -150) {
        p.kill();
      }
    });
    invaderPinks.forEach(function(p) {
      if(p && p.body.x < -150) {
        p.kill();
      }
    });
    lasers.forEach(function(l) {
      if(l && l.body.x > 1000 || l.body.y > 1000 || l.body.y < -1000) {
        l.kill();
      }
    });

    // during reset phase, look for players
    // if player joins, add new player
    if (RESET){
      if (NUM_PLAYERS > this.players.length){ 
        for (var i = this.players.length; i<NUM_PLAYERS; i++){
          this.players[i] = players.create(0,0,'player'+(i+1));      
          this.players[i].anchor.setTo(0.5, 0.5);
          this.physics.arcade.enableBody(this.players[i]);
          this.players[i].reset(this.world.width / 6, 200+i*80);
          this.players[i].score = 0;
        }
      }
      if (NUM_PLAYERS === 1) {
        this.scoreTextP1 = this.add.text(
          10,
          10,
          "",
          {
              size: "32px",
              fill: "#FFF",
              align: "center"
          }
        );
        this.scoreTextP1.anchor.setTo(0, 0);
      } 

      if (NUM_PLAYERS === 2) {

        this.scoreTextP1 = this.add.text(
          10,
          10,
          "",
          {
              size: "32px",
              fill: "#FFF",
              align: "center"
          }
        );

        this.scoreTextP1.anchor.setTo(0, 0);

        this.scoreTextP2 = this.add.text(
          950,
          10,
          "",
          {
              size: "32px",
              fill: "#FFF",
              align: "center"
          }
        );
        this.scoreTextP2.anchor.setTo(1, 0);

      }

      if (NUM_PLAYERS === 3) {

        this.scoreTextP1 = this.add.text(
          10,
          10,
          "",
          {
              size: "32px",
              fill: "#FFF",
              align: "center"
          }
        );

        this.scoreTextP1.anchor.setTo(0, 0);

        this.scoreTextP2 = this.add.text(
          950,
          10,
          "",
          {
              size: "32px",
              fill: "#FFF",
              align: "center"
          }
        );
        this.scoreTextP2.anchor.setTo(1, 0);

        this.scoreTextP3 = this.add.text(
          10,
          670,
          "",
          {
              size: "32px",
              fill: "#FFF",
              align: "center"
          }
        );
        this.scoreTextP3.anchor.setTo(0, 1);
      } else if (NUM_PLAYERS === 4) {
        this.scoreTextP4 = this.add.text(
          950,
          670,
          "",
          {
              size: "32px",
              fill: "#FFF",
              align: "center"
          }
        );
        this.scoreTextP4.anchor.setTo(1, 1);
      }

    }

    /*
      collide
      Description:
       Phaser has collision detection already, here we declare what the players can collide with
       and what happens when you collide
      author: Alex Leonetti
    */
    // this.physics.arcade.collide(players, platforms);
    // this.physics.arcade.collide(players, orangeDinos, this.setGameOver, null, this);
    // this.physics.arcade.collide(players, purpleDinos, this.setGameOver, null, this);

    this.physics.arcade.overlap(players, invaderYellows, this.setGameOver, null, this);
    this.physics.arcade.overlap(players, invaderGreens, this.setGameOver, null, this);
    this.physics.arcade.overlap(players, invaderWhites, this.setGameOver, null, this);
    this.physics.arcade.overlap(players, invaderPinks, this.setGameOver, null, this);


    this.physics.arcade.overlap(lasers, invaderYellows, function(group, item){
      item.kill();
    }, null, this);

    this.physics.arcade.overlap(players, coins, function (group, item) {
      item.kill();
      group.score++;

      if(group.key === "player1"){
        this.scoreTextP1.setText(group.score);
      }else if(group.key === "player2"){
        this.scoreTextP2.setText(group.score);
      }else if(group.key === "player3"){
        this.scoreTextP3.setText(group.score);
      }else if(group.key === "player4"){
        this.scoreTextP4.setText(group.score);
      }
    }.bind(this));


    this.physics.arcade.overlap(lasers, invaderWhites, function(group, item){
      item.kill();
    }, null, this);

    this.physics.arcade.overlap(lasers, invaderGreens, function(group, item){
      item.kill();
    }, null, this);


    // this.physics.arcade.collide(players, fishes, this.setGameOver, null, this);

    /*
      kill()
      Description:
       Kill gets rid of the object in the game. Depending on the level we destroy all objects
       once they are off of the screen.
      author: Alex Leonetti
    */

    /*
      Velocity
      Description:
        Updates the character's velocity in game
      author: Alex Leonetti
    */
    // PLAYER 1
    this.players.forEach(function(player, i){
      if (player.body.x>1 && !player.dead){
        // This sets the player's angle smoothly
        player.angle = player.angle + (ANGLE[i] - player.angle)*.25;
      }
      // PLAYER 1
      if(DECELERATE[i] && !player.dead) {
        player.body.velocity.x += Math.cos(RAD_ANGLE[i])*(-20);
        player.body.velocity.y += Math.sin(RAD_ANGLE[i])*(-20);
      } else if(ACCELERATE[i] && !player.dead){
        player.body.velocity.x += Math.cos(RAD_ANGLE[i])*20;
        player.body.velocity.y += Math.sin(RAD_ANGLE[i])*20;
      } else {
        player.body.velocity.x *= .9;
        player.body.velocity.y *= .9;
      }

      if (SHOOT[i] && !player.dead) {
        var xPosition = player.body.x + player.body.halfWidth;
        var yPosition = player.body.y + player.body.halfHeight;
        var xOffset = Math.cos(RAD_ANGLE[i])*60;
        var yOffset = Math.sin(RAD_ANGLE[i])*60;
        this.spawnLaser(xPosition + xOffset, yPosition + yOffset, i);
      }

      if(this.gameStarted){
        if(player.body.x <= 10) {
          player.body.x = 10;
          
        } 

        if (player.body.y <= 100){
          player.body.y = 100;


        } 

        if (player.body.y >= 500){
          player.body.y = 500;

        } 

        if (player.body.x >= 890) {
          player.body.x = 890;
        }
      }
    }.bind(this));

    
    invaderGreens.forEach(function(invaderGreen){
        invaderGreen.body.y = Math.sin(TIME/10)*50 +340;
        // invaderGreen.body.velocity.y = -SPEED*Math.sin(game.time.now);
        // invaderGreen.body.velocity.x = SPEED*Math.cos(game.time.now);
    });

    invaderYellows.forEach(function(invaderYellow){
        invaderYellow.body.y = Math.sin(TIME/10)*50 +260;
        // invaderGreen.body.velocity.y = -SPEED*Math.sin(game.time.now);
        // invaderGreen.body.velocity.x = SPEED*Math.cos(game.time.now);
    });
    // invaderPinks.forEach(function(invaderPink){
    //     invaderPink.body.velocity.y += Math.sin(TIME/10)*10;
    //     // invaderGreen.body.velocity.y = -SPEED*Math.sin(game.time.now);
    //     // invaderGreen.body.velocity.x = SPEED*Math.cos(game.time.now);
    // });

    invaderWhites.forEach(function(invaderWhite){
        invaderWhite.body.y = Math.sin(TIME/10)*50 +420;
        // invaderGreen.body.velocity.y = -SPEED*Math.sin(game.time.now);
        // invaderGreen.body.velocity.x = SPEED*Math.cos(game.time.now);
    });
    
    boss.forEach(function(boss){
        boss.body.y = Math.sin(TIME/100)*60 + 200;
        // invaderGreen.body.velocity.y = -SPEED*Math.sin(game.time.now);
        // invaderGreen.body.velocity.x = SPEED*Math.cos(game.time.now);
    });
  },

  /*
    Reset
    Description:
      The loading screen, must clear all intervals and timeouts in order for game to function correctly.
      Must also remove all group objects so the game starts from scratch.
    author: Alex Leonetti
  */

  reset:function() {
    DECELERATE = [];
    ACCELERATE = [];
    GAMECONTEXT = this;

    // clearInterval(platformFloatingInterval);
    // clearTimeout(groundTimeout);
    // clearTimeout(flyTimeout);

    
    this.players.forEach(function(player){
      player.dead = false;
    });

    this.gameStarted = false;
    this.gameOver = false;

    /*
      Music Reset
      Description:
        musicReset set to false to prevent music.play() from being called again.
        Music plays from here on reset of the game.
      author: Brian Chu
    */

    if(musicReset === true) {
      musicLoop = true;
      musicReset = false;
      music.play();

      music.onStop.add(function(){
        if(musicLoop === true) {
          music.play()
        }  
      }, this);
    }

    this.players.forEach(function(player){
      player.reset(this.world.width / 4, 487);
      player.dead = true;
    }.bind(this));
    // this.player.animations.play('right');

    this.scoreText.setText("CONNECT PHONE TO ADD PLAYER");

    setTimeout(function() {
      RESET = true;
    }, 1000);

  },

  /*
    Start / Move
    Description:
      When called will start the game,
      loads the first level, sets timeouts for each corresponding level,
      clears the timeouts on death
    author: Alex Leonetti
  */
  start: function() {

    this.spawnAllEntities();  

    var context = this;
    this.players.forEach(function(player){
      player.dead = false;  
      player.body.gravity.y = GRAVITY;
    });
    this.scoreText.setText("");
    this.gameStarted = true;
       
  },
  move: function(){
    if(!this.gameStarted){
      // clearInterval(waterInterval);

      RESET = false;
      RESETGAMEOVER = false;

      this.lastNum = 500;
      this.start();
    }

    if(this.gameOver){
      this.reset();
    }
  },

  /*
    setGameOver
    Description:
      Restores variables
    author: Alex Leonetti
  */
  setGameOver: function() {

    clearInterval(invaderYellowInterval);
    clearInterval(invaderWhiteInterval);
    clearInterval(invaderGreenInterval);
    clearInterval(coinInterval);



    RESETGAMEOVER = true;

    this.gameOver = true;
    this.gameStarted = false;
    this.scoreText.setText("PRESS JUMP TO\nTRY AGAIN");
    // this.background.autoScroll(0, 0);
    this.players.forEach(function(player){
      player.dead = true;
      player.body.x = (32 * DEAD_PLAYER_X);
      player.body.y = 0;
      player.body.gravity.y = 0;
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;
    });
    // this.player.animations.play('still'); 

    deadEffect = game.add.audio('dead');
    deadEffect.play();

    /*
      Music Stop
      Description:
       Checks musicArray index, randomSong. Increases to the next song, or starts back at 0 if index is at the end.
      author: Brian Chu
    */
    if(randomSong === 2) {
      randomSong = 0;
    } else {
      randomSong++
    }

    /*
      musicReset
      Description:
       musicReset set to true to allow music to be played inside the "reset" function.
       musicLoop set to false to prevent music from playing music.onStop in the "create" function.
      author: Brian Chu
    */
    musicReset = true;
    musicLoop = false;
    music.stop();
    music = game.add.audio(musicArray[randomSong]);

    // this.input.onDown.removeAll();
    // this.input.onDown.add(this.reset, this);
  },

  /*
    spawnPlatforms / spawnFish / spawnDinos
    Description:
      These all generate the corresponding items
    author: Alex Leonetti
  */
  spawnPlatform: function() {
    this.ledge = platforms.create(960, this.generateRandomY(), 'platform');
    this.ledge.body.immovable = true;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.scale.setTo(2,1);
  },
  spawnFallingPlatform: function() {
    this.ledge = platforms.create(960, this.generateRandomY(), 'falling');
    this.ledge.body.immovable = false;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.scale.setTo(2,1);
  },
  spawnNegativePlatform: function() {
    this.ledge = platforms.create(960, 680, 'negative');
    this.ledge.body.immovable = true;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.body.velocity.y =  -(Math.random() * 200);
    this.ledge.scale.setTo(2,1);
  },
  spawnFloatingPlatform: function(y) {
    this.ledge = platforms.create(960, y || this.generateRandomGreaterY(), 'floating');
    this.ledge.body.immovable = true;
    this.ledge.body.velocity.x = -SPEED;
    this.ledge.scale.setTo(2,2);
  },




  // spawnWater: function() {
  //   var context = this;
  //   waterInterval = setInterval(function(){
  //     context.water = water.create(960, 570, 'water');
  //     context.water.body.immovable = true;
  //     context.water.body.velocity.x = -SPEED;
  //   },3315/(SPEED/100));
    
  // },

  /*
    generateRandomY
    Description:
      The function to spawn platforms within jumping range and able to fill entire screen
    author: Alex Leonetti
  */
  generateRandomY: function() {
    this.lastNum = this.lastNum || 500;
    this.lastNum = this.lastNum +  (Math.random() * 300 - 100);
    if(this.lastNum > 550) {
      this.lastNum = 400;
    }
    if(this.lastNum < 100) {
      this.lastNum = 300;
    }
    return this.lastNum;
  },

  /*
    generateRandomGreaterY
    Description:
      The function to spawn platforms within jumping range and stays on the upper part of the screen
    author: Alex Leonetti
  */
  generateRandomGreaterY: function() {
    this.lastGreaterNum = this.lastGreaterNum || 450;
    this.lastGreaterNum = this.lastGreaterNum +  (Math.random() * 200 - 100);
    if(this.lastGreaterNum > 500) {
      this.lastGreaterNum = 300;
    }
    if(this.lastGreaterNum < 100) {
      this.lastGreaterNum = 300;
    }
    return this.lastGreaterNum;
  },
  // spawnOrangeDino: function() {
  //   this.orangeDino = orangeDinos.create(960, 495, 'orangeDino');
  //   this.orangeDino.animations.add('walk', [0,1,2,3], 10, true);
  //   this.orangeDino.animations.play('walk');
  //   this.physics.arcade.enableBody(this.orangeDino);
  //   this.orangeDino.body.immovable = true;
  //   this.orangeDino.body.velocity.x = -SPEED - 50;
  // },
  // spawnPurpleDino: function() {
  //   this.purpleDino = purpleDinos.create(1000, 390, 'purpleDino');
  //   this.purpleDino.animations.add('walk', [0,1,2,3], 10, true);
  //   this.purpleDino.animations.play('walk');
  //   this.physics.arcade.enableBody(this.purpleDino);
  //   this.purpleDino.body.immovable = true;
  //   this.purpleDino.body.velocity.x = -SPEED - 80;
  // },

  spawnCoin: function(x,y){
    this.coin = coins.create(x,y, 'coin');
    this.physics.arcade.enableBody(this.coin);
    this.coin.body.velocity.x = -200;
  },

  spawnLaser: function(x,y,i) {
    this.laser = lasers.create(x, y, 'laser');
    this.physics.arcade.enableBody(this.laser);
    this.laser.body.immovable = true;
    this.laser.anchor.setTo(.5, .5);
    this.laser.body.velocity.x = Math.cos(RAD_ANGLE[i])*300;
    this.laser.body.velocity.y = Math.sin(RAD_ANGLE[i])*300;
    this.laser.angle = ANGLE[i];
  },
  spawnFire: function(x,y,i) {
    this.fire = fire.create(x, y, 'fire');
    this.physics.arcade.enableBody(this.fire);
    this.fire.anchor.setTo(.5, .5);
    this.fire.body.velocity.x = Math.cos(RAD_ANGLE[i])*-100;
    this.fire.body.velocity.y = Math.sin(RAD_ANGLE[i])*-100;
    this.fire.lifespan = 1500;
  },
  spawnInvaderGreen: function() {
    this.invaderGreen = invaderGreens.create(1000, 390, 'enemy1');
    this.physics.arcade.enableBody(this.invaderGreen);
    this.invaderGreen.body.immovable = true;
    this.invaderGreen.body.velocity.x = -SPEED;
  },

  spawnInvaderYellow: function() {
    this.invaderYellow = invaderYellows.create(1000, 390, 'enemy4');
    this.physics.arcade.enableBody(this.invaderYellow);
    this.invaderYellow.body.immovable = true;
    this.invaderYellow.body.velocity.x = -SPEED;
  },

  spawnInvaderWhite: function() {
    this.invaderWhite = invaderWhites.create(1000, 390, 'enemy2');
    this.physics.arcade.enableBody(this.invaderWhite);
    this.invaderWhite.body.immovable = true;
    this.invaderWhite.body.velocity.x = -SPEED;
  },

  spawnBoss: function(){
    this.boss = boss.create(850,800, 'boss');
    this.physics.arcade.enableBody(this.boss);
    this.boss.anchor.setTo(0.5, 0.5);
    this.boss.body.velocity.x = 0;
  },

  spawnInvaderPink: function(y){
    this.invaderPink = invaderPinks.create(1000,y, 'enemy3');
    this.physics.arcade.enableBody(this.invaderPink);
    this.invaderPink.body.immovable = true;
    this.invaderPink.body.velocity.x = -SPEED;
  },


  /*
    levelWater
    Description:
      Everything spawned for the water level
    author: Alex Leonetti
  */
  // levelWater: function() {
  //   this.level = 'water';

  //   clearInterval(platformFloatingInterval);
  //   clearInterval(purpleDinoInterval);
  //   clearInterval(orangeDinoInterval);

  //   this.ground = platforms.create(0, game.world.height-64, 'ground');
  //   this.ground.scale.setTo(2,2);
  //   this.ground.body.immovable = true;
  //   this.ground.body.velocity.x = -SPEED;


  //   this.spawnPlatform();
  //   this.water = water.create(960, 570, 'water');
  //   this.water.immovable = true;
  //   this.water.body.velocity.x = -SPEED;
  //   this.spawnWater();

  //   var context = this;
  //   if(this.gameStarted) {
  //     platformInterval = setInterval(function(){
  //       context.spawnPlatform();
  //     }, 3000/(SPEED/100));
  //     platformFallingInterval = setInterval(function(){
  //       context.spawnFallingPlatform();
  //     }, (2000)/(SPEED/100));
  //     platformNegativeInterval = setInterval(function(){
  //       context.spawnNegativePlatform();
  //     }, 8000/(SPEED/100));
  //     fishInterval = setInterval(function() {
  //       context.spawnFish();
  //     }, 4900/(SPEED/100));
  //   } 
  // },



  /*
    levelGround
    Description:
      Everything spawned for the ground level
    author: Alex Leonetti
  */
  // levelGround: function() {
  //   this.level = 'ground';
  //   var context = this;

  //   // clearInterval(platformInterval);
  //   // clearInterval(platformFallingInterval);
  //   // clearInterval(platformNegativeInterval);
  //   // clearInterval(waterInterval);
  //   // clearInterval(invaderGreenInterval);
  //   clearInterval(laserInterval);


  //   // this.ground = platforms.create(960, game.world.height-64, 'ground');
  //   // this.ground.scale.setTo(20,2);
  //   // this.ground.body.immovable = true;
  //   // this.ground.body.velocity.x = -SPEED;


  //   // this.spawnFloatingPlatform(350);



    // laserInterval = setInterval(function() {
    //   var xPosition = [];
    //   var yPosition = [];
    //   var xOffset = [];
    //   var yOffset = [];
    //   context.players.forEach(function(player, i){
    //     xPosition[i] = player.body.x + player.body.halfWidth;
    //     yPosition[i] = player.body.y + player.body.halfHeight;
    //     xOffset[i] = Math.cos(RAD_ANGLE[0])*60;
    //     yOffset[i] = Math.sin(RAD_ANGLE[0])*60;
    //     context.spawnLaser(xPosition[i] + xOffset[i], yPosition[i] + yOffset[i], i);
    //   });
    // }, 200);

  //   // platformFloatingInterval = setInterval(function() {
  //   //   context.spawnFloatingPlatform();
  //   // }, 3000/(SPEED/100));

  //   // purpleDinoInterval = setInterval(function() {
  //   //   context.spawnPurpleDino();
  //   // }, 6000/(SPEED/100));

  // },

  /*
    levelFly
    Description:
      Everything spawned for the water level and planning on adding other enemies
    author: Alex Leonetti
  */
  // levelFly: function() {
  //   var context = this;
  //   this.levelWater();
  // }

  spawnAllEntities: function (argument) {
    var context = this;
    fireInterval = setInterval(function() {
      var xPosition = [];
      var yPosition = [];
      var xOffset = [];
      var yOffset = [];
      this.players.forEach(function(player, i){
        xPosition[i] = player.body.x + player.body.halfWidth;// - player.body.halfWidth;
        yPosition[i] = player.body.y + player.body.halfHeight;
        xOffset[i] = Math.cos(RAD_ANGLE[i])*50;
        yOffset[i] = Math.sin(RAD_ANGLE[i])*50;
        this.spawnFire(xPosition[i] - xOffset[i], yPosition[i] - yOffset[i], i);
      }.bind(this));
    }.bind(this), 200);

    coinInterval = setInterval(function() {
      var y = Math.random()*370+150;
      for (var i = 0; i<8; i++){
        context.spawnCoin(1000+i*80, y);
      }
    }, 5000);

    bossInterval = setInterval(function() {
      context.spawnBoss();
    }, 20000);

    invaderGreenInterval = setInterval(function (argument) {
      this.spawnInvaderGreen();
    }.bind(this), 3000); 

    invaderYellowInterval = setInterval(function (argument) {
      this.spawnInvaderYellow();
    }.bind(this), 3000); 

    invaderWhiteInterval = setInterval(function (argument) {
      this.spawnInvaderWhite();
    }.bind(this), 3000); 

    // invaderPinkInterval = setInterval(function() {
    //   var y = Math.random()*370+150;
    //   var delay = 0;
    //   for(var i = 0; i<6; i++){
    //     delay += 350;
    //     (function(){setTimeout(function(y){context.spawnInvaderPink(400);}, delay);})();
    //   }
    // }, 2000);

  }
}

/*
  game
  Description:
    The creation of the actual game.
    Uses the state object within the phaser game.
  author: Alex Leonetti
*/





var game = new Phaser.Game(
  960,
  680,
  Phaser.AUTO,
  'game',
  state
)
