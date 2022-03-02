import { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Alert, Button, Form, Stack } from "react-bootstrap";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import Preference from "../../interfaces/Preference";
import QuestionCategory from "../../interfaces/QuestionCategory";
import User from "../../interfaces/User";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const question_categories_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`);
  const question_categories = await question_categories_response.json();
  const preferencesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/`);
  const preferences = await preferencesRes.json();

  return {
    props: {
      question_categories: question_categories,
      preferences: preferences,
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
};

interface Props {
  question_categories: QuestionCategory[];
  preferences: Preference[];
}

const Preferences: NextPage<Props> = ({ question_categories, preferences }) => {
  const t = useTranslations("preferences");
  const u = useTranslations("users");
  const h = useTranslations("home");

  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session?.user as User;

  const preference = preferences.find((pref) => pref.email === user.email);
  const category_1 = question_categories.find((category) => category.question_category_id === preference?.preference_1);
  const category_2 = question_categories.find((category) => category.question_category_id === preference?.preference_2);
  const category_3 = question_categories.find((category) => category.question_category_id === preference?.preference_3);

  const editPreferences = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const test1 = question_categories.find((category) => category.category === target.preference_1.value);
    const test2 = question_categories.find((category) => category.category === target.preference_2.value);
    const test3 = question_categories.find((category) => category.category === target.preference_3.value);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences/${session?.user?.email}`, {
      body: JSON.stringify({
        preference_1: test1?.question_category_id,
        preference_2: test2?.question_category_id,
        preference_3: test3?.question_category_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
    });

    if (!res.ok) {
      setError(t("error"));
      setShow(true);
    } else {
      router.push({
        pathname: `/users/${session?.user?.email}`,
        query: { toast: t("preferences_update_success") },
      });
    }
  };

  const breadcrumb_items = [{ href: `/users/${user.email}`, text: u("profile") }, { text: t("title") }];

  return (
    <Layout>
      <Head>
        <title>{`${h("title_short")} | ${t("title")}`}</title>
      </Head>

      <BreadcrumbComponent items={breadcrumb_items} />

      <h1>{t("title")}</h1>
      <p>{t("form_title")}</p>

      <Alert variant="danger" onClose={() => setShow(false)} show={show} transition={true} dismissible>
        <Alert.Heading>{t("error_title")}</Alert.Heading>
        <span>{error}</span>
      </Alert>

      <Form onSubmit={editPreferences}>
        <div className="d-flex gap-4 flex-wrap">
          <Stack gap={3}>
            <Form.Group controlId="preference_1">
              <Form.Label>{t("preference")} 1</Form.Label>
              <Form.Select defaultValue={category_1?.category} required>
                {question_categories.map((category: QuestionCategory) => (
                  <option key={category.question_category_id}>{category.category}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="preference_2">
              <Form.Label>{t("preference")} 2</Form.Label>
              <Form.Select defaultValue={category_2?.category} required>
                {question_categories.map((category: QuestionCategory) => (
                  <option key={category.question_category_id}>{category.category}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="preference_3">
              <Form.Label>{t("preference")} 3</Form.Label>
              <Form.Select defaultValue={category_3?.category} required>
                {question_categories.map((category: QuestionCategory) => (
                  <option key={category.question_category_id}>{category.category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Stack>
        </div>

        <Button variant="primary" type="submit" className="mt-3">
          {t("preferences_update")}
        </Button>
      </Form>
    </Layout>
  );
};

export default Preferences;
