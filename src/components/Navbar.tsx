import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
type NavbarProps = {
    username?: string
}

function ChassNavbar(props: NavbarProps) {
    return (
        <Navbar className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Wizzard Chess</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    {props.username ? <>Signed in as: <a href="#login">{props.username}</a> </> :
                        <><Button>Login</Button></>}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default ChassNavbar;