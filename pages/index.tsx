import type { NextPage } from "next";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Slim op sollicitatie</title>
        <meta name="description" content="Slim op sollicitatie" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-light">
        <nav className="container navbar navbar-expand-sm navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">
              Slim op sollicitatie
            </a>
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
                  <a className="nav-link active" aria-current="page" href="#">
                    Vragenlijst
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Profiel
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <main className="container">
        <h1 className="py-4">Slim op sollicitatie</h1>

        <p>Welkom student/lector</p>
        <button type="button" className="btn btn-primary">
          Vragenlijst
        </button>
      </main>

      <footer className="container fixed-bottom text-muted d-flex flex-wrap justify-content-between align-items-center py-3 border-top">
        <div className="col-md-4 d-flex align-items-center">
          Slim op sollicitatie
        </div>

        <p className="nav col-md-4 justify-content-end list-unstyled d-flex">
          © 2022 UCLL, Inc
        </p>
      </footer>
    </div>
  );
};

export default Home;
