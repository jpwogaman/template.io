import { Navbar, Nav, Container } from 'react-bootstrap';

export default function TemplateNavbar() {

    return (
        <Navbar bg="dark" variant="dark" sticky="top" id="TemplateNavbar">
            <Container fluid>
                <Nav className="container justify-content-evenly">
                    <Nav.Item id="vepCount">0 VEP Instances</Nav.Item>
                    <Nav.Item id="smpCount">0 Samplers</Nav.Item>
                    <Nav.Item id="trkCount">0 Tracks</Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
};