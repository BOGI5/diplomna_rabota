import { useState } from "react";
import EditTask from "./EditTask";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "primereact/button";
import { useSortable } from "@dnd-kit/sortable";
import Task from "../../../../interfaces/task.interface";

export default function TaskCard(task: Task) {
  const [visible, setVisible] = useState<boolean>(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: "task", task: task },
    disabled: visible,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    backgroundColor: !isDragging ? "var(--surface-50)" : undefined,
  };

  return (
    <div
      className={`border-2 border-${
        isDragging ? "primary bg-primary-reverse" : 0
      } border-round m-0 p-2 flex flex-column gap-2`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div
        style={{ height: "40px", width: "185px" }}
        className="flex flex-row mx-2 justify-content-between align-items-center"
      >
        {!isDragging && (
          <>
            <h2 className="m-0">{task.name}</h2>
            <Button
              text
              severity="secondary"
              rounded
              icon="pi pi-info-circle"
              onClick={() => setVisible(true)}
            />
            <EditTask task={task} visible={visible} setVisible={setVisible} />
          </>
        )}
      </div>
    </div>
  );
}
