import type { NextPage } from "next";
import Layout from "../../components/layout/Layout";
<<<<<<< HEAD
import AddUserForm from "../../components/users/AddUserForm";
=======
import { Formation } from "../../interfaces/Formation";
import { Role } from "../../interfaces/Role";

export const getStaticProps: GetStaticProps = async () => {
  const roles_response = await fetch(`http://localhost:3001/roles`);
  const roles = await roles_response.json();

  const formations_response = await fetch(`http://localhost:3001/formations`);
  const formations = await formations_response.json();

  return {
    props: { roles: roles, formations: formations },
  };
};

interface Props {
  roles: Role[];
  formations: Formation[];
}

const Register: NextPage<Props> = ({ roles, formations }) => {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const registerUser = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const res = await fetch("http://localhost:3001/users", {
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
      method: "POST",
    });

    if (res.status === 400) {
      setError("Gelieve alle velden in te vullen");
      setShow(true);
    } else if (res.status === 409) {
      setError("Gebruiker met deze email bestaat al");
      setShow(true);
    } else {
      router.push({
        pathname: "/preferences",
        query: { toast: "U bent geregistreerd, gelieve via email uw account te activeren" },
      });
    }
  };
>>>>>>> a7a717216b138e42a479ef337888082a14a236a1

const Register: NextPage = () => {
  return (
    <Layout>
      <h1>Nieuw account registereren</h1>

      <AddUserForm />
    </Layout>
  );
};

export default Register;