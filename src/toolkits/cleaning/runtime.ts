import * as Phaser from "phaser";

class CleaningScene extends Phaser.Scene {
    TILE_WIDTH = 48;
    TILE_HEIGHT = 48;
    TWEEN_DURATION = 300;

    robot: Phaser.GameObjects.Image;
    angle: integer;
    map: string[][];
    floorLayer: Phaser.GameObjects.Layer;
    dirtLayer: Phaser.GameObjects.Layer;
    robotLayer: Phaser.GameObjects.Layer;
    goalPosition?: {x: integer, y: integer} = null;

    constructor(data: { map: string }) {
        super({ key: 'CleaningScene' });
    }
    
    init(data: { map: Array<string> }) {
        console.log('scene init');
        // TODO: validate map input
        const map = data['map'];
        if (map) {
            this.map = map
                    .map((line, _) => line.split(''))
            console.log(this.map);
        }
    }

    preload() {
        this.load.image('tile', 'assets/tile.png');
        this.load.image('robot', 'assets/robot.png');
        this.load.image('dirt01', 'assets/dirt01.png');
        this.load.image('dirt02', 'assets/dirt02.png');
        this.load.image('dirt03', 'assets/dirt03.png');
        this.load.image('cone', 'assets/cone.png');
        this.load.image('goal', 'assets/goal.png');
    }

    create() {
        this.floorLayer = this.add.layer();
        this.dirtLayer = this.add.layer();
        this.robotLayer = this.add.layer();

        for (let tx = 0; tx < 10; tx++) {
            for (let ty = 0; ty < 8; ty++) {

                const cell = this.map[ty][tx];
                const x = tx * this.TILE_WIDTH;
                const y = ty * this.TILE_HEIGHT;

                const tile = this.add.image(x, y, 'tile').setOrigin(0, 0);
                this.floorLayer.add(tile);

                if (cell == 'r') {
                    this.robot = this.add.image(x + this.TILE_WIDTH / 2, y + this.TILE_HEIGHT / 2, 'robot')
                    this.robotLayer.add(this.robot);
                } else if (cell == 'd') {
                    const dirt = this.add.image(x, y, 'dirt01').setOrigin(0, 0);
                    this.dirtLayer.add(dirt);
                } else if (cell == 'x') {
                    const cone = this.add.image(x, y, 'cone').setOrigin(0, 0);
                    this.dirtLayer.add(cone);
                } else if (cell == '!') {
                    const goal = this.add.image(x, y, 'goal').setOrigin(0, 0);
                    this.dirtLayer.add(goal);
                    this.goalPosition = {x: tx, y: ty};
                }
            }
        }
    }

    getHeadingDirection(deltaAngle: integer = 0) {
        const radians = Phaser.Math.DegToRad(this.robot.angle + deltaAngle);
        const direction = { x: Math.cos(radians), y: Math.sin(radians) };
        return direction;
    }

    async playWrongMoveAnimation() {
        await new Promise<void>((resolve, _) => {
            const tween = this.tweens.add({
                targets: this.robot,
                scale: 1.5,
                duration: this.TWEEN_DURATION / 2,
                ease: Phaser.Math.Easing.Bounce.Out,
                onComplete: () => {
                    resolve();
                }
            });
            tween.play();
        });
        await new Promise<void>((resolve, _) => {
            const tween = this.tweens.add({
                targets: this.robot,
                scale: 1,
                duration: this.TWEEN_DURATION / 2,
                ease: Phaser.Math.Easing.Bounce.In,
                onComplete: () => {
                    resolve();
                }
            });
            tween.play();
        });
    }

    async moveRobotAngle(angle: integer) {
        this.robot.angle = angle;
        const direction = this.getHeadingDirection();

        const newRobotX = this.robot.x + direction.x * this.TILE_WIDTH;
        const newRobotY = this.robot.y + direction.y * this.TILE_HEIGHT;
        const tx = Math.floor(newRobotX / this.TILE_WIDTH);
        const ty = Math.floor(newRobotY / this.TILE_HEIGHT);

        if (tx < 0 || tx >= 10 || ty < 0 || ty >= 8) {
            await this.playWrongMoveAnimation();
            return;
        }
        if (this.map[ty][tx] == 'x') {
            await this.playWrongMoveAnimation();
            return;
        }

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

        console.log('cell = ', this.map[ty][tx]);
        if (this.map[ty][tx] == 'd') {
            this.map[ty][tx] = '.';
            this.dirtLayer.getChildren().forEach((dirt: Phaser.GameObjects.Image) => {
                if (dirt.x == tx * this.TILE_WIDTH && dirt.y == ty * this.TILE_HEIGHT) {
                    dirt.destroy();
                }
            });
        }
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

    isFloorClean() {
        return this.map.join('').indexOf('d') == -1;
    }

    hasGoalPosition() {
        return this.goalPosition != null;
    }
    
    hasRobotReachedGoalPosition() {
        if (!this.goalPosition) {
            return false;
        }
        const tx = Math.floor(this.robot.x / this.TILE_WIDTH);
        const ty = Math.floor(this.robot.y / this.TILE_HEIGHT);
        return tx == this.goalPosition.x && ty == this.goalPosition.y;
    }

    hasObstacleAtDirection(directionString: string) {
        let deltaAngle = 0;
        if (directionString == 'LEFT') {
            deltaAngle -= 90;
        } else if (directionString == 'RIGHT') {
            deltaAngle += 90;
        }
        const direction = this.getHeadingDirection(deltaAngle);

        const tx = Math.floor((this.robot.x / this.TILE_WIDTH) + direction.x);
        const ty = Math.floor((this.robot.y / this.TILE_HEIGHT) + direction.y);

        if (tx < 0 || tx >= 10 || ty < 0 || ty >= 8) {
            return true;
        }

        return this.map[ty][tx] == 'x';
    }
}

export class CleaningRobotStageManager implements StageManager {
    game: Phaser.Game;

    constructor(elem: HTMLElement, map?: Array<string>) {
        this.game = new Phaser.Game({
            type: Phaser.AUTO,
            parent: elem,
            width: 480,
            height: 360,
        });
        if (!map) {
            map = [
                '.........',
                '.rd......',
                '...d.....',
                '.........',
                '.........',
                '.........',
                '.........',
                '.........',
            ];
        }
        this.game.scene.add('CleaningScene', CleaningScene, true, {map: map});
    }

    clear() {
        this.game.scene.stop('CleaningScene');
        this.game.scene.start('CleaningScene');
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

    hasRobotReachedGoalPosition() {
        return this.getScene().hasRobotReachedGoalPosition();
    }

    hasObstacleAtDirection(direction: string) {
        return this.getScene().hasObstacleAtDirection(direction);
    }

    outcome(): StageOutcome {
        if (!this.getScene().isFloorClean()) {
            return {
                successful: false,
                message: 'Ainda há sujeira no chão!',
            }
        } else if (this.getScene().hasGoalPosition() && !this.getScene().hasRobotReachedGoalPosition()) {
            return {
                successful: false,
                message: 'O robô não está no destino!',
            }
        } else {
            return {
                successful: true,
                message: 'Parabéns, você concluiu o desafio!',
            }           
        }
    }
}

