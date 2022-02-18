import type { NextPage } from "next";
import { signOut } from "next-auth/react";
import { Button } from "react-bootstrap";

const LogoutButton: NextPage = () => {
  return (
    <Button variant="primary" onClick={() => signOut({ callbackUrl: `/?toast=Successvol uitgelogd` })}>
      Logout
    </Button>
  );
};

export default LogoutButton;
