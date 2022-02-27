import type { NextPage } from "next";
import { FormEvent } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import Task from "../../interfaces/Task";

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  task?: Task;
}

const TaskForm: NextPage<Props> = ({ onSubmit, task }) => {
  return (
    <>
      <Form onSubmit={onSubmit} className="col-md-12 col-lg-10 col-xl-8">
        <div className="d-flex gap-4 flex-wrap">
          <Stack gap={3}>
            <Form.Group controlId="title">
              <Form.Label>Titel</Form.Label>
              <Form.Control type="text" placeholder="Titel" defaultValue={task !== undefined ? task.title : ""} required />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Beschrijving</Form.Label>
              <Form.Control type="text" placeholder="Beschrijving" defaultValue={task !== undefined ? task.description : ""} required />
            </Form.Group>

            <Form.Group controlId="deadline">
              <Form.Label>Deadline datum</Form.Label>
              <Form.Control type="date" placeholder="Deadline" required />
            </Form.Group>
          </Stack>
        </div>

        <Button variant="primary" type="submit" className="mt-3">
          {task ? "Taak aanpassen" : "Aanmaken"}
        </Button>
      </Form>
    </>
  );
};

export default TaskForm;
