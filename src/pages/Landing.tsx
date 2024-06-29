import ChassNavbar from "../components/Navbar";
import { getCtrl } from "../lichess/ctrl";
import useQuery from "../utils/Query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

function Landing() {
  let query = useQuery();
  const ctrl = getCtrl();
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
          window.history.pushState({}, "", process.env.PUBLIC_URL || "/");
        }
      }
    };
    fetchAuthDetails();
  }, [ctrl, navigate, query]);

  const onLogin = async () => {
    setIsLoading(true);
    await ctrl.auth.login();
    setIsLoading(false);
  };

  return (
    <>
      <main className="container-fluid">
        <ChassNavbar />
        <div className="px-4 py-5 my-5 text-center">
          <h1 className="display-5 fw-bold">{"Wizzard Chess"}</h1>
          {isLoading ? (
            <Spinner className="mt-5" animation="border" variant="primary" />
          ) : (
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4">
                Log in to Lichess to play with the board.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <button
                  type="button"
                  className="btn btn-primary btn-lg px-4 gap-3"
                  onClick={onLogin}
                >
                  Log in
                </button>
              </div>
              <div className="container mt-5">
                <div className="row">
                  <div className="col-12">
                    <h3>How to Start Up an Automated Chess Board</h3>
                    <ol className="text-start">
                      <li>
                        Create an account with{" "}
                        <a
                          href="https://lichess.org/signup"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Lichess
                        </a>
                        .
                      </li>
                      <li>
                        Enable BLE on Chrome (not needed using a phone):
                        <ol type="a">
                          <li>Launch the Google Chrome browser.</li>
                          <li>
                            Type <code>chrome://flags</code> into the address
                            bar.
                          </li>
                          <li>Hit Enter to access the Flags menu.</li>
                          <li>
                            Once you've entered the Flags menu, search for
                            "Experimental Web Platform features".
                          </li>
                          <li>
                            The flag will have a drop-down menu that will be set
                            to Default. Click to set the value of the drop-down
                            menu to Enabled.
                          </li>
                        </ol>
                      </li>
                      <li>Restart your browser.</li>
                      <li>Connect the chess clock to a USB power source.</li>
                      <li>Connect the board power supply.</li>
                      <li>Log In and connect the bluetooth device.</li>
                      <li>Start a match.</li>
                      <li>
                        If the clock shows any errors (E001/2) disconnect it,
                        the board and connect both again.
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Landing;
