import type { NextPage } from "next";
import Footer from "./Footer";
import NavBar from "./NavBar";

const Layout: NextPage = ({ children }) => {
  return (
    <>
      <NavBar />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
