import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getCtrl } from "../lichess/ctrl";
import { Button, Form } from "react-bootstrap";
import { Key } from "chessground/types";
import { Magnet, getMagnet } from "../utils/Magnet";
import { Chess } from "chess.js";

type GameProps = {
    gameId: string,
		setGameId: Dispatch<SetStateAction<string>>,
		btCharacteristic: any
}

export const Game = ({ gameId, setGameId, btCharacteristic }: GameProps) => {
    const ctrl = getCtrl();
		const magnet: Magnet = getMagnet();
		const [lastMove, setLastMove] = useState<[Key, Key]>();
		const [isOver, setIsOver] = useState(false);
		const [winner, setWinner] = useState(null);
		const [winReason, setWinReason] = useState(null);

		useEffect(() => {
			const interval = setInterval(() => {
				if (ctrl.game?.lastMove !== lastMove) {
					setLastMove(ctrl.game?.lastMove);

					console.log(`Move changed to ${ctrl.game?.lastMove![0]}${ctrl.game?.lastMove![1]}`);

					try {
						magnet.makeMove(`${ctrl.game?.lastMove![0]}${ctrl.game?.lastMove![1]}`);
					} catch (err) {
						const chess = new Chess();
						ctrl.game?.game.state.moves.split(' ').map((move: string) => chess.move(move))
						magnet.reinitFen(chess.fen());
					}

					magnet.goHome();
					const localTime = ctrl.game?.timeOf(ctrl.game.pov);
					const remoteTime = ctrl.game?.timeOf(ctrl.game.pov === "black" ? "white" : "black");
					const player = ctrl.game?.chess.turn === ctrl.game?.pov ? 0 : 1;
					const timeCommand = `TM${player} ${localTime.toString(16).padStart(8, '0')} ${remoteTime.toString(16).padStart(8, '0')}`

					console.log(timeCommand);
					console.log(magnet.instructions.toString());

					if (btCharacteristic) {
						let encoder = new TextEncoder();
						btCharacteristic.writeValue(encoder.encode(`${timeCommand},${magnet.instructions.toString()}`));
					}

					magnet.resetInstructions();
				}
			}, 100);

			return () => clearInterval(interval);
		}, [btCharacteristic, ctrl.game, ctrl.game?.game.state.moves, ctrl.game?.lastMove, lastMove, magnet]);

		useEffect(() => {
			const interval = setInterval(() => {
				if (
						ctrl.game?.game.type === 'gameFull' &&
						(
							ctrl.game?.game.state.status === 'mate' ||
							ctrl.game?.game.state.status === 'resign' ||
							ctrl.game?.game.state.status === 'aborted' ||
							ctrl.game?.game.state.status === 'outoftime')) {
					setIsOver(true);
					setWinner(ctrl.game?.game.state.winner);
					setWinReason(ctrl.game?.game.state.status);
				}
			}, 1000);

			return () => clearInterval(interval);
		});

    const onResign = async () => {
			await ctrl.game?.resign();
    }

		const onCreateNewGame = () => {
			ctrl.games.empty();
			setGameId('');
		}

    return (
      <>
        {!isOver ? (
          <h5>Ongoing game ID: {gameId}</h5>
        ) : (
          <h5>
            Game over,{" "}
            {winReason !== "aborted"
              ? `${winner} is the winner (${winReason})`
              : "aborted"}
          </h5>
        )}
        <Form action={`https://lichess.org/${gameId}`} target="_blank">
          <div className="d-flex justify-content-center">
            <Button type="submit" variant="primary" className="me-3">
              Open Game on Lichess
            </Button>
            <Button
              onClick={onResign}
              variant="danger"
              className="me-3"
              disabled={isOver}
            >
              Resign
            </Button>
            {isOver && (
              <Button onClick={onCreateNewGame}>Create new game</Button>
            )}
          </div>
        </Form>
      </>
    );
};
