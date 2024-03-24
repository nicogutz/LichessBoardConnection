import React from 'react';
import { getCtrl } from './lichess/ctrl';
import './App.css';
import { useState } from 'react'
import { Magnet } from './utils/Magnet';
import { BluetoothButton } from './components/BluetoothButton';
import { CreateGame } from './components/CreateGame';
import { MakeMove } from './components/MakeMove';
import { StreamGame } from './components/StreamGame';

function App () {
  const [gameId, setGameId] = useState('')
  const [isUsersTurn, setIsUsersTurn] = useState(false)
  const [magnet] = useState(new Magnet())

  return (
    <>
      {!gameId && <CreateGame setGameId={setGameId} />}
      {gameId && <StreamGame setIsUsersTurn={setIsUsersTurn} gameId={gameId} magnet={magnet} />}
      {gameId && <MakeMove gameId={gameId} isUsersTurn={isUsersTurn} />}
      <BluetoothButton magnet={magnet} />
    </>
  )
}

export default App;
