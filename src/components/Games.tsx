import React, { useEffect, useRef } from 'react';
import { Chessground } from 'chessground';
import { Game, GameWidgetProps } from '../interfaces';
import OngoingGames from '../lichess/ongoingGames';

function GameWidget(game: Game) {
  return (
    <a
      className={`game-widget text-decoration-none game-widget--${game.id}`}
      href={`https://lichess.org/${game.gameId}`} target="_blank"
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

function renderGames(ongoing: OngoingGames) {
  if (ongoing.games.length) {
    return ongoing.games.map(GameWidget);
  } else {
    return <> <p>No ongoing games at the moment</p></>;
  }
}
export default renderGames;
