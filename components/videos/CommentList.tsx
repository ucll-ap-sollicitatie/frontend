import type { NextPage } from "next";
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

const CommentList: NextPage<Props> = ({
  comments,
  user,
  handleSelect,
  handleShowUpdate,
  handleShowDelete,
  handleAddLike,
  handleRemoveLike,
}) => {
  return comments.map((comment: Comment) => (
    <CommentItem
      comment={comment}
      user={user}
      handleSelect={handleSelect}
      handleShowUpdate={handleShowUpdate}
      handleShowDelete={handleShowDelete}
      handleAddLike={handleAddLike}
      handleRemoveLike={handleRemoveLike}
    />
  ));
};

export default CommentList;
