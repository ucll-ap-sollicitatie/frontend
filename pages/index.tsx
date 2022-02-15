import type { NextPage } from "next";
import Link from "next/link";
import Layout from "../components/layout/Layout";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <h1>Slim op sollicitatie</h1>

        <p>Welkom student/lector</p>
        <Link href="/quiz">
          <button type="button" className="btn btn-primary">
            Quizes
          </button>
        </Link>
        <Link href="/recording">
          <button type="button" className="btn btn-primary">
            Record a video of yourself
          </button>
        </Link>
      </Layout>
    </>
  );
};

export default Home;
