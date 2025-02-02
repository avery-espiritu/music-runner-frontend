import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        //  Get the current highscore from the registry
        const score = this.registry.get('highscore');

        const textStyle = { fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff', stroke: '#000000', strokeThickness: 8 };

        this.add.image(400, 375, 'main-menu');

        const logo = this.add.image(512, -270, 'logo');

        this.tweens.add({
            targets: logo,
            y: 270,
            duration: 1000,
            ease: 'Bounce'
        });

        this.add.text(32, 32, `High Score: ${score}`, textStyle);

        const instructions = [
            'Move up and down to collect coins',
            'for funding the frog jazz club!',
            '',
            'Click to Start!'
        ]

        this.add.text(512, 570, instructions, textStyle).setAlign('center').setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('ClickerGame');

        });
    }
}
