import type { NextPage } from "next";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

const Footer: NextPage = () => {
  const t = useTranslations("home");

  return (
    <footer className="text-muted mt-5 py-3 border-top">
      <div className="container d-flex flex-wrap justify-content-between align-items-center ">
        <p className="nav col-md-4">{t("title")}</p>
        <p className="nav col-md-4 justify-content-end">{t("copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;
