import type { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert, Button, Form, Stack } from "react-bootstrap";

const LoginForm: NextPage = () => {
  const router = useRouter();

  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const t = useTranslations("home");
  const u = useTranslations("users");
  const e = useTranslations("errors");

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const email = target.email.value;
    const password = target.password.value;

    signIn("credentials", { redirect: false, email: email, password: password })
      .then((res) => {
        const data = res as any;

        if (data.error === "Invalid credentials") {
          setError(e("login_error"));
          setShow(true);
          return;
        }

        if (data.error === "User not activated") {
          setError(e("login_not_activated_error"));
          setShow(true);
          return;
        }

        router.push(
          {
            pathname: "/",
            query: { toast: t("login_success") },
          },
          "/"
        );
      })
      .catch(() => {
        setError(e("login_unexpected_error"));
        setShow(true);
      });
  };

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{e("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <Form onSubmit={handleLogin} className="col-xs-4 col-sm-10 col-md-4">
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>{u("email")}</Form.Label>
            <Form.Control type="email" placeholder={u("email")} required />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>{u("password")}</Form.Label>
            <Form.Control type="password" placeholder={u("password")} required />
          </Form.Group>

          <Button variant="primary" type="submit">
            {t("login")}
          </Button>
        </Stack>
      </Form>
    </>
  );
};

export default LoginForm;
