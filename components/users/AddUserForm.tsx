import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert } from "react-bootstrap";
import { isPasswordValid, validateEmail } from "../../helpers/helperFunctions";
import UserForm from "./UserForm";

const AddUserForm: NextPage = () => {
  const t = useTranslations("errors");
  const h = useTranslations("home");

  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const password = target.password.value;
    const email = target.email.value.trim();

    // check password
    const checkPassword = isPasswordValid(password, target.password_check.value);
    if (checkPassword !== "password_ok") {
      setError(t(checkPassword));
      setShow(true);
      return;
    }

    const checkEmail = validateEmail(email);
    if (!checkEmail) {
      setError(t("email_invalid"));
      setShow(true);
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      body: JSON.stringify({
        name: target.user_name.value.trim(),
        surname: target.surname.value.trim(),
        email: target.email.value.trim(),
        password: target.password.value,
        formation_id: target.formation_id.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      setError(t("account_already_exists"));
      setShow(true);
    } else {
      router.push({
        pathname: "/preferences",
        query: { toast: h("register_success") },
      });
    }
  };

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{t("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <UserForm onSubmit={onSubmit} />
    </>
  );
};

export default AddUserForm;
