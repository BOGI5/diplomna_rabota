import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { DataScroller } from "primereact/datascroller";

interface Member {
  id: number;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  };
  memberType: string;
}

export default function ProjectMembers(props: { members: Member[] }) {
  return (
    <div className="flex flex-column gap-2">
      <div className="flex flex-row justify-content-between align-items-center">
        <h1>Members</h1>
        <Button label="Add member" icon="pi pi-plus" />
      </div>
      <DataScroller
        value={props.members}
        itemTemplate={memberTemplate}
        inline
        rows={5}
        scrollHeight="500px"
      />
    </div>
  );
}

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
      </div>
      <Button label="Remove" icon="pi pi-trash" severity="danger" outlined />
    </div>
  );
};
