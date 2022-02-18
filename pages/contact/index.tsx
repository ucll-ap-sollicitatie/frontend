import type { NextPage } from "next";
import { Table } from "react-bootstrap";
import Layout from "../../components/layout/Layout";

const Contact: NextPage = () => {
  return (
    <Layout>
      <h1>Contact</h1>

      <h2>Team</h2>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Naam</th>
            <th>E-mail</th>
            <th>R-nummer</th>
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
