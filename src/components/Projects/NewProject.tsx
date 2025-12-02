import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "@tanstack/react-router";
import { Amazon } from "../icons/ServiceIcons/amazon";
import { HotSale } from "../icons/ServiceIcons/hotSale";
import { Cloud } from "../icons/ServiceIcons/cloud";
import { Rolling } from "../icons/ServiceIcons/rolling";
import { Line } from "../icons/ServiceIcons/line";
import { Camera } from "../icons/ServiceIcons/camera";
import { Social } from "../icons/ServiceIcons/social";
import { Cloudfare } from "../icons/ServiceIcons/cloudfare";
import { useMutation } from "@tanstack/react-query";
import { AddProjectsAPI } from "~/http/services/projects";
import { Loader2 } from "lucide-react";

export const services = [
  { icon: <Amazon />, name: "Amazon S3", value: "S3" },
  { icon: <HotSale />, name: "Backblaze B2", value: "B2" },
  { icon: <Cloud />, name: "Google Cloud Storage", value: "GCS" },
  { icon: <Rolling />, name: "Digital Ocean Spaces", value: "DIGITAL_OCEAN" },
  { icon: <Line />, name: "Linode", value: "LINODE" },
  { icon: <Camera />, name: "MinIO", value: "MinIO" },
  {
    icon: <Social />,
    name: "Microsoft Azure Blob Storage",
    value: "AZURE",
  },
  { icon: <Cloudfare />, name: "Cloudflare R2", value: "R2" },
];

type ProjectPayload = {
  title: string;
  compatibility_services: string;
  management_type?: string;
  key: string;
  secret_key: string;
  bucket_name: string;
  region: string;
};

const projectPayload: ProjectPayload = {
  title: "",
  compatibility_services: "",
  management_type: "",
  key: "",
  secret_key: "",
  bucket_name: "",
  region: "",
};

