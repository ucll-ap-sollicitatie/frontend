import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Card } from "react-bootstrap";
import User from "../../interfaces/User";
import UpdateUserutton from "../users/UpdateUserButton";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  user: User;
}

const ProfileCard: NextPage<Props> = ({ user }) => {
  const { data: session } = useSession();
  const session_user = session?.user as User;

  const updateComponent = () => {
    if (session_user.email === user.email || session_user.role === "Admin") {
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
