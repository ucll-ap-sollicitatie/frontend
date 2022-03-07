import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import UpdateTaskForm from "../../components/tasks/UpdateTaskForm";
import Unauthenticated from "../../components/Unauthenticated";
import Error from "../_error";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const UpdateInterview: NextPage = () => {
  const t = useTranslations("tasks");
  const title = t("task_update");
  const router = useRouter();
  const query = router.query as { task_id: string };
  const { data: session } = useSession();
  if (query.task_id === undefined) return <Error statusCode={404} />;
  if (!session) return <Unauthenticated />;

  const breadcrumb_items = [{ href: "/dashboard", text: t("tasks") }, { text: t("task_update") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />
      <h1>{t("task_update")}</h1>
      <UpdateTaskForm task_id={query.task_id} />
    </Layout>
  );
};

export default UpdateInterview;
