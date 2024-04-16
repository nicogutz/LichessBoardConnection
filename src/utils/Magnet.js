const { Chess } = require("chess.js");

const DIRECTIONS = {
  N: 'MVNO',
  S: 'MVSO',
  W: 'MVWE',
  E: 'MVEA',
  NW: 'MVNW',
  NE: 'MVNE',
  SW: 'MVSW',
  SE: 'MVSE',
}
export class Magnet {
  constructor() {
    this._position = {
      x: 0,
      y: 0,
    };
    this._instructions = ["MG0"];
    this._isOn = false;
    this._chess = new Chess();
  }

  get position() {
    return this._position;
  }

  set position(pos) {
    this._position.x = pos.x;
    this._position.y = pos.y;
  }

  get instructions() {
    return this._instructions; // TODO: simplify instructions
  }

  resetInstructions() {
    this._instructions = [];
  }

  makeMove(notation) {
    const fromRaw = `${notation[0]}${notation[1]}`;
    const toRaw = `${notation[2]}${notation[3]}`;
    const from = Magnet.convertChessNotationToXY(fromRaw);
    const to = Magnet.convertChessNotationToXY(toRaw);
    const piece = this._chess.get(fromRaw);
    const move = this._chess.move({ from: fromRaw, to: toRaw });
    if (move.san === "O-O" || move.san === "O-O-O") {
      return this.castle(move.san);
    }
    if (move.captured) {
      this.removePiece(to);
    }

    if (piece.type === "n") {
      return this.moveKnight(from, to);
    }

    this.moveTo(from);
    this.turnOn();

    const dx = to.x - from.x;
    const dy = to.y - from.y;

    if (Math.abs(dx) === Math.abs(dy)) {
      const direction =
        dx > 0 && dy > 0
          ? DIRECTIONS.NE
          : dx > 0 && dy < 0
            ? DIRECTIONS.SE
            : dx < 0 && dy > 0
              ? DIRECTIONS.NW
              : DIRECTIONS.SW;
      this._instructions.push(`${direction}${Math.abs(dx) * 2}`);
    } else {
      if (dx !== 0) {
        const direction = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W;
        this._instructions.push(`${direction}${Math.abs(dx) * 2}`);
      } else {
        const direction = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S;
        this._instructions.push(`${direction}${Math.abs(dy) * 2}`);
      }
    }

    this.turnOff();
    this._position.x = to.x;
    this._position.y = to.y;
  }

  moveKnight(from, to) {
    this.moveTo(from);
    if (from.x === 6 && from.y === 7) {
      this._instructions.push(`${DIRECTIONS.N}1`);
    }
    this.turnOn();

    let dx = to.x - from.x;
    let dy = to.y - from.y;

    const offsetDirection =
      dx > 0 && dy > 0
        ? DIRECTIONS.NE
        : dx > 0 && dy < 0
          ? DIRECTIONS.SE
          : dx < 0 && dy > 0
            ? DIRECTIONS.NW
            : DIRECTIONS.SW;

    let offsetCommand = "";

    if (offsetDirection === DIRECTIONS.NE) {
      offsetCommand = `${DIRECTIONS.E}1,${DIRECTIONS.N}1`;
    } else if (offsetDirection === DIRECTIONS.SE) {
      offsetCommand = `${DIRECTIONS.E}1,${DIRECTIONS.S}1`;
    } else if (offsetDirection === DIRECTIONS.NW) {
      offsetCommand = `${DIRECTIONS.W}1,${DIRECTIONS.N}1`;
    } else {
      offsetCommand = `${DIRECTIONS.W}1,${DIRECTIONS.S}1`;
    }
    this._instructions.push(`${offsetCommand}`);

    dx = dx > 0 ? dx - 0.5 : dx + 0.5;
    dy = dy > 0 ? dy - 0.5 : dy + 0.5;

    const directionX = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W;
    const directionY = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S;

    if (Math.abs(dx) < 1) {
      this._instructions.push(`${directionY}2`);
    } else {
      this._instructions.push(`${directionX}2`);
    }

    if (offsetDirection === DIRECTIONS.NE) {
      offsetCommand = `${DIRECTIONS.N}1,${DIRECTIONS.E}1`;
    } else if (offsetDirection === DIRECTIONS.SE) {
      offsetCommand = `${DIRECTIONS.S}1,${DIRECTIONS.E}1`;
    } else if (offsetDirection === DIRECTIONS.NW) {
      offsetCommand = `${DIRECTIONS.N}1,${DIRECTIONS.W}1`;
    } else {
      offsetCommand = `${DIRECTIONS.S}1,${DIRECTIONS.W}1`;
    }

    this._instructions.push(`${offsetCommand}`);

    this.turnOff();

    this._position.x = to.x;
    this._position.y = to.y;
  }

