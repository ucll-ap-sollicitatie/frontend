import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { isPasswordValid, validateEmail } from "../../helpers/helperFunctions";
import Formation from "../../interfaces/Formation";
import Role from "../../interfaces/Role";
import UserForm from "./UserForm";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const AddUserForm: NextPage = () => {
  const t = useTranslations("errors");

  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`);
      const data = await response.json();
      setRoles(data);
    };

    const fetchFormations = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/formations`);
      const data = await response.json();
      setFormations(data);
    };

    fetchRoles();
    fetchFormations();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const password = target.password.value;
    const email = target.email.value;

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
        name: target.user_name.value,
        surname: target.surname.value,
        email: target.email.value,
        password: target.password.value,
        formation_id: target.formation_id.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      setError(t("500"));
      setShow(true);
    } else {
      router.push({
        pathname: "/preferences",
        query: { toast: t("register_success") },
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
