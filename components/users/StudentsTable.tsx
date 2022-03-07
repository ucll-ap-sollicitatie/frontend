import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import User from "../../interfaces/User";
import SpinnerComponent from "../SpinnerComponent";
import StudentsReactTable from "../StudentsReactTable";

const StudentsTable: NextPage = () => {
  const t = useTranslations("students");
  const u = useTranslations("users");

  const columns = [
    {
      Header: u("name"),
      accessor: "name",
    },
    {
      Header: u("surname"),
      accessor: "surname",
    },
    {
      Header: u("email"),
      accessor: "email",
    },
    {
      Header: u("formation"),
      accessor: "formation",
    },
  ];

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`);

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

  if (error) return <div>{t("error")}</div>;
  if (loading) return <SpinnerComponent />;
  if (users.length === 0) return <div>{t("no_students")}</div>;

  return (
    <>
      <StudentsReactTable columns={columns} data={users} url={"/users"} id="user_id" />
    </>
  );
};

export default StudentsTable;
