import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { DataScroller } from "primereact/datascroller";
import AddMembersModal from "./AddMembersModal";
import { useState } from "react";
import { useProjectContext } from "../contexts/ProjectContext";
import Member from "../interfaces/member.interface";

export default function ProjectMembers() {
  const [visible, setVisible] = useState(false);
  const { project, isAdmin, currentMember } = useProjectContext();

  const memberTemplate = (member: Member) => {
    return (
      <div className="flex flex-row justify-content-between align-items-center">
        <div className="flex flex-row align-items-center gap-3 my-2">
          <Avatar
            style={{ backgroundColor: "transparent" }}
            image={member.user.picture}
            shape="circle"
            size="xlarge"
            icon="pi pi-user"
          />

          <h2>{member.user.firstName + " " + member.user.lastName}</h2>
          <Tag
            value={member.memberType}
            severity={member.memberType === "Admin" ? "warning" : "info"}
          />
          {currentMember?.user.id === member.user.id && (
            <Tag value="You" severity="success" />
          )}
        </div>
        <div className="flex flex-row gap-3">
          {currentMember?.user.id === member.user.id && (
            <Button
              label="Leave project"
              icon="pi pi-sign-out"
              severity="warning"
              outlined
              disabled={member.memberType === "Admin"}
            />
          )}
          {isAdmin && (
            <Button
              label="Remove"
              icon="pi pi-trash"
              severity="danger"
              outlined
              disabled={member.memberType === "Admin"}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-column gap-2">
      <div className="flex flex-row justify-content-between align-items-center">
        <h1>Members</h1>
        {isAdmin && (
          <>
            <AddMembersModal visible={visible} setVisible={setVisible} />
            <Button
              label="Add member"
              icon="pi pi-plus"
              onClick={() => setVisible(true)}
            />
          </>
        )}
      </div>
      <DataScroller
        value={project?.members}
        itemTemplate={memberTemplate}
        inline
        rows={6}
        scrollHeight="28.5rem"
      />
    </div>
  );
}
