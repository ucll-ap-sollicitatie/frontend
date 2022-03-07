import { NextPage } from "next";
import { Accordion, Tab, Tabs } from "react-bootstrap";
import Comment from "../../interfaces/Comment";
import User from "../../interfaces/User";
import videos from "../../pages/videos";
import CommentsTable from "../comments/CommentsTable";
import UsersTable from "../users/UsersTable";

interface Props {
  users: User[];
  comments: Comment[];
  t: any;
}

const AdminView: NextPage<Props> = ({ users, comments, t }) => {
  const countRole = (role: string) => {
    if (users.length > 0) {
      const temp = users.filter((user: User) => user.role === role);
      return temp.length;
    }
    return 0;
  };

  const countFeedback = () => {
    if (comments.length > 0) {
      const temp = comments.filter((comment: Comment) => comment.feedback);
      return temp.length;
    }
    return 0;
  };

  return (
    <>
      <p>{t("admin_view_index")}</p>
      <Tabs defaultActiveKey="start" id="uncontrolled-tab">
        <Tab eventKey="start" title={t("server_information")}>
          <Accordion>
            <Accordion.Item eventKey="0" className="rounded-0">
              <Accordion.Header>{t("users")}</Accordion.Header>
              <Accordion.Body>
                {t("amount_of_users")}: {users !== null ? users.length : t("none")}
                <hr />
                <ul className="mt-3 mb-0">
                  <li>
                    {t("amount_of_admins")}: {countRole("Admin")}
                  </li>
                  <li>
                    {t("amount_of_lecturers")}: {countRole("Lector")}
                  </li>
                  <li>
                    {t("amount_of_students")}: {countRole("Student")}
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>{t("comments")}</Accordion.Header>
              <Accordion.Body>
                <ul className="mb-0">
                  <li>
                    {t("amount_of_comments")}: {comments !== null ? comments.length - countFeedback() : <p>{t("none")}</p>}
                  </li>
                  <li>
                    {t("amount_of_feedback")}: {comments !== null ? countFeedback() : <p>{t("none")}</p>}
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>{t("videos")}</Accordion.Header>
              <Accordion.Body>
                <ul className="mb-0">
                  <li>
                    {t("amount_of_videos")}: {videos !== null ? videos.length : <p>{t("none")}</p>}
                  </li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Tab>
        <Tab eventKey="profile" title={t("users_overview")}>
          <UsersTable />
        </Tab>
        <Tab eventKey="contact" title={t("comments_overview")}>
          {comments === null && <p>{t("none")}</p>}
          {comments !== null && <CommentsTable comments={comments} />}
        </Tab>
      </Tabs>
    </>
  );
};

export default AdminView;
