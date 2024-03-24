import { useState } from 'react'
import { BluetoothButton, characteristic } from './BluetoothButton'

export const MakeMove = ({ gameId, isUsersTurn }) => {
  const [move, setMove] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    setMove(e.target.value)
  }

  const submitMove = () => {
  }

  return (
    <div>
      <input
        type="text"
        value={move}
        onChange={handleInputChange}
        placeholder="e.g., e2e4"
        disabled={!isUsersTurn}
      />
      <button onClick={submitMove} disabled={!isUsersTurn || !move}>
        Submit Move
      </button>
      <p>{error}</p>
    </div>
  )
}
