import type { NextPage } from "next";
import { useEffect, useState } from "react";
import User from "../../interfaces/User";
import SpinnerComponent from "../SpinnerComponent";
import StudentsReactTable from "../StudentsReactTable";

const columns = [
  {
    Header: "Voornaam",
    accessor: "name",
  },
  {
    Header: "Familienaam",
    accessor: "surname",
  },
  {
    Header: "E-mail",
    accessor: "email",
  },
  {
    Header: "Richting",
    accessor: "formation",
  },
];

const StudentsTable: NextPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3001/users");

    if (res.status !== 200) {
      setError(true);
    } else {
      const data = await res.json();
      const students = data.filter((x: User) => x.role === "Student");
      setUsers(students);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) return <div>Er is een probleem opgetreden bij het laden van uw studenten.</div>;
  if (loading) return <SpinnerComponent />;
  if (users.length === 0) return <div>U heeft geen studenten op toezicht.</div>;

  return (
    <>
      <StudentsReactTable columns={columns} data={users} url={"/users"} id="email" />
    </>
  );
};

export default StudentsTable;
