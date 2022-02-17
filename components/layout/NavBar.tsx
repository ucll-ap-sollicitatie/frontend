import type { NextPage } from "next";

import Image from "next/image";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar: NextPage = () => {
  return (
    <header className="bg-light">
      <Navbar bg="light" expand="lg">
        <Container>
          <Link href="/">
            <Navbar.Brand href="/" className="d-flex">
              <Image src="/ucll.svg" alt="UCLL logo" width="80" height="48" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Link href={"/interviews"}>
                <Nav.Link href="/">Interviews</Nav.Link>
              </Link>
              <Link href={"/users"}>
                <Nav.Link href="/">Gebruikers</Nav.Link>
              </Link>
              <Link href={"/profile"}>
                <Nav.Link href="/">Profiel</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavBar;
