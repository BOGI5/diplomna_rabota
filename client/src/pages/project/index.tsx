import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import ProjectKanbanBoard from "../../components/ProjectKanbanBoard";
import ProjectSettings from "../../components/ProjectSettings";
import ProjectOverview from "../../components/ProjectOverview";
import ProjectMembers from "../../components/ProjectMembers";
import ProjectTasks from "../../components/ProjectTasks";
import { useAuthContext } from "../../contexts/AuthContext";
import { useProjectContext } from "../../contexts/ProjectContext";
import ApiService from "../../services/api";

export default function Project() {
  const { user } = useAuthContext();
  const apiService = new ApiService();
  const { id } = useParams<{ id: string }>();
  const { isAdmin, setProjectData } = useProjectContext();

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
        <TabPanel header="Overview" leftIcon="pi pi-align-justify mr-2">
          <ProjectOverview />
        </TabPanel>
        <TabPanel header="Board" leftIcon="pi pi-objects-column mr-2">
          <ProjectKanbanBoard />
        </TabPanel>
        <TabPanel header="Tasks" leftIcon="pi pi-clipboard mr-2">
          <ProjectTasks />
        </TabPanel>
        <TabPanel header="Members" leftIcon="pi pi-users mr-2">
          <ProjectMembers />
        </TabPanel>
        {isAdmin && (
          <TabPanel header="Settings" leftIcon="pi pi-sliders-h mr-2">
            <ProjectSettings />
          </TabPanel>
        )}
      </TabView>
    </div>
  );
}
