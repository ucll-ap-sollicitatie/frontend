import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Breadcrumb, Table } from "react-bootstrap";
import Layout from "../../components/layout/Layout";

const Contact: NextPage = () => {
  const t = useTranslations("contact");

  return (
    <Layout>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Contact</Breadcrumb.Item>
      </Breadcrumb>

      <h1>{t("contact")}</h1>
      <p>
        {t("contact_description")}
        <br />
        {t("contact_us")}
        <br />
        UCLL mail: leuven@ucll.be
      </p>

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
            <td>joran.vangrunderbeek@student.ucll.be</td>
            <td>r0709770</td>
          </tr>
          <tr>
            <td>Lorenzo Catalano</td>
            <td>lorenzo.catalano@student.ucll.be</td>
            <td>r0790963</td>
          </tr>
          <tr>
            <td>Maarten Van Briel</td>
            <td>maarten.vanbriel@student.ucll.be</td>
            <td>r0746926</td>
          </tr>
          <tr>
            <td>Szymon Nidecki</td>
            <td>szymon.nidecki@student.ucll.be</td>
            <td>r0790938</td>
          </tr>
        </tbody>
      </Table>
    </Layout>
  );
};

export default Contact;
