import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Card, Stack } from "react-bootstrap";
import User from "../../interfaces/User";
import ChangeImageButton from "../buttons/ChangeImageButton";
import DarkModeToggle from "../buttons/DarkModeToggle";
import IntroductionToggle from "../buttons/IntroductionToggle";
import LocaleDropdown from "../buttons/LocaleDropdown";
import DeleteAccountButton from "../users/DeleteAccountButton";
import FavoriteVideoButton from "../users/FavoriteVideoButton";
import UpdatePreferencesButton from "../users/UpdatePreferencesButton";
import UpdateUserButton from "../users/UpdateUserButton";

interface Props {
  user: User;
  showUploadModal?: () => void;
}

const ProfileCard: NextPage<Props> = ({ user, showUploadModal }) => {
  const { data: session } = useSession();
  const t = useTranslations("dashboard");
  const session_user = session?.user as User;

  const updateComponent = () => {
    if (session_user.email === user.email || session_user.role === "Admin") {
      return <UpdateUserButton email={user.email} />;
    }
  };

  const updatePreferences = () => {
    if (session_user.email === user.email) {
      return <UpdatePreferencesButton />;
    }
  };

  const favoriteVideosComponent = () => {
    if (user.role === "Lector" && session_user.email === user.email) {
      return <FavoriteVideoButton email={user.email} />;
    }
  };

  const deleteAccount = () => {
    if (session_user.email === user.email) {
      return <DeleteAccountButton />;
    }
  };

  const updateProfileImage = () => {
    if (session_user.email === user.email) {
      return <ChangeImageButton showUploadModal={showUploadModal} />;
    }
  };

  return (
    <Card style={{ maxWidth: "22rem" }}>
      <Card.Img variant="top" src={user.image} style={{ maxHeight: "22rem" }} />

      <Card.Body>
        <Card.Title>
          {user.name} {user.surname}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted fst-italic">
          {user.role === "Admin" && t("admin_role")}
          {user.role === "Lector" && t("teacher_role")}
          {user.role === "Student" && t("student_role")} - {user.formation}
        </Card.Subtitle>

        <Card.Text></Card.Text>

        <Card.Text>
          <a className="link-primary" href={`mailto:${user.email}`}>
            {user.email}
          </a>
        </Card.Text>
      </Card.Body>

      {session_user.email === user.email && (
        <Card.Body className="border-top">
          <Stack gap={3}>
            <DarkModeToggle />
            <IntroductionToggle session_user={session_user} />
            <LocaleDropdown />
          </Stack>
        </Card.Body>
      )}

      <Card.Body className="border-top">
        <Stack gap={2}>
          {updateProfileImage()}
          {updateComponent()}
          {updatePreferences()}
          {favoriteVideosComponent()}
          {deleteAccount()}
        </Stack>
      </Card.Body>
    </Card>
  );
};

export default ProfileCard;
