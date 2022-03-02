import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRouter } from "next/router";
import Error from "../_error";
import UpdateTaskForm from "../../components/tasks/UpdateTaskForm";
import { useTranslations } from "next-intl";
import Head from "next/head";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const UpdateInterview: NextPage = () => {
  const t = useTranslations("tasks");
  const h = useTranslations("home");

  const router = useRouter();
  const query = router.query as { task_id: string };
  const { data: session } = useSession();
  if (query.task_id === undefined) return <Error statusCode={404} />;
  if (!session) return <Unauthenticated />;

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("task_update")}`}</title>
      </Head>
      <h1>{t("task_update")}</h1>

      <UpdateTaskForm task_id={query.task_id} />
    </Layout>
  );
};

export default UpdateInterview;
