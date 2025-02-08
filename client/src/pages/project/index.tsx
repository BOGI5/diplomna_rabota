import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import KanbanBoard from "../../components/project/kanban";
import ProjectSettings from "../../components/project/settings";
import ProjectMembers from "../../components/project/members";
import { useAuthContext } from "../../contexts/AuthContext";
import { useProjectContext } from "../../contexts/ProjectContext";
import ApiService from "../../services/api";

export default function Project() {
  const { user } = useAuthContext();
  const apiService = new ApiService();
  const { id } = useParams<{ id: string }>();
  const { permissions, setProjectData } = useProjectContext();

  useEffect(() => {
    if (user === null) return;
    apiService.get(`/projects/${id}`).then((res) => {
      setProjectData(res.data, user);
    });
  }, [id]);

  return (
    <div
      className="mt-2"
      style={{ backgroundColor: "var(--surface-card)", borderRadius: "6px" }}
    >
      <TabView>
        <TabPanel header="Board" leftIcon="pi pi-objects-column mr-2">
          <KanbanBoard />
        </TabPanel>
        <TabPanel header="Members" leftIcon="pi pi-users mr-2">
          <ProjectMembers />
        </TabPanel>
        {permissions > 1 && (
          <TabPanel header="Settings" leftIcon="pi pi-sliders-h mr-2">
            <ProjectSettings />
          </TabPanel>
        )}
      </TabView>
    </div>
  );
}
