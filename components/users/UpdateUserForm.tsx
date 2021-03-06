import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { isPasswordValid } from "../../helpers/helperFunctions";
import User from "../../interfaces/User";
import SpinnerComponent from "../SpinnerComponent";
import UserForm from "./UserForm";

interface Props {
  email: string;
}

const UpdateUserForm: NextPage<Props> = ({ email }) => {
  const t = useTranslations("errors");
  const u = useTranslations("users");

  const router = useRouter();
  const session = useSession();
  const current_user = session.data?.user as User;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`);
      const data = await res.json();
      setUser(data);
    };

    fetchUser();
    setLoading(false);
  }, [email]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    let body: string;
    let requestUrl: string;

    if (current_user.email === user?.email) {
      // check password
      const password = target.password.value;
      const checkPassword = isPasswordValid(password, target.password_check.value);
      if (checkPassword !== "password_ok") {
        setError(t(checkPassword));
        setShow(true);
        return;
      }
      requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${email}`;
      body = JSON.stringify({
        name: target.user_name.value.trim(),
        surname: target.surname.value.trim(),
        password: password,
        role_id: target.role_id.value,
        formation_id: target.formation_id.value,
      });
    } else {
      requestUrl = `${process.env.NEXT_PUBLIC_API_URL}/users/${email}/admin`;
      body = JSON.stringify({
        name: target.user_name.value.trim(),
        surname: target.surname.value.trim(),
        role_id: target.role_id.value,
        formation_id: target.formation_id.value,
      });
    }

    // Update
    const res = await fetch(requestUrl, {
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
    if (!res.ok) {
      setError(t("update_failed"));
      setShow(true);
      return;
    }

    // Get user and update local user information
    const user_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${email}`);
    if (!user_res.ok) {
      const data = await res.json();
      setError(data.error);
      setShow(true);
      return;
    }
    const new_user = await user_res.json();

    // Redirect to /profile
    if (current_user.email === email && session.data !== null) {
      session.data.user = new_user;
      router.push(
        {
          pathname: `/profile`,
          query: { toast: u("update_profile_success") },
        },
        `/profile`
      );
    } else {
      router.push(
        {
          pathname: `/users/${new_user.user_id}`,
          query: { toast: u("update_user_success") },
        },
        `/users/${new_user.user_id}`
      );
    }
  };

  const activateUser = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/activation/${user?.user_id}/admin`, {
      method: "PUT",
    });
  };

  if (loading) return <SpinnerComponent />;

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{t("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <UserForm onSubmit={onSubmit} user={user} activateUser={activateUser} />
    </>
  );
};

export default UpdateUserForm;
