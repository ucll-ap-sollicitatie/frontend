import type { NextPage } from "next";
import { useTranslations } from "next-intl";
import { FormEvent } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import Task from "../../interfaces/Task";

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  task?: Task;
}

const TaskForm: NextPage<Props> = ({ onSubmit, task }) => {
  const t = useTranslations("tasks");

  return (
    <>
      <Form onSubmit={onSubmit} className="col-md-12 col-lg-10 col-xl-8">
        <div className="d-flex gap-4 flex-wrap">
          <Stack gap={3}>
            <Form.Group controlId="task_title">
              <Form.Label>{t("task")}</Form.Label>
              <Form.Control type="text" placeholder={t("task")} defaultValue={task !== undefined ? task.title : ""} required />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>{t("description")}</Form.Label>
              <Form.Control type="text" placeholder={t("description")} defaultValue={task !== undefined ? task.description : ""} required />
            </Form.Group>

            <Form.Group controlId="deadline">
              <Form.Label>{t("deadline")}</Form.Label>
              <Form.Control type="date" placeholder={t("Deadline")} required />
            </Form.Group>
          </Stack>
        </div>

        <Button variant="primary" type="submit" className="mt-3">
          {task ? t("task_update") : t("task_add")}
        </Button>
      </Form>
    </>
  );
};

export default TaskForm;
