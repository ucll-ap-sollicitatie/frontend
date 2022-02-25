import { useState, FormEvent, useEffect } from "react";
import { NextPage } from "next";
import { Alert } from "react-bootstrap";
import { useRouter } from "next/router";
import SpinnerComponent from "../SpinnerComponent";
import UserForm from "./UserForm";
import User from "../../interfaces/User";
import { useSession } from "next-auth/react";

interface Props {
  email: string;
}

const UpdateInterviewForm: NextPage<Props> = ({ email }) => {
  const router = useRouter();
  const session = useSession();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User>();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`http://localhost:3001/users/email/${email}`);
      const data = await res.json();
      setUser(data);
    };

    fetchUser();
    setLoading(false);
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    if (target.password.value != target.password_check.value) {
      setError("De wachtwoorden komen niet overeen");
      setShow(true);
      return;
    }

    const res = await fetch(`http://localhost:3001/users/${email}`, {
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

    console.log(res);
    console.log(await res.json());

    /* if (!res.ok) {
      const response = await res.json();
      setError(response.messages);
      setShow(true);
    } else {
      //session.data.user = user;

      router.push(
        {
          pathname: `/profile`,
          query: { toast: "Profiel succesvol aangepast" },
        },
        `/profile`
      );
    } */
  };

  if (loading) return <SpinnerComponent />;

  return (
    <>
      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>Slim op sollicitatie</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <UserForm onSubmit={onSubmit} user={user} />
    </>
  );
};

export default UpdateInterviewForm;
