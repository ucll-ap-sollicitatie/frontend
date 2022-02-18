import type { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";

const NavBar: NextPage = () => {
  const { data: session } = useSession();

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
              {!session ? (
                <>
                  <Nav.Link onClick={signIn}>Login</Nav.Link>
                  <Link href="/auth/register">
                    <Nav.Link href="/">Registeren</Nav.Link>
                  </Link>
                </>
              ) : (
                <>
                  <Link href={"/interviews"}>
                    <Nav.Link href="/">Sollicitaties</Nav.Link>
                  </Link>
                  <Link href={"/users"}>
                    <Nav.Link href="/">Gebruikers</Nav.Link>
                  </Link>
                  <Link href={"/profile"}>
                    <Nav.Link href="/">Profiel</Nav.Link>
                  </Link>
                  <Nav.Link onClick={signOut}>Logout</Nav.Link>
                </>
              )}
              <Link href={"/contact"}>
                <Nav.Link href="/">Contact</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavBar;
