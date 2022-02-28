import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Button, Card } from "react-bootstrap";
import User from "../../interfaces/User";
import UpdateUserutton from "../users/UpdateUserButton";

interface Props {
  user: User;
}

const ProfileCard: NextPage<Props> = ({ user }) => {
  const { data: session } = useSession();

  const updateComponent = () => {
    if (session?.user?.email === user.email || session?.user?.role === "Admin") {
      return <UpdateUserutton email={user.email} />;
    }
  };

  return (
    <Card style={{ maxWidth: "22rem" }}>
      <Card.Img variant="top" src={user.image} />

      <Card.Body>
        <Card.Title>
          {user.name} {user.surname}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted fst-italic">
          {user.role} - {user.formation}
        </Card.Subtitle>
      </Card.Body>

      <Card.Body className="border-top">
        <Card.Text>{user.r_u_number}</Card.Text>
        <Card.Text>{user.email}</Card.Text>
        {updateComponent()}
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
