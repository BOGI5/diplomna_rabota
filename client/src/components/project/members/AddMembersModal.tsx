import { useParams } from "react-router-dom";
import { useState } from "react";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { useProjectContext } from "../../../contexts/ProjectContext";
import { useNotificationContext } from "../../../contexts/NotificationContext";
import User from "../../../interfaces/user.interface";
import ApiService from "../../../services/api";

export default function AddMembersModal({
  availableUsers,
  visible,
  setVisible,
}: {
  availableUsers: User[];
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const apiService = new ApiService();
  const { updateProjectData } = useProjectContext();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { showMessage } = useNotificationContext();
  const { id } = useParams<{ id: string }>();

  const userTemplate = (user: User) => {
    return (
      <div className="flex flex-row gap-3 align-items-center">
        <Avatar
          style={{ backgroundColor: "transparent" }}
          image={user.picture}
          shape="circle"
          icon="pi pi-user"
        />
        <h3>{user.firstName + " " + user.lastName}</h3>
      </div>
    );
  };

  return (
    <>
      <Dialog
        visible={visible}
        onHide={() => {
          setSelectedUsers([]);
          setVisible(false);
        }}
        draggable={false}
        header="Add members"
      >
        <form
          className="mt-1 flex flex-column justify-content-center gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (selectedUsers.length === 0) {
              showMessage({
                severity: "error",
                summary: "Error",
                detail: "Please select at least one user",
              });
            }
            await Promise.all(
              selectedUsers.map((selectedUser) =>
                apiService
                  .post(`/projects/${id}/members`, {
                    userId: selectedUser.id,
                    memberType: "User",
                  })
                  .catch((error) => {
                    showMessage({
                      severity: "error",
                      summary: "Error",
                      detail: error.response.data.message,
                    });
                  })
              )
            );
            setSelectedUsers([]);
            updateProjectData();
            setVisible(false);
          }}
        >
          <MultiSelect
            filter
            placeholder="Select users"
            display="chip"
            optionLabel="name"
            options={availableUsers}
            value={selectedUsers}
            onChange={(e) => setSelectedUsers(e.value)}
            itemTemplate={userTemplate}
            style={{ maxWidth: "75vw" }}
          />
          <div className="flex flex-row gap-3">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="danger"
              type="reset"
              onClick={() => {
                setSelectedUsers([]);
                setVisible(false);
              }}
              text
              raised
            />
            <Button label="Add" icon="pi pi-plus" type="submit" />
          </div>
        </form>
      </Dialog>
    </>
  );
}
