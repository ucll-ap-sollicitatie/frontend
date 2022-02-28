export default interface Comment {
  comment_id: number;
  date: Date;
  date_string: string;
  text: string;
  name: string;
  surname: string;
  author: string;
  feedback: boolean;
  likes: number;
  video_id: number;
}
