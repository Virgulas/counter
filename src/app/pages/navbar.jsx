'use client';
import { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import RegistrationPage from './register';
import DayNav from './dayNav';
import Store from './store';
import Week from './week';
import '../styles/navbar.css';

function AppNavbar() {
  const buttons = {
    DAY: 'Hoje',
    STORE: 'Loja',
    WEEK: 'Semana',
    PROFESSIONAL: 'Profissionais',
  };
  const [tab, setTab] = useState(buttons.DAY); // Default active tab

  return (
    <>
      <div className="nav-container">
        <Navbar className="nav-b" bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto nav-items">
                {' '}
                {/* Center items */}
                {Object.values(buttons).map((button) => (
                  <Nav.Link
                    key={button}
                    href="#"
                    active={tab === button}
                    onClick={() => setTab(button)}
                    className="text-uppercase nav-item" // Optional: makes the text uppercase
                  >
                    {button}
                  </Nav.Link>
                ))}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
      {tab === buttons.PROFESSIONAL ? <RegistrationPage /> : ''}
      {tab === buttons.DAY ? <DayNav /> : ''}
      {tab === buttons.STORE ? <Store /> : ''}
      {tab === buttons.WEEK ? <Week /> : ''}
    </>
  );
}

export default AppNavbar;
