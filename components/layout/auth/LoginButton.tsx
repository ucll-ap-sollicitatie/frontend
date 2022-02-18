import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { Button } from "react-bootstrap";

const LoginButton: NextPage = () => {
  return (
    <Button variant="primary" onClick={() => signIn(null, { callbackUrl: `/?toast=Successvol ingelogd` })}>
      Inloggen
    </Button>
  );
};

export default LoginButton;