export function NewProject() {
  const [managementType, setManagementType] = useState("");
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string[]>([]);
  const [projectData, setProjectData] = useState(projectPayload);
  const [error, setError] = useState<{ [key: string]: string }>({});

  const { mutate: ProjectDetails, isPending: isProjectPending } = useMutation({
    mutationFn: async () => {
      const payload = { ...projectData };
      const response = await AddProjectsAPI(payload);
      return response;
    },
    onSuccess: (response) => {
      if (response?.status === 200) {
        navigate({ to: "/projects" });
        resetForm();
      }
    },
    onError: (err: any) => {
      setError(err?.errors || {message: err?.message});
    },
  });

  const resetForm = () => {
    setManagementType("");
    setSelectedService([]);
    setProjectData(projectPayload);
    setError({});
  };

  const handleCreateProject = () => {
    setError({});
    ProjectDetails();
  };
console.log(error.message);
  return (
    <div className="w-[99%] mx-auto bg-white rounded-md h-[calc(100vh-65px)] overflow-hidden">
      <div className="flex items-center justify-center">
        <Card className="w-[710px] py-4 border-none shadow-[0px_0px_12px_0px_rgba(0,0,0,0.09)] gap-4 mt-5 overflow-auto max-h-[calc(100vh-90px)]">
          <CardHeader className="px-4">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="name"
                className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
              >
                Project Tittle
              </Label>
              <Input
                id="name"
                placeholder="Enter Project Tittle"
                value={projectData.title}
                onChange={(e) =>
                  setProjectData({ ...projectData, title: e.target.value })
                }
                className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
              />
              {error?.title && (
                <p className="text-xs 3xl:!text-sm text-red-500">
                  {error.title}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="px-4">
          <div>
            <div className="flex flex-col gap-2">
              <Label className="text-[#6D6D6D] text-[13px] 3xl:!text-base font-normal">
                Compatibility Service
              </Label>
              <div className="flex items-center gap-4 flex-wrap p-1">
                {services.map((service, idx) => {
                  const isSelected = selectedService.includes(service.value);
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedService([service.value]);
                        setProjectData({
                          ...projectData,
                          compatibility_services: service.value,
                        });
                      }}
                      className={`flex flex-col shrink-0 items-center gap-2 border rounded-md w-38 h-19 p-2 cursor-pointer ${
                        isSelected ? "border-[#2F80ED]" : "border-[#D1D1D1]"
                      }`}
                    >
                      {service.icon}
                      <p className="text-black text-[13px] 3xl:!text-base text-center py-0 leading-[100%]">
                        {service.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            {error?.compatibility_services && (
              <p className="text-xs 3xl:!text-sm text-red-500">
                {error.compatibility_services}
              </p>
            )}
          </div>

          <div>
            <div className="flex flex-col gap-2">
              <Label className="text-[#6D6D6D] text-[13px] font-normal">
                Management Type
              </Label>

              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => {
                    setManagementType("managed");
                    setProjectData({
                      ...projectData,
                      management_type: "MANAGED",
                    });
                  }}
                  className={`rounded-sm border p-3 pl-4 pr-10 gap-2 cursor-pointer flex flex-col  ${
                    managementType === "managed"
                      ? "bg-[#2F80ED] text-white"
                      : "bg-[#F6F6F6] border-[#D1D1D1]"
                  }`}
                >
                  <p
                    className={`text-sm 3xl:!text-base leading-[100%]  ${
                      managementType === "managed"
                        ? "text-white font-light"
                        : "text-[#3D3D3D] font-medium"
                    }`}
                  >
                    Managed
                  </p>
                  <p
                    className={`text-[13px] 3xl:!text-sm leading-[130%] ${
                      managementType === "managed"
                        ? "text-[#E4E4E4] font-light"
                        : "text-[#6D6D6D] font-normal"
                    }`}
                  >
                    Automatically configured with default settings for optimal
                    performance, security, and compatibility. No setup needed.
                  </p>
                </div>

                <div
                  onClick={() => {
                    setManagementType("custom");
                    setProjectData({
                      ...projectData,
                      management_type: "CUSTOM",
                    });
                  }}
                  className={`rounded-sm border p-3 px-4 gap-2 cursor-pointer flex flex-col ${
                    managementType === "custom"
                      ? "bg-[#2F80ED] text-white"
                      : "bg-[#F6F6F6] border-[#D1D1D1]"
                  }`}
                >
                  <p
                    className={`text-sm 3xl:!text-base leading-[100%] ${
                      managementType === "custom"
                        ? "text-white font-light"
                        : "text-[#3D3D3D] font-medium"
                    }`}
                  >
                    Custom
                  </p>
                  <p
                    className={`text-[13px] 3xl:!text-sm leading-[130%] ${
                      managementType === "custom"
                        ? "text-[#E4E4E4] font-light"
                        : "text-[#6D6D6D] font-normal"
                    }`}
                  >
                    Configure your file manually by providing the required
                    details below. This option is ideal if you need specific
                    naming, storage, or access rules.
                  </p>
                </div>
              </div>
            </div>
            {error?.management_type && (
              <p className="text-xs 3xl:!text-sm text-red-500">
                {error.management_type}
              </p>
            )}
          </div>

          {managementType === "custom" && (
            <div className="gap-2 flex flex-col mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="key"
                    className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
                  >
                    Key
                  </Label>
                  <Input
                    id="key"
                    placeholder="Enter key"
                    value={projectData.key}
                    onChange={(e) =>
                      setProjectData({ ...projectData, key: e.target.value })
                    }
                    className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="secret_key"
                    className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
                  >
                    Secret Key
                  </Label>
                  <Input
                    id="secret_key"
                    placeholder="Enter secret key"
                    value={projectData.secret_key}
                    onChange={(e) =>
                      setProjectData({
                        ...projectData,
                        secret_key: e.target.value,
                      })
                    }
                    className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="bucket_name"
                  className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
                >
                  Bucket Name
                </Label>
                <Input
                  id="bucket_name"
                  placeholder="Enter bucket name"
                  value={projectData.bucket_name}
                  onChange={(e) =>
                    setProjectData({
                      ...projectData,
                      bucket_name: e.target.value,
                    })
                  }
                  className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="region"
                  className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
                >
                  Region
                </Label>
                <Input
                  id="region"
                  placeholder="Enter Region"
                  value={projectData.region}
                  onChange={(e) =>
                    setProjectData({ ...projectData, region: e.target.value })
                  }
                  className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
                />
              </div>
            </div>
          )}
          </CardContent>

          {error?.message && (
            <p className="text-xs 3xl:!text-sm text-red-500 px-4">
              {error.message}
            </p>
          )}

          <CardFooter className="flex justify-end items-center gap-4">
            <Button
              onClick={() => navigate({ to: "/projects" })}
              variant="outline"
              className="rounded px-5 text-[#454545] h-7.5 text-[13px] 3xl:!text-sm font-normal border-[#EBEBEB] shadow-none cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleCreateProject}
              className="rounded bg-[#2F80ED] hover:bg-[#2F80ED] h-7.5 w-20 text-white text-[13px] 3xl:!text-sm font-normal border-none shadow-none cursor-pointer"
            >
              {isProjectPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
