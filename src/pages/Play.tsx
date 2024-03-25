import { useState, useLayoutEffect, useEffect } from "react";
import { BluetoothButton } from "../components/BluetoothButton";
import { CreateGame } from "../components/CreateGame";
import { MakeMove } from "../components/MakeMove";
import { StreamGame } from "../components/StreamGame";
import { Ctrl, getCtrl } from "../lichess/ctrl";
import { Magnet } from "../utils/Magnet";
import ChassNavbar from "../components/Navbar";
import renderGames from "../components/Games";
import { useNavigate } from "react-router-dom";
import GameList from "../components/Games";
import OngoingGames from "../lichess/ongoingGames";

function Play() {
    const ctrl = getCtrl();
    const navigate = useNavigate();
    const [gameId, setGameId] = useState('');
    const [games, setGames] = useState<OngoingGames>(ctrl.games);
    const [newGame, setNewGame] = useState(false);
    const [isUsersTurn, setIsUsersTurn] = useState(false);
    const [magnet] = useState(new Magnet());
    const [characteristic, setCharacteristic] = useState(null);
    const [bluetoothCharacteristicReceived, setBluetoothCharacteristicReceived] = useState(false);
    const title = 'Dashboard';
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!ctrl.auth.me) {
                clearTimeout(timeout)
                navigate("/LichessBoardConnection");
            }
        }, 1);
        return () => clearTimeout(timeout);
    }, []);
    useEffect(() => {
        const timeout = setTimeout(() => {
        setGames(ctrl.games);
        setNewGame(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, [newGame, ctrl.games])
    const handleBluetoothCharacteristic = (characteristic: any) => {
        console.log("is callback ok" + characteristic);
        setCharacteristic(characteristic);
    };
    return (
        <>
            <main className="container-fluid">
                <ChassNavbar username={undefined}></ChassNavbar>
                <div className="px-4 py-5 my-5 text-center">
                    <h1 className="display-5 fw-bold">{"Wizzard Chess"}</h1>
                    <div className="col-lg-6 mx-auto">
                        {!gameId && <CreateGame setGameId={setGameId} setNewGame={setNewGame} />}
                        {/* {gameId && <StreamGame setIsUsersTurn={setIsUsersTurn} gameId={gameId} magnet={magnet} />} */}
                        {gameId && <MakeMove gameId={gameId} isUsersTurn={isUsersTurn} />}
                        <div> {GameList(games, characteristic)}</div>
                        <BluetoothButton onCharacteristicReceived={handleBluetoothCharacteristic} />
                    </div>
                </div>
            </main>

        </>
    )
}

export default Play;
