import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { Form } from "react-bootstrap";
import User from "../../interfaces/User";

interface Props {
  session_user: User;
}

const IntroductionToggle: NextPage<Props> = ({ session_user }) => {
  const u = useTranslations("users");

  const toggleIntroduced = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/${session_user.email}/introduction`, {
      method: "PUT",
    });
    session_user.introduced = !session_user.introduced;
  };

  return (
    <Form>
      <Form.Check
        onChange={toggleIntroduced}
        defaultChecked={session_user.introduced ? true : false}
        type="switch"
        id="custom-switch"
        label={u("toggle_introduction")}
      />
    </Form>
  );
};

export default IntroductionToggle;
