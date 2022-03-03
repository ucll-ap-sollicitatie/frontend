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
  const u = useTranslations("users");
  const title = u("account_delete_title");
  const { data: session } = useSession();
  const [confirmed, setConfirmed] = useState<boolean>(false);

  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session?.user as User;
  const breadcrumb_items = [{ href: `/users/${user.email}`, text: u("my_profile") }, { text: title }];

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
      <h1>{title}</h1>

      <Alert variant="danger" transition={true}>
        <Alert.Heading>{u("account_delete_heading")}</Alert.Heading>
        <span>{u("account_delete_span")}</span>
      </Alert>

      <Form onSubmit={deleteAccount}>
        <div className="d-flex gap-2 mb-2 align-items-center">
          <Form.Group controlId="privateCheckbox">
            <Form.Check type="checkbox" label={u("account_delete_confirm")} onChange={() => setConfirmed(!confirmed)} />
          </Form.Group>
          <Button type="submit" variant="text" className="link-danger" disabled={!confirmed}>
            {u("account_delete_button")}
          </Button>
        </div>
        <Link href="/profile" passHref>
          <Button variant="primary">{u("account_delete_cancel")}</Button>
        </Link>
      </Form>
    </Layout>
  );
};

export default DeleteAccount;
