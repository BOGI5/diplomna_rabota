import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar } from "primereact/avatar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
import { useProjectContext } from "../contexts/ProjectContext";
import { useNotificationContext } from "../contexts/NotificationContext";
import Member from "../interfaces/member.interface";
import User from "../interfaces/user.interface";
import ApiService from "../services/api";
import environment from "../environment";

export default function AddMembersModal({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { project, updateProjectData } = useProjectContext();
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [users, setUsers] = useState([]);
  const apiService = new ApiService();
  const { showMessage } = useNotificationContext();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    apiService.get(environment.getAll).then((response) => {
      setUsers(
        response.data.filter(
          (user: User) =>
            !project?.members.some(
              (member: Member) => member.user.id === user.id
            )
        )
      );
    });
  }, []);

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
        onHide={() => setVisible(false)}
        draggable={false}
        header="Add members"
      >
        <form
          className="mt-1 flex flex-column justify-content-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (selectedUsers.length === 0) {
              showMessage({
                severity: "error",
                summary: "Error",
                detail: "Please select at least one user",
              });
            }
            for (const selectedUser of selectedUsers) {
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
                });
            }
            apiService.get(`projects/${project?.id}`).then((res) => {
              updateProjectData(res.data);
            });
            setVisible(false);
          }}
        >
          <MultiSelect
            filter
            placeholder="Select users"
            display="chip"
            optionLabel="firstName"
            options={users}
            value={selectedUsers}
            onChange={(e) => setSelectedUsers(e.value)}
            itemTemplate={userTemplate}
          />
          <div className="flex flex-row gap-3">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="danger"
              type="reset"
              onClick={() => setVisible(false)}
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
