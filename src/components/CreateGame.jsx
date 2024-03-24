import React, { useState } from 'react'
import { getCtrl } from "../lichess/ctrl";
import { useNavigate } from "react-router-dom";

export const CreateGame = ({ setGameId }) => {
  const ctrl = getCtrl();
  const navigate = useNavigate();

  const [gameConfig, setGameConfig] = useState({
    level: 1,
    clock_limit: 300,
    clock_increment: 0,
    color: 'black',
  })

  const handleChange = (e) => {
    setGameConfig({
      ...gameConfig,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    ctrl.playAi(gameConfig.clock_increment.level, gameConfig.clock_limit, gameConfig.clock_increment, gameConfig.color);
    navigate("/LichessBoardConnection");
  }



  return (
    <form onSubmit={handleSubmit}>
      <h2>Create a Game</h2>
      <div>
        <label>Level:</label>
        <input
          type="number"
          name="level"
          value={gameConfig.level}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Clock Limit (in seconds):</label>
        <input
          type="number"
          name="clock_limit"
          value={gameConfig.clock_limit}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Clock Increment (in seconds):</label>
        <input
          type="number"
          name="clock_increment"
          value={gameConfig.clock_increment}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Color:</label>
        <select name="color" value={gameConfig.color} onChange={handleChange}>
          <option value="black">Black</option>
          <option value="white">White</option>
          <option value="random">Random</option>
        </select>
      </div>
      <button type="submit">Create Game</button>
    </form>
  )
}
