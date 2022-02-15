import type { NextPage } from "next";
import Link from "next/link";
import { Button } from "react-bootstrap";
import Layout from "../components/layout/Layout";
import UsersTable from "../components/UsersTable";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <h1>Slim op sollicitatie</h1>

        <p>Welkom student/lector</p>

        <div className="d-grid gap-2 col-2">
          <Link href="/auth/login">
            <Button variant="primary">Login</Button>
          </Link>
          <Link href="/quiz">
            <Button variant="primary">Quizzes</Button>
          </Link>
        </div>
      </Layout>
    </>
  );
};

export default Home;
