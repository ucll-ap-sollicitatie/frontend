import { NextPageContext } from "next";
import { useTranslations } from "next-intl";
import Layout from "../components/layout/Layout";

Error.getInitialProps = async ({ res, err, locale }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, messages: (await import(`../public/locales/${locale}.json`)).default };
};

function Error({ statusCode }: { statusCode: number }) {
  const t = useTranslations("errors");

  if (statusCode === 404 || statusCode === 500) {
    return (
      <Layout>
        <h1>{statusCode}</h1>
        <p>{t(statusCode.toString())}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>{statusCode}</h1>
      <p>{t("unexpected_error")}</p>
    </Layout>
  );
}

export default Error;
