import { useState, useEffect } from "react";
import { BluetoothButton } from "../components/BluetoothButton";
import { CreateGame } from "../components/CreateGame";
import { getCtrl } from "../lichess/ctrl";
import ChassNavbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import GameList from "../components/Games";
import OngoingGames from "../lichess/ongoingGames";

function Play() {
    const ctrl = getCtrl();
    const navigate = useNavigate();
    const [gameId, setGameId] = useState('');
    const [games, setGames] = useState<OngoingGames>(ctrl.games);
    const [newGame, setNewGame] = useState(false);
    const [characteristic, setCharacteristic] = useState(null);
    const [btConnected, setBTConnected] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!ctrl.auth.me) {
                clearTimeout(timeout)
                navigate("/LichessBoardConnection");
            }
        }, 1);
        return () => clearTimeout(timeout);
    }, [ctrl.auth.me, navigate]);

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
                <ChassNavbar />
                <div className="px-4 py-5 my-5 text-center">
                    <h1 className="display-5 fw-bold">{"Wizzard Chess"}</h1>
                    <div className="col-lg-6 mx-auto">
                        {!gameId &&btConnected && <CreateGame setGameId={setGameId} setNewGame={setNewGame} />}
                        <div> {GameList(games, characteristic)}</div>
                        {!btConnected && <BluetoothButton onCharacteristicReceived={handleBluetoothCharacteristic} setBTConnected={setBTConnected} />}
                    </div>
                </div>
            </main>

        </>
    )
}

export default Play;
