import { NextPage } from "next";
import { Tab, Tabs } from "react-bootstrap";
import Task from "../../interfaces/Task";
import TasksTable from "../tasks/TasksTable";
import StudentsTable from "../users/StudentsTable";

interface Props {
  tasks: Task[];
  t: any;
}

const TeacherView: NextPage<Props> = ({ tasks, t }) => {
  return (
    <>
      <p>{t("teacher_view_index")}</p>
      <Tabs defaultActiveKey="students" id="uncontrolled-tab">
        <Tab eventKey="students" title={t("my_students")}>
          <StudentsTable />
        </Tab>
        <Tab eventKey="tasks" title={t("tasks")}>
          {tasks ? <TasksTable allTasks={tasks} /> : <p>{t("no_tasks_found")}</p>}
        </Tab>
      </Tabs>
    </>
  );
};

export default TeacherView;
