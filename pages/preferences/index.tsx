import { GetStaticProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { Button, Form, Navbar, Stack } from "react-bootstrap";
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
  const { data: session } = useSession();
  if (!session || session.user === undefined) return <Unauthenticated />;
  const user = session.user as User;

  const router = useRouter();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const submitPreferences = async (event: FormEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/preferences`, {
      body: JSON.stringify({
        email: user.email,
        preference_1: target.preference_1.value,
        preference_2: target.preference_2.value,
        preference_3: target.preference_3.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (res.status === 400) {
      const response = await res.json();
      setError(response.messages);
      setShow(true);
    } else {
      router.push({
        pathname: "/",
        query: { toast: "U hebt uw preferenties toegevoegd!" },
      });
    }
  };

  const test = () => {
    let testArr: any = [];
    for (let i = 0; i < question_categories.length; i++) {
      const item = question_categories[i];
      if (item.category === "Algemeen") {
        testArr.push(
          <option key={item.question_category_id} value={item.category} selected>
            {item.category}
          </option>
        );
      } else {
        testArr.push(
          <option key={item.question_category_id} value={item.category}>
            {item.category}
          </option>
        );
      }
    }
    return testArr;
  };

  return (
    <Layout>
      <Navbar></Navbar>
      <h1>Preferenties</h1>

      <p>Kies 3 categorieën waarover je interviews wilt krijgen.</p>

      <Form onSubmit={submitPreferences}>
        <div className="d-flex gap-4 flex-wrap">
          <Stack gap={3}>
            <Form.Group controlId="preference_1">
              <Form.Label>Preferentie 1</Form.Label>
              <Form.Select required>{test()}</Form.Select>
            </Form.Group>

            <Form.Group controlId="preference_2">
              <Form.Label>Preferentie 2</Form.Label>
              <Form.Select required>
                {question_categories.map((QuestionCategory) => (
                  <option key={QuestionCategory.question_category_id} value={QuestionCategory.question_category_id}>
                    {QuestionCategory.category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="preference_3">
              <Form.Label>Preferentie 3</Form.Label>
              <Form.Select required>
                {question_categories.map((QuestionCategory) => (
                  <option key={QuestionCategory.question_category_id} value={QuestionCategory.question_category_id}>
                    {QuestionCategory.category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Stack>
        </div>

        <Button variant="primary" type="submit" className="mt-3">
          Voeg preferenties toe
        </Button>
      </Form>
    </Layout>
  );
};

export default Preferences;
