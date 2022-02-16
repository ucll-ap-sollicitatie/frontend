import type { NextPage } from "next";
import Link from "next/link";
import { Button, Stack } from "react-bootstrap";
import Layout from "../components/layout/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <h1>Slim op sollicitatie</h1>

        <p>Welkom student/lector</p>

        <Stack gap={2} className="col-md-2">
          <Link href="/auth/login">
            <Button variant="primary">Login</Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="primary">Register</Button>
          </Link>
        </Stack>
      </Layout>
    </>
  );
};

export default Home;
