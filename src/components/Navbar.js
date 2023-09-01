import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/" style={{color:'black',fontFamily:'Cursive',fontWeight:'bolder'}}>RecipeRadar</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="/" className="text-white">Home</Nav.Link>
            <Nav.Link href="/favorites" className="text-white">Favorites</Nav.Link>
            <Nav.Link href="/about" className="text-white">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
