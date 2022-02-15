import type { NextPage } from "next";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import Layout from "../../components/layout/Layout";

const Profile: NextPage = () => {
  return (
    <>
      <Layout>
        <h1>Profiel</h1>

        <Card style={{ "max-width": "18rem" }}>
          <Card.Img variant="top" src="/johan.png" />

          <Card.Body>
            <Card.Title>Johan Strypsteen</Card.Title>
            <Card.Subtitle className="mb-2 text-muted fst-italic">The name of the game</Card.Subtitle>
            <Card.Text>De beste lector van campus proximus!</Card.Text>
          </Card.Body>

          <Card.Body className="border-top">
            <Card.Text>r0790963</Card.Text>
            <Card.Text>johan.strypsteen@ucll.be</Card.Text>
            <Button variant="primary">Update information</Button>
          </Card.Body>
        </Card>
      </Layout>
    </>
  );
};

export default Profile;
