import { NextPageContext } from "next";
import { useTranslations } from "next-intl";
import Layout from "../components/layout/Layout";

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

function Error({ statusCode }: { statusCode: number }) {
  const t = useTranslations("errors");
  switch (statusCode) {
    case 404:
      return (
        <Layout>
          <h1> 404</h1>
          <p>{t("400")}</p>
        </Layout>
      );
    case 500:
      <Layout>
        <h1>500</h1>
        <p>{t("500")}</p>
      </Layout>;
    default:
      return (
        <Layout>
          <h1>{statusCode}</h1>
        </Layout>
      );
  }
}

export default Error;
