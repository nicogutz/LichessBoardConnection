import { useState, useEffect } from "react";
import { BluetoothButton } from "../components/BluetoothButton";
import { CreateGame } from "../components/CreateGame";
import { getCtrl } from "../lichess/ctrl";
import ChassNavbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { Game } from "../components/Game";

function Play() {
    const ctrl = getCtrl();
    const navigate = useNavigate();
    const [gameId, setGameId] = useState('');
    const [characteristic, setCharacteristic] = useState(null);
    const [btConnected, setBTConnected] = useState(false);

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
        const game = ctrl.games.games.find(game => game.source === 'ai');
        if (game) {
            setGameId(game.gameId);
            if (!ctrl.game) {
                ctrl.openGame(game.gameId);
            }
        }
    }, [ctrl, ctrl.games.games]);

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
                        {!gameId && btConnected && <CreateGame setGameId={setGameId} />}
                        {gameId && <Game gameId={gameId} btCharacteristic={characteristic} setGameId={setGameId}/>}
                        {!btConnected && <BluetoothButton onCharacteristicReceived={handleBluetoothCharacteristic} setBTConnected={setBTConnected} />}
                    </div>
                </div>
            </main>

        </>
    )
}

export default Play;
