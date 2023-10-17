interface StageOutcome {
    successful: boolean;
    message: string;
}

export interface Position {
    x: integer;
    y: integer;
}

export class Robot {
    angle: integer = 0;
    position: Position = { x: 0, y: 0 };
}

export class CleaningModel {
    robot: Robot = new Robot();

    map: string[][];
    goalPosition?: Position = null;
    changeListeners: Array<(x: integer, y: integer, oldValue: string, newValue: string) => void> = [];

    constructor(data: { map: Array<string> }) {
        const map = data['map'];
        if (map) {
            this.map = map.map((line, _) => line.split(''))
            for (let tx = 0; tx < 10; tx++) {
                for (let ty = 0; ty < 8; ty++) {
                    if (this.map[ty][tx] == 'r') {
                        this.robot.position.x = tx;
                        this.robot.position.y = ty;
                        this.map[ty][tx] = '.';
                    } else if (this.map[ty][tx] == '!') {
                        this.goalPosition = {x: tx, y: ty};
                        this.map[ty][tx] = '.';
                    }
                }
            }
        }
    }

    addChangeListener(listener: (x: integer, y: integer, oldValue: string, newValue: string) => void) {
        this.changeListeners.push(listener);
    }

    removeChangeListener(listener: (x: integer, y: integer, oldValue: string, newValue: string) => void) {
        const index = this.changeListeners.indexOf(listener);
        if (index > -1) {
            this.changeListeners.splice(index, 1);
        }
    }

    changeCell(x: integer, y: integer, newValue: string) {
        const oldValue = this.map[y][x];
        if (newValue != oldValue) {
            this.map[y][x] = newValue;
            for (let listener of this.changeListeners) {
                listener(x, y, oldValue, newValue);
            }
        }
    }

    getHeadingDirection(deltaAngle: integer = 0) {
        const headingAngle = this.robot.angle + deltaAngle;
        const radians = headingAngle * Math.PI / 180;

        const direction = { x: Math.trunc(Math.cos(radians)), y: Math.trunc(Math.sin(radians)) };
        return direction;
    }

    moveRobotAngle(angle: integer): boolean {
        this.robot.angle = angle;
        const direction = this.getHeadingDirection();

        const tx = this.robot.position.x + direction.x;
        const ty = this.robot.position.y + direction.y;

        if (tx < 0 || tx >= 10 || ty < 0 || ty >= 8) {
            return false;
        }
        if (this.map[ty][tx] == 'x') {
            return false;
        }

        this.robot.position.x = tx;
        this.robot.position.y = ty;

        if (this.map[ty][tx] == 'd') {
            this.changeCell(tx, ty, '.');
        }
        return true;
    }

    turnRobot(deltaAngle: integer) {
        this.robot.angle += deltaAngle;
        this.robot.angle %= 360;
    }

    moveRobotForward(steps: integer = 1) {
        for (let i = 0; i < steps; i++) {
            this.moveRobotAngle(this.robot.angle);
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
        return this.robot.position.x == this.goalPosition.x && this.robot.position.y == this.goalPosition.y;
    }

    hasObstacleAtDirection(directionString: string) {
        let deltaAngle = 0;
        if (directionString == 'LEFT') {
            deltaAngle -= 90;
        } else if (directionString == 'RIGHT') {
            deltaAngle += 90;
        }
        const direction = this.getHeadingDirection(deltaAngle);

        const tx = this.robot.position.x + direction.x;
        const ty = this.robot.position.y + direction.y;

        if (tx < 0 || tx >= 10 || ty < 0 || ty >= 8) {
            return true;
        }

        return this.map[ty][tx] == 'x';
    }

    outcome(): StageOutcome {
        if (!this.isFloorClean()) {
            return {
                successful: false,
                message: 'Ainda há sujeira no chão!',
            }
        } else if (this.hasGoalPosition() && !this.hasRobotReachedGoalPosition()) {
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

    // methods added for compatibility with CleaningRobotStageManager
    moveDirection(direction: string) {

        if (direction == "LEFT") {
            this.moveRobotAngle(180);
        } else if (direction == "RIGHT") {
            this.moveRobotAngle(0);
        } else if (direction == "UP") {
            this.moveRobotAngle(270);
        } else if (direction == "DOWN") {
            this.moveRobotAngle(90);
        }
        
    }

    moveForward(steps: integer = 1) {
        this.moveRobotForward(steps);
    }

    turn(angle: integer) {
        this.turnRobot(angle);
    }

}