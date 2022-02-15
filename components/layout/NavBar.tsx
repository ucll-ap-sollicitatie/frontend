import type { NextPage } from "next";

import Image from "next/image";
import Link from "next/link";

const NavBar: NextPage = () => {
  return (
    <header className="bg-light">
      <nav className="container navbar navbar-expand-sm navbar-light bg-light">
        <div className="container-fluid p-0">
          <Link href="/">
            <a className="d-flex justify-content-start" href="#">
              <Image src="/ucll.svg" alt="UCLL logo" width="80" height="48" />
            </a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse flex-grow-0"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-lg-0">
              <li className="nav-item">
                <Link href={"/quiz"}>
                  <a className="nav-link active" aria-current="page">
                    Vragenlijst
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
