import * as Phaser from "phaser";

class CleaningScene extends Phaser.Scene {
    preload() {
        this.load.image('tile', 'assets/tile.png');
        this.load.image('robot', 'assets/robot.png');
    }

    create() {
        for (let x = 0; x < 480; x += 48) {
            for (let y = 0; y < 360; y += 48) {
                this.add.image(x, y, 'tile').setOrigin(0, 0);
            }
        }
        this.add.image(48, 48, 'robot').setOrigin(0, 0);
    }
}

export class CleaningCanvas {
    game: Phaser.Game;

    constructor(elem: HTMLElement) {
        this.game = new Phaser.Game({
            type: Phaser.AUTO,
            parent: elem,
            width: 480,
            height: 360,
            scene: CleaningScene,
        });
    }
}

