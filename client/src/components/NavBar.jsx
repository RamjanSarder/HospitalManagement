import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div>
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <h3><Link to='/'>Online-Dr-Appointment</Link></h3>
                <div className='d-flex'>
                    <Nav className="me-auto">
                        <Nav.Link><Link to="/home">Home</Link></Nav.Link>
                        <Nav.Link><Link to="/about">About</Link></Nav.Link>
                        <Nav.Link><Link to="/contact">Contact</Link></Nav.Link>
                    </Nav>
                </div>
            </Container>
        </Navbar>
    </div>
  )
}

export default NavBar