import { NextPage } from "next";
import Layout from "../../components/layout/Layout";
import { useSession } from "next-auth/react";
import Unauthenticated from "../../components/Unauthenticated";
import { useRouter } from "next/router";
import Error from "../_error";
import UpdateTaskForm from "../../components/tasks/UpdateTaskForm";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const UpdateInterview: NextPage = () => {
  const t = useTranslations("tasks");

  const router = useRouter();
  const query = router.query as { task_id: string };
  const { data: session } = useSession();
  if (query.task_id === undefined) return <Error statusCode={404} />;
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/dashboard", text: t("tasks") }, { text: t("task_update") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("task_update")}</h1>
      <UpdateTaskForm task_id={query.task_id} />
    </Layout>
  );
};

export default UpdateInterview;
