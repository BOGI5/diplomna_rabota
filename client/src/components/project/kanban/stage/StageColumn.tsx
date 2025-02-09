import { useState } from "react";
import EditStage from "./EditStage";
import AddTask from "../task/AddTask";
import TaskCard from "../task/TaskCard";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "primereact/button";
import Stage from "../../../../interfaces/stage.interface";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useProjectContext } from "../../../../contexts/ProjectContext";

export default function StageColumn(stage: Stage) {
  const [visible, setVisible] = useState<boolean>(false);
  const { permissions } = useProjectContext();

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stage.id,
    data: { type: "stage", stage: stage },
    disabled: permissions === 0 || visible,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-column border-3 border-round border-${
        isDragging ? "primary bg-primary-reverse" : 0
      }`}
    >
      <div
        style={{
          width: "250px",
          minWidth: "250px",
          height: "calc(75vh - 188px)",
          backgroundColor: !isDragging ? "var(--surface-50)" : undefined,
        }}
        className="px-3 py-2"
      >
        {!isDragging && (
          <>
            <div className="flex flex-row justify-content-between align-items-center border-bottom-2 mb-3 pb-2">
              <h2 className="m-0">{stage.name}</h2>

              {permissions > 0 && (
                <>
                  <Button
                    text
                    rounded
                    severity="secondary"
                    icon="pi pi-cog"
                    onClick={() => setVisible(true)}
                  />
                  <EditStage
                    stage={stage}
                    visible={visible}
                    setVisible={setVisible}
                  />
                </>
              )}
            </div>

            <div className="flex flex-column gap-3">
              <p className="m-0">Tasks: {stage.tasks.length}</p>
              <div className="flex flex-column gap-3">
                <SortableContext items={stage.tasks.map((task) => task.id)}>
                  {stage.tasks.map((task) => {
                    return <TaskCard key={task.id} {...task} />;
                  })}
                </SortableContext>
              </div>
              {permissions > 0 && <AddTask stageId={stage.id} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
