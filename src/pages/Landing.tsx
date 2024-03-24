import { title } from "process";
import { Helmet } from "react-helmet";
import ChassNavbar from "../components/Navbar";
import { getCtrl } from "../lichess/ctrl";
import useQuery from "../utils/Query";
import { redirect } from "react-router-dom";

function Landing() {
    let query = useQuery();
    const ctrl = getCtrl()
    ctrl.auth.init();
    console.log(ctrl.auth.me)
    if(query.get("code")?.includes("liu_")){
        window.history.pushState({}, '', process.env.PUBLIC_URL || '/');
        redirect('/play');
    }
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
                        <p className="lead mb-4">
                            Log in to Lichess to play with the board.
                        </p>
                        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                            <button type="button"
                                className="btn btn-primary btn-lg px-4 gap-3"
                                onClick={() => ctrl.auth.login()}>
                                Log in
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );

}


export default Landing;
