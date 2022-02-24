import type { NextPage } from "next";
import { Form } from "react-bootstrap";

interface Props {
  handleSort: () => void;
}

const SortInterviewsSelect: NextPage<Props> = () => {
  return (
    <Form.Group>
      <Form.Label>Rol</Form.Label>
      <Form.Select required>
        <option value="1">Schijt 1</option>
        <option value="2">Schijt 2</option>
        <option value="3">Schijt 3</option>
      </Form.Select>
    </Form.Group>
  );
};

export default SortInterviewsSelect;
