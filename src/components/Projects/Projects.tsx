import { useEffect, useState } from "react";
import { ProjectFilter } from "./ProjectFilter";
import { NoProject } from "../icons/project/NoProject";
import { useNavigate } from "@tanstack/react-router";
import { Card } from "../ui/card";
import { Database, Globe, Zap } from "lucide-react";
import { VioletTab } from "../icons/project/VioletTab";
import { GetProjectsAPI } from "~/http/services/projects";
import { services } from "./NewProject";

export function Projects(){
    const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
    const navigate = useNavigate();
    const limit = 10;
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        let cancelled = false;
    
        async function fetchProjects(page = 1, allData: any[] = []) {
          const res = await GetProjectsAPI({ page, limit });
          const currentProjects = res?.data ?? [];
          const pagination = res?.data?.pagination_info;
    
          const newData = [...allData, ...currentProjects];
    
          if (pagination?.next_page && !cancelled) {
            return fetchProjects(pagination.next_page, newData);
          }
          return newData;
        }
    
        fetchProjects().then((data) => {
          if (!cancelled) setProjects(data);
        });
    
        return () => {
          cancelled = true;
        };
      }, []);

    return(
        <div className="bg-white flex flex-col gap-4 w-[99%] rounded-md mx-auto h-[calc(100vh-65px)] overflow-hidden">
        <ProjectFilter viewMode={viewMode} setViewMode={setViewMode} />
        <div className="flex gap-2 px-3 w-full flex-wrap overflow-auto">
            {projects.map((project, index) => (
                <Card
                    key={index}
                    className="flex flex-col items-center gap-1.5 w-[365px] p-3 shadow-none"
                >
                    <div className="flex items-center justify-between w-full">
                        <p className="text-[#5D5D5D] text-base 3xl:!text-xl font-medium">{project.title}</p>
                        <p className={`rounded-full px-2 text-[13px] 3xl:!text-base font-normal ${project.management_type === "MANAGED" ? "text-[#2F80ED] bg-[rgba(47,128,237,0.10)] border border-[#2F80ED]" : "text-[#399761] border border-[#399761] bg-[rgba(57,151,97,0.10)]"}`}>
                            {project.management_type.charAt(0).toUpperCase() + project.management_type.slice(1).toLowerCase()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 w-full p-2 bg-[#F9FAFB] rounded-sm mt-1">
                        <div className="w-5 h-5 flex items-center">
                            {services.find((service) => service.value === project.compatibility_services)?.icon}
                        </div>
                        <p className="text-[#5D5D5D] text-[13px] 3xl:!text-base font-medium">
                            {services.find((service) => service.value === project.compatibility_services)?.name}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-1 w-full">
                        <div className="bg-[#F9FAFB] p-2 rounded-sm flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                            <Globe className="text-[#2F80ED] w-3 h-3"/>
                            <p className="text-[#888] text-center text-[13px] 3xl:!text-base font-normal leading-[100%]">Region:</p>
                            </div>
                            <p className="text-[#5D5D5D] text-sm 3xl:!text-base font-medium">{project.region}</p>
                        </div>
                        <div className="bg-[#F9FAFB] p-2 rounded-sm flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                            <Database className="text-[#339900] w-3 h-3"/>
                            <p className="text-[#888] text-center text-[13px] 3xl:!text-base font-normal leading-[100%]">Storage Type:</p>
                            </div>
                            <p className="text-[#5D5D5D] text-sm 3xl:!text-base font-medium">{project.storage_type}</p>
                        </div>
                        <div className="bg-[#F9FAFB] p-2 rounded-sm flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                            <VioletTab />
                            <p className="text-[#888] text-center text-[13px] 3xl:!text-base font-normal leading-[100%]">Max File Size:</p>
                            </div>
                            <p className="text-[#5D5D5D] text-sm 3xl:!text-base font-medium">{project.max_file_size}</p>
                        </div>
                        <div className="bg-[#F9FAFB] p-2 rounded-sm flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                            <Zap className="text-[#FF881F] w-3 h-3"/>
                            <p className="text-[#888] text-center text-[13px] 3xl:!text-base font-normal leading-[100%]">Integration Method:</p>
                            </div>
                            <p className="text-[#5D5D5D] text-sm 3xl:!text-base font-medium">{project.integration_method}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>

        {projects.length === 0 &&
        <div className="flex flex-col items-center justify-center gap-6 h-[calc(100vh-120px)]">
            <NoProject />
            <div className="flex flex-col items-center justify-center gap-1">
                <p className="text-[#5D5D5D] text-center text-xl 3xl:!text-2xl font-medium">No Projects Yet</p>
                <p className="text-[#6D6D6D] text-center text-[13px] 3xl:!text-base font-normal">Start organizing by clicking <span className="cursor-pointer" onClick={() => navigate({ to: "/projects/new-project" })}>"New Project"</span></p>
            </div>
        </div>
       }
    </div>
    )
}