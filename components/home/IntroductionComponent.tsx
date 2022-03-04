import { NextPage } from "next";
import { useTranslations } from "next-intl";
import User from "../../interfaces/User";

interface Props {
  session_user: User;
}

const IntroductionComponent: NextPage<Props> = ({ session_user }) => {
  const u = useTranslations("users");
  if (session_user.role === "Student") {
    return (
      <p>
        {u("student_index_possibilities")}
        <br />
        <br />
        {u("student_index")}
      </p>
    );
  } else if (session_user.role === "Lector") {
    return (
      <p>
        {u("teacher_index_possibilities")}
        <br />
        <br />
        {u("teacher_index")}
      </p>
    );
  } else {
    return <p>{u("admin_index")}</p>;
  }
};

export default IntroductionComponent;
