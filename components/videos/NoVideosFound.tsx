import type { NextPage } from "next";
import { Breadcrumb } from "react-bootstrap";
import Layout from "../layout/Layout";

const NoVideosFound: NextPage = () => {
  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Video's</Breadcrumb.Item>
      </Breadcrumb>
      <h1>Geen video's gevonden.</h1>
    </Layout>
  );
};

export default NoVideosFound;
