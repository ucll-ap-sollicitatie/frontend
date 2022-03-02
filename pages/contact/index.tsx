import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Breadcrumb, Table } from "react-bootstrap";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const Contact: NextPage = () => {
  const t = useTranslations("contact");

  const breadcrumb_items = [{ text: t("title") }];

  return (
    <Layout>
      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("title")}</h1>

      <p>{t("contact_description")}</p>
      <p>
        {t("contact_us")}
        <br />
        UCLL email:{" "}
        <a className="link-primary" href="mailto:leuven@ucll.be">
          leuven@ucll.be
        </a>
      </p>
      <br />

      <h2>{t("team")}</h2>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("email")}</th>
            <th>{t("r_number")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Joran Van Grunderbeek</td>
            <td>
              <a className="link-primary" href="mailto:joran.vangrunderbeek@student.ucll.be">
                joran.vangrunderbeek@student.ucll.be
              </a>
            </td>
            <td>r0709770</td>
          </tr>
          <tr>
            <td>Lorenzo Catalano</td>
            <td>
              <a className="link-primary" href="mailto:lorenzo.catalano@student.ucll.be">
                lorenzo.catalano@student.ucll.be
              </a>
            </td>
            <td>r0790963</td>
          </tr>
          <tr>
            <td>Maarten Van Briel</td>
            <td>
              <a className="link-primary" href="mailto:maarten.vanbriel@student.ucll.be">
                maarten.vanbriel@student.ucll.be
              </a>
            </td>
            <td>r0746926</td>
          </tr>
          <tr>
            <td>Szymon Nidecki</td>
            <td>
              <a className="link-primary" href="mailto:szymon.nidecki@student.ucll.be">
                szymon.nidecki@student.ucll.be
              </a>
            </td>
            <td>r0790938</td>
          </tr>
        </tbody>
      </Table>
    </Layout>
  );
};

export default Contact;
