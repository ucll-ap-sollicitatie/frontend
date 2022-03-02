import { useState, FormEvent, useEffect } from "react";
import { NextPage } from "next";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import SpinnerComponent from "../SpinnerComponent";
import UserForm from "./UserForm";
import User from "../../interfaces/User";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

interface Props {
  email: string;
}

const UpdateInterviewForm: NextPage<Props> = ({ email }) => {
  const t = useTranslations("errors");

  const router = useRouter();
  const session = useSession();

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

    // Check passwords
    if (target.password.value != target.password_check.value) {
      setError(t("password_mismatch"));
      setShow(true);
      return;
    }

    // Update
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${email}`, {
      body: JSON.stringify({
        name: target.user_name.value,
        surname: target.surname.value,
        r_u_number: target.r_u_number.value,
        email: target.email.value,
        password: target.password.value,
        role_id: target.role_id.value,
        formation_id: target.formation_id.value,
      }),
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
    const user = await user_res.json();
    if (session.data !== null) session.data.user = user;

    // Redirect to /profile
    router.push(
      {
        pathname: `/users/${user.email}`,
        query: { toast: t("update_profile_success") },
      },
      `/users/${user.email}`
    );
  };

  if (loading) return <SpinnerComponent />;

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{t("title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <UserForm onSubmit={onSubmit} user={user} />
    </>
  );
};

export default UpdateInterviewForm;
