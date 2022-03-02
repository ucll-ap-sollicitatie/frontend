import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { Card, Stack } from "react-bootstrap";
import User from "../../interfaces/User";
import DarkModeToggle from "../buttons/DarkModeToggle";
import LocaleDropdown from "../buttons/LocaleDropdown";
import FavoriteVideoButton from "../users/FavoriteVideoButton";
import UpdatePreferencesButton from "../users/UpdatePreferencesButton";
import UpdateUserButton from "../users/UpdateUserButton";

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
      return <UpdateUserButton email={user.email} />;
    }
  };

  const updatePreferences = () => {
    if (session_user.email === user.email || session_user.role === "Admin") {
      return <UpdatePreferencesButton />;
    }
  };

  const favoriteVideosComponent = () => {
    if (session_user.role !== "Student") {
      return <FavoriteVideoButton email={user.email} />;
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

        <Card.Text></Card.Text>
        <Card.Text>
          {user.r_u_number}
          <br />
          {user.email}
        </Card.Text>
      </Card.Body>

      <Card.Body className="border-top">
        <Stack gap={3}>
          <DarkModeToggle />
          <LocaleDropdown />
        </Stack>
      </Card.Body>

      <Card.Body className="border-top">
        <Stack>
          {updateComponent()}
          {updatePreferences()}
          {favoriteVideosComponent()}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
