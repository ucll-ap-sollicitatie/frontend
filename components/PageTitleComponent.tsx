import { NextPage } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";

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
