import React, { useEffect, useRef, useState } from 'react';
import { Chessground } from 'chessground';
import { Game, GameWidgetProps } from '../interfaces';
import OngoingGames from '../lichess/ongoingGames';
import { getCtrl } from '../lichess/ctrl';
import ListGroup from 'react-bootstrap/ListGroup';
import { Key } from 'chessground/types';

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

function GameList(ongoing: OngoingGames) {
  const [gameOpen, setGameOpen] = useState(false);
  const [gameID, setGameId] = useState("");
  const [move, setMove] = useState<[Key, Key]>();
  const ctrl = getCtrl();

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
          console.log("Move changed to: " + ctrl.game?.lastMove);
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
