import type { GetServerSideProps, GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Video from "../../interfaces/Video";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import AllVideoOverview from "../../components/videos/AllVideoOverview";
import User from "../../interfaces/User";
import { useTranslations } from "next-intl";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import PageTitleComponent from "../../components/PageTitleComponent";

// export const getStaticProps: GetStaticProps = async ({ locale }) => {
//   let props = {
//     videos: null,
//     messages: (await import(`../../public/locales/${locale}.json`)).default,
//   };

//   const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
//   const data = await result.json();

//   if (result.status !== 404 && result.status !== 500) {
//     props.videos = data;
//   }

//   return {
//     props,
//   };
// };

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  let props = {
    videos: null,
    messages: (await import(`../../public/locales/${locale}.json`)).default,
  };

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`);
  const data = await result.json();

  if (result.status !== 404 && result.status !== 500) {
    props.videos = data;
  }

  return {
    props,
  };
};

interface Props {
  videos: Video[];
}

const Home: NextPage<Props> = ({ videos }) => {
  const t = useTranslations("videos");
  const title = t("all");
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const breadcrumb_items = [{ text: t("all") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />
      <PageTitleComponent title={title} />

      <h1>{t("all")}</h1>
      <AllVideoOverview videos={videos} user={user} />
    </Layout>
  );
};

export default Home;
