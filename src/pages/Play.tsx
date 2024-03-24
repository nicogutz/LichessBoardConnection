import { useState } from "react";
import { BluetoothButton } from "../components/BluetoothButton";
import { CreateGame } from "../components/CreateGame";
import { MakeMove } from "../components/MakeMove";
import { StreamGame } from "../components/StreamGame";
import { getCtrl } from "../lichess/ctrl";
import { Magnet } from "../utils/Magnet";
import { Helmet } from "react-helmet";
import ChassNavbar from "../components/Navbar";

function Play() {
    const ctrl = getCtrl()


    const [gameId, setGameId] = useState('')
    const [isUsersTurn, setIsUsersTurn] = useState(false)
    const [magnet] = useState(new Magnet())
    const title = 'Dashboard';

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <main className="container-fluid">
                <ChassNavbar username={undefined}></ChassNavbar>
                <div className="px-4 py-5 my-5 text-center">
                    <h1 className="display-5 fw-bold">{"Wizzard Chess"}</h1>
                    <div className="col-lg-6 mx-auto">
                        {!gameId && <CreateGame setGameId={setGameId} />}
                        {gameId && <StreamGame setIsUsersTurn={setIsUsersTurn} gameId={gameId} magnet={magnet} />}
                        {gameId && <MakeMove gameId={gameId} isUsersTurn={isUsersTurn} />}
                        <BluetoothButton magnet={magnet} />
                    </div>
                </div>
            </main>

        </>
    )
}

export default Play;
