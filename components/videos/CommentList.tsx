import type { NextPage } from "next";
import { Stack } from "react-bootstrap";
import Comment from "../../interfaces/Comment";
import User from "../../interfaces/User";
import CommentItem from "./CommentItem";

interface Props {
  comments: Comment[];
  user: User;
  handleSelect: Function;
  handleShowUpdate: Function;
  handleShowDelete: Function;
  handleAddLike: Function;
  handleRemoveLike: Function;
}

const CommentList: NextPage<Props> = ({ comments, user, handleSelect, handleShowUpdate, handleShowDelete, handleAddLike, handleRemoveLike }) => {
  return (
    <Stack gap={3}>
      {comments.map((comment: Comment) => (
        <CommentItem
          key={comment.comment_id}
          comment={comment}
          user={user}
          handleSelect={handleSelect}
          handleShowUpdate={handleShowUpdate}
          handleShowDelete={handleShowDelete}
          handleAddLike={handleAddLike}
          handleRemoveLike={handleRemoveLike}
        />
      ))}
    </Stack>
  );
};

export default CommentList;
