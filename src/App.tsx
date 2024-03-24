import { useState } from 'react'
import { BluetoothButton } from './BluetoothButton'
import { Magnet } from './utils/Magnet';

function App() {
  const [gameId, setGameId] = useState('')
  const [isUsersTurn, setIsUsersTurn] = useState(false)
  const [magnet] = useState(new Magnet())

  return (
    <>
      {/* {!gameId && <CreateGame setGameId={setGameId} />}
      {gameId && <StreamGame setIsUsersTurn={setIsUsersTurn} gameId={gameId} magnet={magnet} />} */}
      {/* {gameId && <MakeMove gameId={gameId} isUsersTurn={isUsersTurn} />} */}
      {/* <BluetoothButton magnet={magnet} /> */}
    </>
  )
}

export default App;
