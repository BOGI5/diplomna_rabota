import { useState, useEffect } from "react";
import TaskCard from "../../components/project/kanban/task/TaskCard";
import ApiService from "../../services/api";
import Listing from "../../components/Listing";
import Task from "../../interfaces/task.interface";

export default function Tasks() {
  const apiService = new ApiService();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    apiService.get("/me/tasks").then((res) => {
      setTasks(res.data);
    });
  }, []);

  return (
    <Listing
      itemTemplate={TaskCard}
      items={tasks}
      width="100%"
      height="calc(100vh - 100px)"
    />
  );
}
