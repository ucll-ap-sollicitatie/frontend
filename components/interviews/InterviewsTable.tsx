import type { NextPage } from "next";
import { Modal, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { QuestionCategory } from "../../interfaces/QuestionCategory";
import ReactTable from "../ReactTable";
import ConfirmCloseButton from "../buttons/ConfirmCloseButton";
import ConfirmRemoveButton from "../buttons/ConfirmRemoveButton";
import { useTranslations } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: (await import(`../../public/locales/${locale}.json`)).default,
    },
  };
}

const InterviewsTable: NextPage = () => {
  const t = useTranslations("interviews");

  const columns = [
    {
      Header: t("category"),
      accessor: "category",
    },
    {
      Header: t("amount_of_questions"),
      accessor: "amount_of_questions",
      sortInverted: true,
    },
  ];

  const [question_categories, setQuestion_categories] = useState<QuestionCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories`);

    if (!res.ok) {
      setError(true);
    } else {
      const data = await res.json();
      setQuestion_categories(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const router = useRouter();
  const [id, setId] = useState<number | string>(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (id: number | string) => {
    setId(id);
    setShow(true);
  };

  const handleDelete = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/question-categories/${id}`, {
      method: "DELETE",
    });

    handleClose();
    router.push(
      {
        pathname: "/interviews",
        query: { toast: "Sollicitatie successvol verwijderd" },
      },
      "/interviews"
    );

    fetchData();
  };

  if (error) return <div>{t("interviews_error_loading")}</div>;
  if (loading) {
    return (
      <div>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  if (question_categories.length === 0) return <div>{t("no_interviews_found")}</div>;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("interview_remove")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("interview_remove_confirm")}</Modal.Body>
        <Modal.Footer className="justify-content-center">
          <ConfirmCloseButton handleClose={handleClose} />
          <ConfirmRemoveButton handleDelete={handleDelete} />
        </Modal.Footer>
      </Modal>

      <ReactTable columns={columns} data={question_categories} url={"/interviews"} id="question_category_id" handleShow={handleShow} />
    </>
  );
};

export default InterviewsTable;
