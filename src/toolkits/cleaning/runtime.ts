import * as Phaser from "phaser";

class CleaningScene extends Phaser.Scene {
    robot: Phaser.GameObjects.Image;
    angle: integer;
    
    TILE_WIDTH = 48;
    TILE_HEIGHT = 48;
    TWEEN_DURATION = 300;

    preload() {
        this.load.image('tile', 'assets/tile.png');
        this.load.image('robot', 'assets/robot.png');
    }

    create() {
        for (let x = 0; x < 480; x += this.TILE_WIDTH) {
            for (let y = 0; y < 360; y += this.TILE_HEIGHT) {
                this.add.image(x, y, 'tile').setOrigin(0, 0);
            }
        }
        this.robot = this.add.image(this.TILE_WIDTH * 1.5, this.TILE_HEIGHT * 1.5, 'robot')
    }

    getHeadingDirection() {
        const radians = Phaser.Math.DegToRad(this.robot.angle);
        const direction = { x: Math.cos(radians), y: Math.sin(radians) };
        return direction;
    }

    async moveRobotAngle(angle: integer) {
        this.robot.angle = angle;
        const direction = this.getHeadingDirection();

        const newRobotX = this.robot.x + direction.x * this.TILE_WIDTH;
        const newRobotY = this.robot.y + direction.y * this.TILE_HEIGHT;
      
        const tweenPromise = new Promise<void>((resolve, _) => {
            const tween = this.tweens.add({
                targets: this.robot,
                x: newRobotX,
                y: newRobotY,
                duration: this.TWEEN_DURATION,
                ease: 'Linear',
                onComplete: () => {
                    resolve();
                }
            });
            tween.play();
        });

        await tweenPromise;
    }

    async turnRobot(deltaAngle: integer) {
        const tweenPromise = new Promise<void>((resolve, _) => {
            const tween = this.tweens.add({
                targets: this.robot,
                angle: this.robot.angle + deltaAngle,
                duration: this.TWEEN_DURATION,
                ease: 'Linear',
                onComplete: () => {
                    resolve();
                }
            });
            tween.play();
        });

        await tweenPromise;
    }

    async moveRobotForward(steps: integer = 1) {
        console.log('moveRobotForward', steps, 'angle = ', this.robot.angle)
        for (let i = 0; i < steps; i++) {
            await this.moveRobotAngle(this.robot.angle);
        }
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

    clear() {
        console.error('Clear not implemented yet');
    }
    getScene() {
        return this.game.scene.scenes[0] as CleaningScene;
    }

    async moveDirection(direction: string) {

        if (direction == "LEFT") {
            await this.getScene().moveRobotAngle(180);
        } else if (direction == "RIGHT") {
            await this.getScene().moveRobotAngle(0);
        } else if (direction == "UP") {
            await this.getScene().moveRobotAngle(270);
        } else if (direction == "DOWN") {
            await this.getScene().moveRobotAngle(90);
        }
        
    }

    async moveForward(steps: integer = 1) {
        await this.getScene().moveRobotForward(steps);
    }

    async turn(angle: integer) {
        await this.getScene().turnRobot(angle);
    }
}

