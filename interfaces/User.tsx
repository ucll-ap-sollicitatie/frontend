export default interface User {
  user_id: number;
  name: string;
  surname: string;
  email: string;
  image: string;
  hashed_password: string;
  role: string;
  formation: string;
  activation_token: string;
  token_expiration_date: string;
  last_login: Date;
}
