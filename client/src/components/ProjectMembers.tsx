import { useState } from "react";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { useProjectContext } from "../contexts/ProjectContext";
import AddMembersModal from "./AddMembersModal";
import EditMemberModal from "./EditMemberModal";
import Member from "../interfaces/member.interface";
import User from "../interfaces/user.interface";
import ApiService from "../services/api";
import environment from "../environment";
import Listing from "./Listing";

export default function ProjectMembers() {
  const apiService = new ApiService();
  const [addMember, setAddMember] = useState<boolean>(false);
  const [editMember, setEditMember] = useState<Member | undefined>(undefined);
  const [users, setUsers] = useState<User[]>([]);
  const { project, permissions, currentMember } = useProjectContext();
  const [smallScreen, setSmallScreen] = useState<boolean>(
    window.innerWidth < 600
  );
  const [extraSmallScreen, setExtraSmallScreen] = useState<boolean>(
    window.innerWidth < 400
  );

  window.onresize = () => {
    setSmallScreen(window.innerWidth < 600);
    setExtraSmallScreen(window.innerWidth < 400);
  };

  const header = (
    <div className="flex flex-column gap-3">
      <div className="flex flex-row justify-content-between align-items-center">
        <h1>Members</h1>
        {permissions > 0 && (
          <>
            <AddMembersModal
              availableUsers={users}
              visible={addMember}
              setVisible={setAddMember}
            />
            <Button
              label={extraSmallScreen ? "" : "Add member"}
              icon="pi pi-plus"
              onClick={async () => {
                await apiService.get(environment.getAll).then((response) => {
                  setUsers(
                    response.data
                      .filter(
                        (user: User) =>
                          !project?.members.some(
                            (member: Member) => member.user.id === user.id
                          )
                      )
                      .map((user: User) => {
                        return {
                          ...user,
                          name: user.firstName + " " + user.lastName,
                        };
                      })
                  );
                });
                setAddMember(true);
              }}
            />
          </>
        )}
      </div>
    </div>
  );

  const memberTemplate = (member: Member) => {
    return (
      <div className="flex flex-row justify-content-between align-items-center">
        <div
          className={`flex flex-row align-items-center gap-${
            extraSmallScreen ? 1 : 3
          } my-2`}
        >
          <Avatar
            style={{ backgroundColor: "transparent" }}
            image={member.user.picture}
            shape="circle"
            size={smallScreen ? "large" : "xlarge"}
            icon="pi pi-user"
          />

          <h2>{member.user.firstName + " " + member.user.lastName}</h2>

          <Tag
            value={member.memberType}
            severity={
              member.memberType === "Owner"
                ? "danger"
                : member.memberType === "Admin"
                ? "warning"
                : "info"
            }
          />
          {currentMember?.user.id === member.user.id && (
            <Tag value="You" severity="success" />
          )}
        </div>

        <div className="flex flex-row gap-3 mr-2">
          <Button
            outlined
            icon="pi pi-info-circle"
            severity="secondary"
            onClick={() => setEditMember(member)}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <EditMemberModal member={editMember} setMember={setEditMember} />
      <Listing<Member>
        items={project?.members || []}
        header={header}
        itemTemplate={memberTemplate}
        height="calc(100vh - 270px)"
      />
    </>
  );
}
