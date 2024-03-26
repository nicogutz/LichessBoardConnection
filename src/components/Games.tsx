import React, { useEffect, useRef, useState } from 'react';
import { Chessground } from 'chessground';
import { Game, GameWidgetProps } from '../interfaces';
import OngoingGames from '../lichess/ongoingGames';
import { getCtrl } from '../lichess/ctrl';
import ListGroup from 'react-bootstrap/ListGroup';
import { Key } from 'chessground/types';
import { Magnet, getMagnet } from '../utils/Magnet';

function GameWidget(game: Game, setGameId: React.Dispatch<React.SetStateAction<string>>) {
  return (
    <a
      className={`game-widget text-decoration-none game-widget--${game.id}`}
      href={`https://lichess.org/${game.gameId}`}
      target="_blank"
      onClick={(ev) => {
        setGameId(game.id)
      }}
    >
      <span className="game-widget__opponent">
        <span className="game-widget__opponent__name">
          {game.opponent.username || 'Anon'}
        </span>
        {game.opponent.rating && (
          <span className="game-widget__opponent__rating">
            {game.opponent.rating}
          </span>
        )}
      </span>
    </a>
  );
};

function GameList(ongoing: OngoingGames, bluetoothCharacteristic: any) {
  const [gameOpen, setGameOpen] = useState(false);
  const [gameID, setGameId] = useState("");
  const [move, setMove] = useState<[Key, Key]>();
  const ctrl = getCtrl();
  const magnet: Magnet = getMagnet();
  useEffect(() => {
    if (gameID.length) {
      if (!gameOpen) {
        console.log("Setting ID to: " + gameID);
        ctrl.openGame(gameID)
        setGameOpen(true)
      }
      const interval = setInterval(() => {
        if (ctrl.game?.lastMove !== move) {
          setMove(ctrl.game?.lastMove);

          console.log("Move changed to: " + `${ctrl.game?.lastMove![0]}${ctrl.game?.lastMove![1]}`);
          magnet.makeMove(`${ctrl.game?.lastMove![0]}${ctrl.game?.lastMove![1]}`);
          magnet.goHome();
          console.log("Magnet: " + magnet.instructions)
          console.log("Time: " + ctrl.game?.timeOf(ctrl.game.pov).toString(16) + ", " + ctrl.game?.timeOf(ctrl.game.pov == "black" ? "white" : "black").toString(16));
          if (bluetoothCharacteristic) {
            let encoder = new TextEncoder()
            console.log("Magnet Bluetooth" + bluetoothCharacteristic)
            bluetoothCharacteristic.writeValue(encoder.encode(magnet.instructions.toString()))
          }
          magnet.resetInstructions()
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [ctrl.game, ctrl, ctrl.game?.lastMove, move, gameID])

  if (ongoing.games.length) {
    return (
      <ListGroup>
        {ongoing.games.map(item => (
          <ListGroup.Item key={item.id} className="modal-bg">{GameWidget(item, setGameId)}</ListGroup.Item>
        ))}
      </ListGroup>

    );
  } else {
    return <> <p>No ongoing games at the moment</p></>;
  }
}
export default GameList;
