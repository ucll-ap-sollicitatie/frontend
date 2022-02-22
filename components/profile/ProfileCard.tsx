import type { NextPage } from "next";
import { Button, Card } from "react-bootstrap";
import { capitalize } from "../../helpers/helperFunctions";
import User from "../../interfaces/User";

interface Props {
  user: User;
}

const ProfileCard: NextPage<Props> = ({ user }) => {
  return (
    <Card style={{ maxWidth: "22rem" }}>
      <Card.Img variant="top" src={user.image} />

      <Card.Body>
        <Card.Title>
          {user.name} {user.surname}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted fst-italic">
          {capitalize(user.role)} - {user.formation}
        </Card.Subtitle>
      </Card.Body>

      <Card.Body className="border-top">
        <Card.Text>{user.r_u_number}</Card.Text>
        <Card.Text>{user.email}</Card.Text>
        <Button variant="primary">Update information</Button>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
