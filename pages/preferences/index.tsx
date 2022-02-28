import { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import Layout from "../../components/layout/Layout";
import Unauthenticated from "../../components/Unauthenticated";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import User from "../../interfaces/User";

export const getStaticProps: GetStaticProps = async () => {
  const question_categories_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`);
  const question_categories = await question_categories_response.json();

  return {
    props: { question_categories: question_categories },
  };
};

interface Props {
  question_categories: QuestionCategory[];
}

const Preferences: NextPage<Props> = ({ question_categories }) => {
  const t = useTranslations("preferences");

  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const user = session?.user as User;
  if (!session || session.user === undefined) return <Unauthenticated />;

  const submitPreferences = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences`, {
      body: JSON.stringify({
        email: session.user?.email,
        preference_1: target.preference_1.value,
        preference_2: target.preference_2.value,
        preference_3: target.preference_3.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!res.ok) {
      const response = await res.json();
      setError(t("error"));
      setShow(true);
    } else {
      router.push({
        pathname: "/",
        query: { toast: "U heeft uw preferenties toegevoegd!" },
      });
    }
  };

  const test = () => {
    let testArr: any = [];
    for (let i = 0; i < question_categories.length; i++) {
      const item = question_categories[i];
      if (item.category === "Algemeen") {
        testArr.push(
          <option key={item.question_category_id} value={item.question_category_id} selected={true}>
            {item.category}
          </option>
        );
      } else {
        testArr.push(
          <option key={item.question_category_id} value={item.question_category_id}>
            {item.category}
          </option>
        );
      }
    }
    return testArr;
  };

  return (
    <Layout>
      <h1>{t("title")}</h1>

      <p>{t("form_title")}</p>
      <Form onSubmit={submitPreferences}>
        <div className="d-flex gap-4 flex-wrap">
          <Stack gap={3}>
            <Form.Group controlId="preference_1">
              <Form.Label>{t("preference")} 1</Form.Label>
              <Form.Select required>{test()}</Form.Select>
            </Form.Group>

            <Form.Group controlId="preference_2">
              <Form.Label>{t("preference")} 2</Form.Label>
              <Form.Select required>{test()}</Form.Select>
            </Form.Group>

            <Form.Group controlId="preference_3">
              <Form.Label>{t("preference")} 3</Form.Label>
              <Form.Select required>{test()}</Form.Select>
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
