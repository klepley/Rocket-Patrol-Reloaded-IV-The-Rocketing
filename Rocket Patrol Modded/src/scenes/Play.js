class Play extends Phaser.Scene {
    constructor() {
        super("playScene")

    }

    create() {
        //placing tile sprite
        this.newstarfield = this.add.tileSprite(0,0, 640, 480, 'newstarfield').setOrigin(0, 0)

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0)
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

        //adding timer to screen
        this.remainingTime = game.settings.gameTimer / 100000000; // Convert milliseconds to seconds

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5,0)

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0)
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0)
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0)
        this.superspaceship01 = new SuperSpaceship(this, game.config.width + borderUISize*3, borderUISize*5, 'superspaceship', 0, 40).setOrigin(0, 0)
        this.superspaceship01.setScale(0.5); // Adjust the scale factor as needed (0.5 makes it half the size)


        //defining keys
        keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

        // initialize score
        this.p1Score = 0

        // display score
         let scoreConfig = {
             fontFamily: 'Courier',
             fontSize: '28px',
             backgroundColor: '#F3B141',
             color: '#843605',
             align: 'right',
             padding: {
                 top: 5,
                 bottom: 5,
             },
             //fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)
        this.fireText = this.add.text((game.config.width - borderUISize*10 - borderPadding*5), borderUISize + borderPadding*2, "FIRE", scoreConfig);

        //game over
        this.gameOver = false

        if (!localStorage.getItem('highScore')) {
            localStorage.setItem('highScore', 0);
        }
    
        // Display high score
        this.highScoreText = this.add.text(game.config.width - borderUISize - borderPadding - 200, borderUISize + borderPadding * 2, 'HS: ' + localStorage.getItem('highScore'), scoreConfig);


        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;

        // Update high score if needed
        const currentScore = this.p1Score;
        const highScore = parseInt(localStorage.getItem('highScore'), 10);

        if (currentScore > highScore) {
            localStorage.setItem('highScore', currentScore);
            this.highScoreText.text = 'HS: ' + currentScore;
        }
    }, null, this);

    // let fireTextConfig = {
    //     fontFamily: 'Courier',
    //     fontSize: '28px',
    //     backgroundColor: '#F3B141',
    //     color: '#843605',
    //     align: 'center',
    //     padding: {
    //         top: 5,
    //         bottom: 5,
    //     },
    // };
    // this.fireText = this.add.text(game.config.width / 2, game.config.height - borderUISize - borderPadding, 'FIRE', fireTextConfig).setOrigin(0.5);
    // this.fireText.visible = false; // Initially hide the 'FIRE' text
    }


    update() {
        this.fireText.visible = false;
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
          this.scene.restart();
        }
         // check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart()
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene")
        }

        this.newstarfield.tilePositionX -= 4

        if(!this.gameOver) {
            this.p1Rocket.update()

            this.ship01.update()               // update spaceships (x3)
            this.ship02.update()
            this.ship03.update()
            this.superspaceship01.update()

        
        }

        // if (Phaser.Input.Keyboard.JustDown(keyFIRE)) {
        //     // Show the 'FIRE' text
        //     this.fireText.visible = true;
    
        //     // Set a timer to hide the 'FIRE' text after 1 second
        //     this.time.delayedCall(1000, () => {
        //         this.fireText.visible = false;
        //     }, null, this);
        // }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship03)
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship02)
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.ship01)
        }
        if (this.checkCollision(this.p1Rocket, this.superspaceship01)) {
            this.p1Rocket.reset()
            this.shipExplode(this.superspaceship01)
        }
    
        //If rocket is fire, display "FIRE"
        if(this.p1Rocket.isFiring)
        {
          this.fireText.visible = true;
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
          rocket.x + rocket.width > ship.x && 
          rocket.y < ship.y + ship.height &&
          rocket.height + rocket.y > ship. y) {
          return true
        } else {
          return false
        }
    }
    
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode')             // play explode animation
        boom.on('animationcomplete', () => {   // callback after anim completes
          ship.reset()                         // reset ship position
          ship.alpha = 1                       // make ship visible again
          boom.destroy()                       // remove explosion sprite
        })
        // score add and text update
        this.p1Score += ship.points
        this.scoreLeft.text = this.p1Score
        
        this.sound.play('sfx-explosion')

    }
}
