import type { NextPage } from "next";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { XYCoord, Identifier } from "dnd-core";
import { Button, Form } from "react-bootstrap";
import { BsArrowsExpand } from "react-icons/bs";
import { BsFillTrashFill } from "react-icons/bs";

const style = {
  cursor: "move",
};

interface Props {
  id: number;
  index: number;
  moveQuestionInput: (dragIndex: number, hoverIndex: number) => void;
  deleteQuestionInput: (id: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const QuestionInput: NextPage<Props> = ({ id, index, moveQuestionInput, deleteQuestionInput }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "test",
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
    type: "test",
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div id="drag" ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <div className="d-flex gap-2">
        <div className="w-100">
          <Form.Group controlId={`question${id}`}>
            <div className="d-flex align-items-center gap-2">
              <BsArrowsExpand />
              <Form.Control type="text" placeholder="Vraag" required />
            </div>
          </Form.Group>
        </div>
        <Button onClick={() => deleteQuestionInput(id)} variant="danger">
          <BsFillTrashFill />
        </Button>
      </div>
    </div>
  );
};

export default QuestionInput;
