import { NextPageContext } from "next";
import Layout from "../components/layout/Layout";

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

function Error({ statusCode }: { statusCode: number }) {
  switch (statusCode) {
    case 404:
      return (
        <Layout>
          <h1>Statuscode 404</h1>
          <p>Pagina niet gevonden.</p>
        </Layout>
      );
    case 500:
      <Layout>
        <h1>Statuscode 500</h1>
        <p>Er is een fout opgetreden bij de server.</p>
      </Layout>;
    default:
      return (
        <Layout>
          <h1>Statuscode {statusCode}</h1>
          <p>Er is een onverwachte fout opgetreden.</p>
        </Layout>
      );
  }
}

export default Error;
