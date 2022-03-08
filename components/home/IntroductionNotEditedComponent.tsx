import { NextPage } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import User from "../../interfaces/User";

interface Props {
  session_user: User;
}

const IntroductionNotEditedComponent: NextPage<Props> = ({ session_user }) => {
  const u = useTranslations("users");
  if (session_user.role === "Student") {
    return (
      <>
        <p>{u("student_index_possibilities")}</p>
        <p>{u("student_index")}</p>
        <p>
          <Link href={`/profile`} passHref>
            <a className="link-primary">{u("refer_to_profile")}</a>
          </Link>
        </p>
      </>
    );
  } else if (session_user.role === "Lector") {
    return (
      <>
        <p>{u("teacher_index_possibilities")}</p>
        <p>{u("teacher_index")}</p>
        <p>
          <Link href={`/profile`} passHref>
            <a className="link-primary">{u("refer_to_profile")}</a>
          </Link>
        </p>
      </>
    );
  } else {
    return (
      <>
        <p>{u("admin_index")}</p>
        <p>
          <Link href={`/dashboard`} passHref>
            <a className="link-primary">{u("refer_to_dashboard")}</a>
          </Link>
        </p>
      </>
    );
  }
};

export default IntroductionNotEditedComponent;
