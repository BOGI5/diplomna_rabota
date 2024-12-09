import { Button } from "primereact/button";
import { DataScroller } from "primereact/datascroller";

interface Member {
  id: number;
  firstName: string;
  lastName: string;
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
        header="Members"
      />
    </div>
  );
}

const memberTemplate = (member: Member) => {
  return (
    <div className="flex flex-row justify-content-between align-items-center">
      <div>
        <h2>{member.firstName + " " + member.lastName}</h2>
        <p>{member.memberType}</p>
      </div>
      <Button label="Remove" icon="pi pi-trash" />
    </div>
  );
};
