import type { NextPage } from "next";

const Footer: NextPage = () => {
  return (
    <footer className="text-muted mt-5 py-3 border-top">
      <div className="container d-flex flex-wrap justify-content-between align-items-center ">
        <p className="nav col-md-4">Slim op sollicitatie</p>
        <p className="nav col-md-4 justify-content-end">© 2022 UCLL, Inc</p>
      </div>
    </footer>
  );
};

export default Footer;
