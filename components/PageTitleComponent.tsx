import { NextPage } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  title: string;
}

const PageTitleComponent: NextPage<Props> = ({ title }) => {
  const h = useTranslations("home");
  return (
    <Head>
      <title>
        {h("title_short")} | {title}
      </title>
    </Head>
  );
};

export default PageTitleComponent;
