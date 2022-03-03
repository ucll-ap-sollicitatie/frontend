import { GetStaticProps, NextPage } from "next";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Alert, Button, Form } from "react-bootstrap";
import { FormEvent, useState } from "react";
import Link from "next/link";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";
import PageTitleComponent from "../../components/PageTitleComponent";
import Unauthenticated from "../../components/Unauthenticated";
import User from "../../interfaces/User";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
};

const DeleteAccount: NextPage = () => {
  const t = useTranslations("preferences");
  const u = useTranslations("users");
  const title = t("title");
  const { data: session } = useSession();
  const [confirmed, setConfirmed] = useState<boolean>(false);

  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session?.user as User;
  const breadcrumb_items = [{ href: `/users/${user.email}`, text: u("my_profile") }, { text: t("title") }];

  const deleteAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.r_u_number}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(await signOut({ callbackUrl: `/?toast=Account deleted` }));
  };

  return (
    <Layout>
      <PageTitleComponent title={title} />
      <BreadcrumbComponent items={breadcrumb_items} />
      <h1>Account deletion</h1>

      <Alert variant="danger" transition={true}>
        <Alert.Heading>Warning, deleting your account is irreversible and any data cannot be restored. Are you sure of this decision?</Alert.Heading>
        <span>Any and all information about, and of you will be deleted. This includes but is not limited to all recordings, comments and data.</span>
      </Alert>

      <Form onSubmit={deleteAccount}>
        <div className="d-flex gap-2 mb-2 align-items-center">
          <Form.Group controlId="privateCheckbox">
            <Form.Check type="checkbox" label="I understand and confirm" onChange={() => setConfirmed(!confirmed)} />
          </Form.Group>
          <Button type="submit" variant="text" className="link-danger" disabled={!confirmed}>
            Delete my account
          </Button>
        </div>
        <Link href="/profile" passHref>
          <Button variant="primary">No, get me out of here</Button>
        </Link>
      </Form>
    </Layout>
  );
};

export default DeleteAccount;
