export default interface Comment {
  comment_id: number;
  date: Date;
  date_string: string;
  text: string;
  name: string;
  surname: string;
  author: string;
  feedback: boolean;
  start_feedback: string;
  end_feedback: string;
  likes: number;
  video_id: number;
  author_email: string;
}
