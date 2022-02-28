import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import User from "../../interfaces/User";

const NavBar: NextPage = () => {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <header className="bg-light">
      <Navbar bg="light" expand="lg">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand href="/" className="d-flex">
              <Image src="/ucll.svg" alt="UCLL logo" width="80" height="48" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              {!session ? (
                <>
                  <Nav.Link onClick={() => signIn()}>Login</Nav.Link>
                  <Link href="/auth/register" passHref>
                    <Nav.Link href="/">Registeren</Nav.Link>
                  </Link>
                </>
              ) : (
                <>
                  {user.role !== "Student" && (
                    <Link href={"/dashboard"} passHref>
                      <Nav.Link href="/" className="border">
                        Dashboard
                      </Nav.Link>
                    </Link>
                  )}
                  {user.role === "Student" && (
                    <Link href={"/tasks"} passHref>
                      <Nav.Link href="/">Mijn taken</Nav.Link>
                    </Link>
                  )}
                  <Link href={"/interviews"} passHref>
                    <Nav.Link href="/">Sollicitaties</Nav.Link>
                  </Link>
                  <Link href="/recording" passHref>
                    <Nav.Link href="/">Recording</Nav.Link>
                  </Link>
                  <Link href={"/videos"} passHref>
                    <Nav.Link href="/">Video's</Nav.Link>
                  </Link>
                  <Link href={"/preferences"} passHref>
                    <Nav.Link href="/">Preferenties</Nav.Link>
                  </Link>
                  <Link href={`/users/${user.email}`} passHref>
                    <Nav.Link href="/">Profiel</Nav.Link>
                  </Link>
                </>
              )}
              <Link href={"/contact"} passHref>
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
