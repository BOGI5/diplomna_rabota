import { useProjectContext } from "../../../contexts/ProjectContext";
import StageColumn from "./stage/StageColumn";
import AddStage from "./stage/AddStage";
import TaskCard from "./task/TaskCard";
import AddTask from "./task/AddTask";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useState } from "react";
import Stage from "../../../interfaces/stage.interface";
import { createPortal } from "react-dom";
import ApiService from "../../../services/api";
import Task from "../../../interfaces/task.interface";

export default function KanbanBoard() {
  const { project, permissions, updateProjectData } = useProjectContext();
  const [activeStage, setActiveStage] = useState<Stage | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const apiService = new ApiService();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } })
  );

  return (
    <div
      className="flex flex-column gap-5 justify-content-between"
      style={{ height: "calc(100vh - 188px)" }}
    >
      <DndContext
        sensors={sensors}
        onDragStart={(event: DragStartEvent) => {
          if (event.active.data.current?.type === "stage") {
            setActiveStage(event.active.data.current.stage);
            console.log(event);
            return;
          }
          if (event.active.data.current?.type === "task") {
            setActiveTask(event.active.data.current.task);
            console.log(event);
            return;
          }
        }}
        onDragOver={async (event: DragOverEvent) => {
          const { active, over } = event;

          if (active.id === over?.id) return;

          const isActiveTask = active.data.current?.type === "task";
          const isOverTask = over?.data.current?.type === "task";

          if (!isActiveTask) return;

          // task over task
          if (isActiveTask && isOverTask && project) {
            const activeStage = project.stages.findIndex(
              (stage) => stage.id === active.data.current?.task.stageId
            );
            const overStage = project.stages.findIndex(
              (stage) => stage.id === over?.data.current?.task.stageId
            );
            let activeIndex = project.stages[activeStage].tasks.findIndex(
              (task) => task.id === active.data.current?.task.id
            );
            const overIndex = project.stages[overStage].tasks.findIndex(
              (task) => task.id === over?.data.current?.task.id
            );

            console.log(activeStage, overStage, activeIndex, overIndex);
            // change stage
            if (activeStage !== overStage) {
              const task = project.stages[activeStage].tasks[activeIndex];
              const destStage = project.stages[overStage];
              if (task) {
                await apiService.patch(
                  `/projects/${project.id}/stages/${
                    task.stageId || "unstaged"
                  }/tasks/${task.id}`,
                  {
                    destinationStageId: destStage.id,
                  }
                );
                task.stageId = destStage.id;
                project.stages[activeStage].tasks.splice(activeIndex, 1);
                project.stages[overStage].tasks.push(task);
                activeIndex = project.stages[overStage].tasks.length - 1;
              }
            }

            if (activeIndex !== -1 && overIndex !== -1) {
              project.stages[overStage].tasks = arrayMove(
                project.stages[overStage].tasks,
                activeIndex,
                overIndex
              );
              await apiService.patch(
                `/projects/${project.id}/stages/${project.stages[overStage].id}/order`,
                {
                  taskOrder: project.stages[overStage].tasks.map(
                    (task) => task.id
                  ),
                }
              );
              updateProjectData();
            }
          }

          // task over stage
          const isOverStage = over?.data.current?.type === "stage";
          if (isActiveTask && isOverStage && project) {
            await apiService.patch(
              `/projects/${project.id}/stages/${
                active.data.current?.task.stageId || "unstaged"
              }/tasks/${active.data.current?.task.id}`,
              {
                destinationStageId: over?.data.current?.stage.id,
              }
            );
            updateProjectData();
          }

          // task over unstaged
          if (
            isActiveTask &&
            project &&
            project.stages.findIndex(
              (stage) => stage.id === over?.data.current?.task.stageId
            ) === -1
          ) {
            const task = project.stages
              .find((stage) => stage.id === active.data.current?.task.stageId)
              ?.tasks.find((task) => task.id === active.data.current?.task.id);
            if (task) {
              await apiService.patch(
                `/projects/${project.id}/stages/${task.stageId}/tasks/${task.id}/unstage`
              );
              updateProjectData();
            }
          }
        }}
        onDragEnd={async (event: DragEndEvent) => {
          if (activeStage) {
            setActiveStage(null);
            if (event.over?.id && event.active.id && project?.stages) {
              const activeIndex = project.stages.findIndex(
                (stage) => stage.id === event.active.data.current?.stage.id
              );
              const overIndex = project.stages.findIndex(
                (stage) => stage.id === event.over?.data.current?.stage.id
              );
              if (activeIndex !== -1 && overIndex !== -1) {
                project.stages = arrayMove(
                  project.stages,
                  activeIndex,
                  overIndex
                );
                await apiService.patch(
                  `/projects/${project?.id}/stages/order`,
                  {
                    stageOrder: project.stages.map((stage) => stage.id),
                  }
                );
                updateProjectData();
              }
            }
          } else if (activeTask) {
            setActiveTask(null);
          }
        }}
      >
        <div
          style={{ height: "70%" }}
          className="flex flex-row gap-5 align-items-start justify-content-start"
        >
          <SortableContext
            items={project?.stages.map((stage) => stage.id) || []}
          >
            {project?.stages.map((stage) => (
              <StageColumn key={stage.id} {...stage} />
            ))}
          </SortableContext>
          {permissions > 0 && <AddStage />}
          {createPortal(
            <DragOverlay>
              {activeStage && <StageColumn {...activeStage} />}
              {activeTask && <TaskCard {...activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </div>
        <div
          style={{ height: "30%" }}
          className="flex flex-row gap-5 align-items-center justify-content-start border-3 border-round border-0 p-3"
        >
          <div className="flex flex-column gap-3 border-right-2 pr-4 pl-2 align-items-center">
            <h2 className="my-0">Unstaged</h2>
            {permissions > 0 && <AddTask stageId={undefined} />}
          </div>
          {project?.unstagedTasks.map((task) => (
            <TaskCard key={task.id} {...task} />
          ))}
        </div>
      </DndContext>
    </div>
  );
}
