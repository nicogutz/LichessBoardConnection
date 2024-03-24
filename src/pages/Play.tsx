import { useState } from "react";
import { BluetoothButton } from "../components/BluetoothButton";
import { CreateGame } from "../components/CreateGame";
import { MakeMove } from "../components/MakeMove";
import { StreamGame } from "../components/StreamGame";
import { getCtrl } from "../lichess/ctrl";
import { Magnet } from "../utils/Magnet";

function Play() {
    const ctrl = getCtrl()


    const [gameId, setGameId] = useState('')
    const [isUsersTurn, setIsUsersTurn] = useState(false)
    const [magnet] = useState(new Magnet())
    const title = 'Dashboard';

    return (
        <>

            {!gameId && <CreateGame setGameId={setGameId} />}
            {gameId && <StreamGame setIsUsersTurn={setIsUsersTurn} gameId={gameId} magnet={magnet} />}
            {gameId && <MakeMove gameId={gameId} isUsersTurn={isUsersTurn} />}
            <BluetoothButton magnet={magnet} />
        </>
    )
}

export default Play;
