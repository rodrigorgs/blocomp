import * as Phaser from "phaser";
import { CleaningModel, Position } from "./model";

class CleaningScene extends Phaser.Scene {
    TILE_WIDTH = 48;
    TILE_HEIGHT = 48;
    TWEEN_DURATION = 200;
    robot: Phaser.GameObjects.Image;
    floorLayer: Phaser.GameObjects.Layer;
    dirtLayer: Phaser.GameObjects.Layer;
    robotLayer: Phaser.GameObjects.Layer;
    
    model: CleaningModel;

    constructor() {
        super({ key: 'CleaningScene' });
    }
    
    init(data: { map: Array<string> }) {
        this.model = new CleaningModel(data);
        this.model.addChangeListener((x, y, oldValue, newValue) => {
            if (oldValue == 'd' && newValue == '.') {
                this.dirtLayer.getChildren().forEach((dirt: Phaser.GameObjects.Image) => {
                    if (dirt.x == x * this.TILE_WIDTH && dirt.y == y * this.TILE_HEIGHT) {
                        dirt.destroy();
                    }
                });
            }
        });
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

                const cell = this.model.map[ty][tx];
                const x = tx * this.TILE_WIDTH;
                const y = ty * this.TILE_HEIGHT;

                const tile = this.add.image(x, y, 'tile').setOrigin(0, 0);
                this.floorLayer.add(tile);

                
                if (cell == 'd') {
                    const dirt = this.add.image(x, y, 'dirt01').setOrigin(0, 0);
                    this.dirtLayer.add(dirt);
                } else if (cell == 'x') {
                    const cone = this.add.image(x, y, 'cone').setOrigin(0, 0);
                    this.dirtLayer.add(cone);
                }
                
            }
        }

        this.robot = this.add.image(this.model.robot.position.x * this.TILE_WIDTH + this.TILE_WIDTH / 2, this.model.robot.position.y * this.TILE_HEIGHT + this.TILE_HEIGHT / 2, 'robot')
        this.robotLayer.add(this.robot);

        if (this.model.goalPosition) {
            const pos = this.convertTileToScreenPosition(this.model.goalPosition);
            const goal = this.add.image(pos.x, pos.y, 'goal').setOrigin(0, 0);
            this.dirtLayer.add(goal);
        }
    }

    private convertTileToScreenPosition(pos: Position) {
        return {
            x: pos.x * this.TILE_WIDTH,
            y: pos.y * this.TILE_HEIGHT,
        }
    }

    getHeadingDirection(deltaAngle: integer = 0) {
        return this.model.getHeadingDirection(deltaAngle);
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

        if (!this.model.moveRobotAngle(angle)) {
            await this.playWrongMoveAnimation();
            return;
        }

        const newRobotX = this.model.robot.position.x * this.TILE_WIDTH + this.TILE_WIDTH / 2;
        const newRobotY = this.model.robot.position.y * this.TILE_HEIGHT + this.TILE_HEIGHT / 2;

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
        this.model.turnRobot(deltaAngle);
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
        return this.model.isFloorClean();
    }

    hasGoalPosition() {
        return this.model.hasGoalPosition();
    }
    
    hasRobotReachedGoalPosition() {
        if (!this.model.goalPosition) {
            return false;
        }
        const tx = Math.floor(this.robot.x / this.TILE_WIDTH);
        const ty = Math.floor(this.robot.y / this.TILE_HEIGHT);
        return tx == this.model.goalPosition.x && ty == this.model.goalPosition.y;
    }

    hasObstacleAtDirection(directionString: string) {
        return this.model.hasObstacleAtDirection(directionString);
    }
}

export class CleaningRobotStageManager implements StageManager {
    game: Phaser.Game;

    constructor(elem: HTMLElement, map?: Array<string>) {
        elem.innerHTML = '';
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
        return this.getScene().model.outcome();
    }
}

