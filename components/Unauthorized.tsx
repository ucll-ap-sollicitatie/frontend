import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import LoginButton from "./auth/LoginButton";
import RegisterButton from "./auth/RegisterButton";
import Layout from "./layout/Layout";

const Unauthorized: NextPage = () => {
  const t = useTranslations("home");

  return (
    <Layout>
      <h1>{t("title")}</h1>

      <p>{t("anauthorized")}.</p>

      <div className="d-flex gap-2 flex-column col-md-2">
        <LoginButton />
        <RegisterButton />
      </div>
    </Layout>
  );
};

export default Unauthorized;