  castle(notation) {
    const color = this._chess.turn();
    const whiteRookPos = notation === "O-O" ? { x: 7, y: 0 } : { x: 0, y: 0 };
    const blackRookPos = notation === "O-O" ? { x: 7, y: 7 } : { x: 0, y: 7 };
    if (color === "b") {
      this.moveTo(whiteRookPos);
      this.turnOn();
      if (notation === "O-O") {
        // move rook
        this._instructions.push(
          `${DIRECTIONS.W}4`
        );
        // move to king
        this.turnOff();
        this._instructions.push(`${DIRECTIONS.W}2`);
        // move king
        this.turnOn();
        this._instructions.push(
          `${DIRECTIONS.N}1,${DIRECTIONS.E}4,${DIRECTIONS.S}1`
        );
        this.turnOff();
      } else {
        // move rook
        this._instructions.push(
          `${DIRECTIONS.E}6`
        );
        // move to king
        this.turnOff();
        this._instructions.push(`${DIRECTIONS.E}2`);
        // move king
        this.turnOn();
        this._instructions.push(
          `${DIRECTIONS.N}1,${DIRECTIONS.W}4,${DIRECTIONS.S}1`
        );
        this.turnOff();
      }
    } else {
      this.moveTo(blackRookPos);
      this.turnOn();
      if (notation === "O-O") {
        // move rook
        this._instructions.push(
          `${DIRECTIONS.W}4`
        );
        // move to king
        this.turnOff();
        this._instructions.push(`${DIRECTIONS.W}2`);
        // move king
        this.turnOn();
        this._instructions.push(
          `${DIRECTIONS.S}1,${DIRECTIONS.E}4,${DIRECTIONS.N}1`
        );
        this.turnOff();
      } else {
        // move rook
        this._instructions.push(
          `${DIRECTIONS.E}6`
        );
        // move to king
        this.turnOff();
        this._instructions.push(`${DIRECTIONS.E}2`);
        // move king
        this.turnOn();
        this._instructions.push(
          `${DIRECTIONS.S}1,${DIRECTIONS.W}4,${DIRECTIONS.N}1`
        );
        this.turnOff();
      }
    }
  }

  removePiece(position) {
    this.moveTo(position);
    this.turnOn();
    const targetPosition = { x: 7, y: 3.5 };

    let dx = targetPosition.x - position.x;
    let dy = targetPosition.y - position.y;

    let offsetDirection =
      dx > 0 && dy > 0
        ? DIRECTIONS.NE
        : dx > 0 && dy < 0
          ? DIRECTIONS.SE
          : dx < 0 && dy > 0
            ? DIRECTIONS.NW
            : DIRECTIONS.SW;

    if (offsetDirection === DIRECTIONS.NE) {
      offsetDirection = `${DIRECTIONS.E}1,${DIRECTIONS.N}1`;
    } else if (offsetDirection === DIRECTIONS.SE) {
      offsetDirection = `${DIRECTIONS.E}1,${DIRECTIONS.S}1`;
    } else if (offsetDirection === DIRECTIONS.NW) {
      offsetDirection = `${DIRECTIONS.W}1,${DIRECTIONS.N}1`;
    } else {
      offsetDirection = `${DIRECTIONS.W}1,${DIRECTIONS.S}1`;
    }
    this._instructions.push(`${offsetDirection}`);
    // MVEA6,MVNO8,MG1,MVEA1,MVSO1,MG0,MVWE3,MVSO1,MG1,MNNE2,MG0,HM
    dx = dx > 0 ? dx - 0.5 : dx + 0.5;
    dy = dy > 0 ? dy - 0.5 : dy + 0.5;

    const directionX = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W;
    const directionY = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S;
    console.log(dx);
    console.log(dy);

    if (dx) {
      this._instructions.push(`${directionX}${Math.abs(dx) * 2}`);
    }

    if (dy) {
      this._instructions.push(`${directionY}${Math.abs(dy) * 2}`);
    }

    this._position.x = targetPosition.x;
    this._position.y = targetPosition.y;
    this.turnOff();
  }

  moveTo(position) {
    const dx = position.x - this._position.x;
    const dy = position.y - this._position.y;

    const directionX = dx > 0 ? DIRECTIONS.E : DIRECTIONS.W;
    const directionY = dy > 0 ? DIRECTIONS.N : DIRECTIONS.S;
    if (dx) {
      this._instructions.push(`${directionX}${Math.abs(dx) * 2}`);
    }

    if (dy) {
      this._instructions.push(`${directionY}${Math.abs(dy) * 2}`);
    }

    this._position.x = position.x;
    this._position.y = position.y;
  }

  static convertChessNotationToXY(notation) {
    return {
      x: notation.charCodeAt(0) - "a".charCodeAt(0),
      y: notation.charAt(1) - "0" - 1,
    };
  }

  turnOn() {
    this._instructions.push("MG1");
  }

  turnOff() {
    this._instructions.push("MG0");
  }

  goHome() {
    this._instructions.push("HM");
    this._position = {
      x: 0,
      y: 0,
    };
  }
}

let instance = null;
export function getMagnet() {
  if (!instance) instance = new Magnet();
  return instance;
}
