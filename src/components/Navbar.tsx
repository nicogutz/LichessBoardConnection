import { Button, Container, Navbar } from 'react-bootstrap';
import { getCtrl } from '../lichess/ctrl';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function ChassNavbar() {
    const ctrl = getCtrl();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onLogout = async () => {
        setIsLoading(true);
        await ctrl.auth.logout();
        navigate("/LichessBoardConnection");
        setIsLoading(false);
    }

    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand>Wizzard Chess</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Button className="me-4">{ctrl.auth.me ? ctrl.auth.me.username : "Login"}</Button>
                    {ctrl.auth.me && <Button disabled={isLoading} onClick={!isLoading ? onLogout : undefined}>Logout</Button>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default ChassNavbar;
