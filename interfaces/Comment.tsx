export default interface Comment {
  comment_id: number;
  date: Date;
  text: string;
  name: string;
  surname: string;
  author: string;
  feedback: boolean;
  likes: number;
}
