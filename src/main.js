import { Boot } from './scenes/Boot';
import { ClickerGame } from './scenes/ClickerGame';
import { Game } from 'phaser';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        ClickerGame,
        GameOver
    ],
    audio: {
        disableWebAudio: true
    }
};

const game = new Game(config);

// Load and play the background music
game.scene.add('BackgroundMusic', {
    preload: function() {
        this.load.audio('backgroundMusic', 'Funk Guitar Backing Track in C Minor.mp3');
    },
    create: function() {
        const music = this.sound.add('backgroundMusic', { loop: true });
        music.play();
    }
});

game.scene.start('BackgroundMusic');
export default game;
