import type { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import User from "../../interfaces/User";
import LogoutButton from "../auth/LogoutButton";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const NavBar: NextPage = () => {
  const t = useTranslations("home");

  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <header>
      <Navbar bg="bg-light" expand="lg">
        <Container>
          <Link href="/" passHref>
            <Navbar.Brand href="/" className="d-flex">
              <Image src="/ucll.svg" alt="UCLL logo" width="80" height="48" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="d-flex align-items-center">
              {!session ? (
                <>
                  <Nav.Link onClick={() => signIn()}>Login</Nav.Link>
                  <Link href="/auth/register" passHref>
                    <Nav.Link href="/">{t("register")}</Nav.Link>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/recording" passHref>
                    <Nav.Link href="/">{t("recording")}</Nav.Link>
                  </Link>
                  <Link href={"/videos"} passHref>
                    <Nav.Link href="/">{t("videos")}</Nav.Link>
                  </Link>
                  <Link href={"/interviews"} passHref>
                    <Nav.Link href="/">{t("interviews")}</Nav.Link>
                  </Link>
                  {user.role !== "Student" && (
                    <Link href={"/dashboard"} passHref>
                      <Nav.Link href="/" className="border rounded">
                        {t("dashboard")}
                      </Nav.Link>
                    </Link>
                  )}
                  {user.role === "Student" && (
                    <Link href={"/tasks"} passHref>
                      <Nav.Link href="/">{t("my_tasks")}</Nav.Link>
                    </Link>
                  )}
                  <Link href={`/users/${user.email}`} passHref>
                    <Nav.Link href="/">{t("profile")}</Nav.Link>
                  </Link>
                </>
              )}
              <Link href={"/contact"} passHref>
                <Nav.Link href="/">{t("contact")}</Nav.Link>
              </Link>

              {session && <LogoutButton />}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default NavBar;
