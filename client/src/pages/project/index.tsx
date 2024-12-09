import { useParams } from "react-router-dom";
import { TabView, TabPanel } from "primereact/tabview";
import ProjectSettings from "../../components/ProjectSettings";
import { useEffect } from "react";
import ApiService from "../../services/api";
import ProjectMembers from "../../components/ProjectMembers";
import ProjectTasks from "../../components/ProjectTasks";
import ProjectOverview from "../../components/ProjectOverview";

export default function Project() {
  const apiService = new ApiService();
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    apiService.get(`/projects/${id}`).then((res) => {
      console.log(res.data);
    });
  }, [id]);
  return (
    <div
      className="mt-2"
      style={{ backgroundColor: "var(--surface-card)", borderRadius: "6px" }}
    >
      <TabView>
        <TabPanel header="Overview">
          <ProjectOverview />
        </TabPanel>
        <TabPanel header="Board"></TabPanel>
        <TabPanel header="Tasks">
          <ProjectTasks />
        </TabPanel>
        <TabPanel header="Members">
          <ProjectMembers />
        </TabPanel>
        <TabPanel header="Settings">
          <ProjectSettings />
        </TabPanel>
      </TabView>
    </div>
  );
}
