import { Scene } from 'phaser';

export class ClickerGame extends Scene
{
    constructor ()
    {
        super('ClickerGame');
    }

    create ()
    {
        this.score = 0;
        this.gameRunning = true;

        this.coins = [];
        this.coinYValues = [];
        let start = 235;
        let step = 36;
        let count = 11;

        for (let i = 0; i < count; i++) {
            this.coinYValues.push(start + i * step);
        }
        // this.coins = this.physics.add.group();

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.background = this.add.tileSprite(512, 384, 1024, 768, 'background');

        this.scoreText = this.add.text(32, 32, 'Coins: 0', textStyle).setDepth(1);
        this.timeText = this.add.text(1024 - 32, 32, 'Time: 10', textStyle).setOrigin(1, 0).setDepth(1);

        //  Our 10 second timer. It starts automatically when the scene is created.
        this.timer = this.time.addEvent({ delay: 30000, callback: () => this.gameOver() });

        this.physics.world.setBounds(0, -400, 1024, 768 + 310);

        this.player = this.physics.add.sprite(200, 415, 'player');
        this.player.setWidth = 1000;
        this.player.setCollideWorldBounds(true);
        this.player.play('walk');

        this.clef = this.add.sprite(80, 415, 'clef-note');
        this.clef.setScale(1.5, 1.5)

        // this.physics.add.overlap(player, gameObject, this.clickCoin(gameObject), null, this);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('gameobjectdown', (pointer, gameObject) => this.clickCoin(gameObject));

        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);

        this.inputCooldown = 0;

        this.dropCoin();

        this.coinTimer = this.time.addEvent({
            delay: 800, // 0.8 second
            callback: this.dropCoin,
            callbackScope: this,
            loop: true
        });
    }

    checkIfOffScreen()
    {
        for(coin in this.coins){
            if(coin.x <= 0){
                coin.destroy();
            }
        }
    }

    dropCoin ()
    {
       if (!this.gameRunning) return;

       const x = 1000;
       const y = Phaser.Utils.Array.GetRandom(this.coinYValues);

       const coin = this.physics.add.sprite(x, y, 'coin').play('rotate');

       coin.setVelocityX(-200);
       coin.setInteractive();

       this.coins.push(coin);
    }

    collectCoin(player, coin) {
        // Update the score or perform other actions
        coin.disableBody(true, true);

        // const musicNote = this.physics.add.sprite(coin.x, coin.y, 'musicnote');
        // musicNote.setVelocityX(-200);
        // musicNote.setInteractive();

        // const musicNote = this.physics.add.sprite(coin.x, coin.y, 'musicnote');
        // musicNote.setVelocityX(-200);
        // musicNote.setInteractive();

        // this.coins.push(musicNote);

        //  Add 1 to the score
        this.score++;

        //  Update the score text
        this.scoreText.setText('Coins: ' + this.score);

        // this.coins.push(musicNote);

        //  Drop a new coin
        // this.dropCoin();
    }

    update ()
    {
        const moveAmount = 36

        // Check for cursor key input and update player velocity accordingly
        // setTimeout(() => {
        //     console.log("Paused for 2 seconds");
        // }, 200);
        if (this.inputCooldown > 0) {
            this.inputCooldown -= 1;
        }

        if (this.inputCooldown <= 0) {
            if (this.cursors.up.isDown && this.player.y - moveAmount >= 6*36) {
                this.player.y -= moveAmount;
                this.inputCooldown = 12; // Set cooldown time in milliseconds
            } else if (this.cursors.down.isDown && this.player.y + moveAmount <= 410 + (5*36)) {
                this.player.y += moveAmount;
                this.inputCooldown = 12; // Set cooldown time in milliseconds
            }
        }

        // this.coins.children.each(function(coin) {
        //     if (coin.x < 0 || coin.x > this.physics.world.bounds.width 
        //         || coin.y < 0 || coin.y > this.physics.world.bounds.height) {
        //         coin.destroy();
        //     }
        // }, this);

        this.timeText.setText('Time: ' + Math.ceil(this.timer.getRemainingSeconds()));

        this.background.tilePositionX += 1;
        
        //requestAnimationFrame(this.checkIfOffScreen);
    }

    keyInput ()
    {
        // if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
        //     this.player.y -= moveAmount;
        // } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
        //     this.player.y += moveAmount;
        // }
    }

    gameOver ()
    {
        this.gameRunning = false;

        this.coins.forEach((coin) => {

            if (coin.active)
            {
                coin.setVelocity(0, 0);
                // coin.disableBody(true, true);
            }

        });

        this.input.off('gameobjectdown');

        //  Save our highscore to the registry
        const highscore = this.registry.get('highscore');

        if (this.score > highscore)
        {
            this.registry.set('highscore', this.score);
        }

        //  Swap to the GameOver scene after a 2 second delay
        this.time.delayedCall(2000, () => this.scene.start('GameOver'));
    }
}
