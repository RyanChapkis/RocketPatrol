class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // new spaceshiphigh
        this.load.image('spaceship2', './assets/spaceship2.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create(){
        // place tile spriteq
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xb827f4).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xb827f4).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xb827f4).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xb827f4).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00fff0).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2 - 8, 431, 'rocket').setScale(0.5, 0.5).setOrigin(0, 0);
        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);
        // add fast spaceship (x1)
        this.ship04 = new Spaceshiphigh(this, game.config.width + 288, 105, 'spaceship2', 0, 50).setScale(0.7, 0.7).setOrigin(0,0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score
        this.p1Score = 0;
        // score display
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
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);



        // // high score
        // this.highScore = this.p1Score;
        
        // // highscore display
        // let highscoreConfig = {
        //     fontFamily: 'Courier',
        //     fontSize: '28px',
        //     backgroundColor: '#F3B141',
        //     color: '#843605',
        //     align: 'right',
        //     padding: {
        //         top: 5,
        //         bottom: 5,
        //     },
        //     fixedWidth: 100
        // }
        // this.highscoreLeft = this.add.text(400, 54, this.highScore, highscoreConfig);

        // fire UI display
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.fireLeft = this.add.text(200, 54, 'FIRE', fireConfig);

        // game over flag
        this.gameOver = false;
        //speed up flag
        this.speedUp = false;
        //speed up game after 30 seconds
    this.clock = this.time.delayedCall(30000, () => {
        this.speedUp = true;
    }, null, this);

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);


    }

    update() {
        if (this.speedUp){
            if(!this.gameOver){
                this.game.settings.spaceshipSpeed = 7;
            }
        }

        // if(this.gameOver){
        //     if(this.highScore < this.p1Score){
        //         this.highScore = this.p1Score;
        //         window.localStorage.setItem(this.highScore);
        //     }
        // }

         // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 4;

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            //update new spaceship
            this.ship04.update();
        } 
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;    
        this.sound.play('sfx_explosion');  

    }
      
}