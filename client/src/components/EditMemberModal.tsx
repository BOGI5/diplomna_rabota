import { Dialog } from "primereact/dialog";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useProjectContext } from "../contexts/ProjectContext";
import Member from "../interfaces/member.interface";
import ApiService from "../services/api";

export default function EditMemberModal({
  member,
  setMember,
}: {
  member: Member | undefined;
  setMember: (visible: Member | undefined) => void;
}) {
  const apiService = new ApiService();
  const { updateProjectData } = useProjectContext();
  const { permissions, currentMember } = useProjectContext();
  const canEdit =
    (member?.memberType === "Admin" && permissions < 2) ||
    member?.memberType === "Owner" ||
    permissions < 1;

  return (
    <Dialog
      header="Edit member"
      visible={member !== undefined}
      onHide={() => setMember(undefined)}
      draggable={false}
    >
      <div className="flex flex-column gap-3">
        <div className="flex flex-row gap-3 align-items-center">
          <Avatar
            style={{ backgroundColor: "transparent" }}
            image={member?.user.picture}
            icon="pi pi-user"
            size="large"
            shape="circle"
          />
          <h2>
            {member?.user.firstName} {member?.user.lastName}
          </h2>
        </div>

        <div className="flex flex-row gap-3">
          {member?.id === currentMember?.id ? (
            <>
              <Button
                label={`You're an ${currentMember?.memberType}`}
                severity={
                  currentMember?.memberType === "Owner"
                    ? "danger"
                    : currentMember?.memberType === "Admin"
                    ? "warning"
                    : "info"
                }
                disabled
                outlined
              />

              <Button
                icon="pi pi-sign-out"
                severity="danger"
                outlined
                disabled={currentMember?.memberType === "Owner"}
                onClick={async () => {
                  await apiService.delete(
                    `/projects/${currentMember?.projectId}/leave`
                  );
                  window.location.href = "/";
                }}
              />
            </>
          ) : (
            <>
              <Button
                onClick={async () => {
                  if (member?.memberType === "Admin") {
                    await apiService.post(
                      `/projects/${member?.projectId}/transfer-ownership`,
                      {
                        newOwnerId: member?.id,
                      }
                    );
                    if (member) {
                      member.memberType = "Owner";
                    }
                  } else {
                    await apiService.patch(
                      `/projects/${member?.projectId}/members/${member?.id}/promote`,
                      {}
                    );
                    if (member) {
                      member.memberType = "Admin";
                    }
                  }
                  updateProjectData();
                }}
                label={
                  member?.memberType === "Owner"
                    ? "Project owner"
                    : member?.memberType === "Admin"
                    ? permissions < 2
                      ? "Admin"
                      : "Transfer ownership"
                    : permissions < 1
                    ? "User"
                    : "Promote to Admin"
                }
                icon={
                  (member?.memberType === "User" && permissions > 0) ||
                  permissions > 1
                    ? "pi pi-angle-double-up"
                    : "pi pi-user"
                }
                severity={
                  member?.memberType === "Owner"
                    ? "danger"
                    : member?.memberType === "Admin"
                    ? "warning"
                    : "info"
                }
                disabled={canEdit}
                outlined
              />

              {member?.memberType === "Admin" && permissions > 1 && (
                <Button
                  onClick={async () => {
                    await apiService.patch(
                      `/projects/${member?.projectId}/members/${member?.id}/demote`,
                      {}
                    );
                    if (member) {
                      member.memberType = "User";
                    }
                    updateProjectData();
                  }}
                  label="Demote to User"
                  icon="pi pi-angle-double-down"
                  iconPos="right"
                  severity="info"
                  outlined
                />
              )}

              <Button
                icon="pi pi-trash"
                severity="danger"
                outlined
                disabled={canEdit}
                onClick={async () => {
                  await apiService.delete(
                    `/projects/${member?.projectId}/members/${member?.id}`
                  );
                  updateProjectData();
                  setMember(undefined);
                }}
              />
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
}
