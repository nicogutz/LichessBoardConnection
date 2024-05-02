import ChassNavbar from "../components/Navbar";
import { getCtrl } from "../lichess/ctrl";
import useQuery from "../utils/Query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

function Landing() {
    let query = useQuery();
    const ctrl = getCtrl()
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchAuthDetails = async () => {
            await ctrl.auth.init();
            if (ctrl.auth.me) {
                setIsLoading(true);
                await ctrl.openHome();
                navigate("/LichessBoardConnection/play");
                setIsLoading(false);
            } else {
                if (query.get("code")?.includes("liu_")) {
                    window.history.pushState({}, '', process.env.PUBLIC_URL || '/');
                }
            }
        }
        fetchAuthDetails();
    }, [ctrl, navigate, query]);

    const onLogin = async () => {
        setIsLoading(true);
        await ctrl.auth.login();
        setIsLoading(false);
    }

    return (
        <>
            <main className="container-fluid">
                <ChassNavbar />
                <div className="px-4 py-5 my-5 text-center">
                    <h1 className="display-5 fw-bold">{"Wizzard Chess"}</h1>
                    {isLoading ? <Spinner className="mt-5" animation="border" variant="primary" /> : <div className="col-lg-6 mx-auto">
                        <p className="lead mb-4">
                            Log in to Lichess to play with the board.
                        </p>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                            <button type="button"
                                className="btn btn-primary btn-lg px-4 gap-3"
                                onClick={onLogin}>
                                Log in
                            </button>
                        </div>
                    </div>}
                </div>
            </main>
        </>
    );

}


export default Landing;
