import type { Identifier, XYCoord } from "dnd-core";
import type { NextPage } from "next";
import { useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";
import { BsArrowsExpand, BsFillTrashFill } from "react-icons/bs";

const style = {
  cursor: "move",
};

interface Props {
  id: number;
  index: number;
  moveQuestionInput: (dragIndex: number, hoverIndex: number) => void;
  showDeleteQuestionInputModal: (id: number) => void;
  question: string;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const QuestionInput: NextPage<Props> = ({ id, index, moveQuestionInput, showDeleteQuestionInputModal, question }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "questionInput",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveQuestionInput(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "questionInput",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  drag(drop(ref));

  return (
    <div>
      <div style={{ opacity }} className="d-flex gap-2">
        <div className="w-100">
          <Form.Group controlId={`question${id + 1}`}>
            <div className="d-flex align-items-center gap-2">
              <div id="drag" ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
                <BsArrowsExpand />
              </div>
              <Form.Control type="text" placeholder="Vraag" defaultValue={question} required />
            </div>
          </Form.Group>
        </div>
        <Button onClick={() => showDeleteQuestionInputModal(id)} variant="danger">
          <BsFillTrashFill />
        </Button>
      </div>
    </div>
  );
};

export default QuestionInput;

QuestionInput.defaultProps = {
  question: "",
};
