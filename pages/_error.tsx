import { NextPageContext } from "next";
import Layout from "../components/layout/Layout";

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

function Error({ statusCode }: { statusCode: number }) {
  const t = useTranslations("error");

  switch (statusCode) {
    case 404:
      return (
        <Layout>
          <h1>{t("status_code")} 404</h1>
          <p>{t("404")}</p>
        </Layout>
      );
    case 500:
      <Layout>
        <h1>{t("status_code")} 500</h1>
        <p>{t("500")}</p>
      </Layout>;
    default:
      return (
        <Layout>
          <h1>
            {t("status_code")} {statusCode}
          </h1>
          <p>{t("unexpected_error")}</p>
        </Layout>
      );
  }
}

export default Error;
