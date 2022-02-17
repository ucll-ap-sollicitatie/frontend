import type { NextPage } from "next";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Layout: NextPage = ({ children }) => {
  return (
    <>
      <div id="document-flex-wrapper" className="d-flex flex-column justify-content-between">
<div><NavBar />
      <main className="container">{children}</main></div>
      <Footer />
      </div>
    </>
  );
};

export default Layout;
