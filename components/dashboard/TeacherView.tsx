import { NextPage } from "next";
import Link from "next/link";
import { Button, Tab, Tabs } from "react-bootstrap";
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
      <Tabs defaultActiveKey="students" id="uncontrolled-tab" className="mb-3">
        <Tab eventKey="students" title={t("my_students")}>
          <StudentsTable />
        </Tab>
        <Tab eventKey="tasks" title={t("tasks")}>
          <Link href={`/tasks/add`} passHref>
            <Button className="mb-3">{t("task_add")}</Button>
          </Link>
          <TasksTable allTasks={tasks} />
        </Tab>
      </Tabs>
    </>
  );
};

export default TeacherView;
