import { Grid2X2, TagIcon } from "lucide-react";
import { StatsFile } from "../icons/StatsFile";
import { StatsIcon } from "../icons/StatsIcon";
import { Card } from "../ui/card";
import { GetDashboardStatsAPI } from "~/http/services/dashboard";
import { useQuery } from "@tanstack/react-query";

const formatFileSize = (bytes: number) => {
  if (!bytes && bytes !== 0) return "--";
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await GetDashboardStatsAPI();
      return response.data;
    },
  });

  return (
    <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
      {/* Total Size */}
      <Card className="bg-[#D8F0E2] flex flex-col items-start gap-2 w-70 border-none shadow-none rounded-sm px-4 py-2">
        <div className="bg-[#49CC80] p-1 rounded-sm">
          <StatsIcon className="w-6 h-6" />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-[#69717E] text-normal text-sm 3xl:!text-base">
            Total Size
          </p>
          <p className="text-[#252122] text-xl font-normal 3xl:!text-2xl">
            {formatFileSize(stats?.totalFileSize || 0)}
          </p>
        </div>
      </Card>

      {/* Folders */}
      <Card className="bg-[#E5EEFF] flex flex-col items-start gap-2 w-70 border-none shadow-none rounded-sm px-4 py-2">
        <div className="bg-[#3C89FD] p-1 rounded-sm">
          <StatsFile className="w-6 h-6" />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-[#69717E] text-normal text-sm 3xl:!text-base">
            Folders
          </p>
          <p className="text-[#252122] text-xl font-normal 3xl:!text-2xl">
            {stats?.totalFolders || 0}
          </p>
        </div>
      </Card>

      {/* Categories */}
      <Card className="bg-[#FFE9EC] flex flex-col items-start gap-2 w-70 border-none shadow-none rounded-sm px-4 py-2">
        <div className="bg-[#F84069] p-1 rounded-sm">
          <Grid2X2 className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-[#69717E] text-normal text-sm 3xl:!text-base">
            Categories
          </p>
          <p className="text-[#252122] text-xl font-normal 3xl:!text-2xl">
            {stats?.totalCategories || 0}
          </p>
        </div>
      </Card>

      {/* Tags */}
      <Card className="bg-[#EFE5FE] flex flex-col items-start gap-2 w-70 border-none shadow-none rounded-sm px-4 py-2">
        <div className="bg-[#7431D6] p-1 rounded-sm">
          <TagIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-[#69717E] text-normal text-sm 3xl:!text-base">
            Tags
          </p>
          <p className="text-[#252122] text-xl font-normal 3xl:!text-2xl">
            {stats?.totalTags || 0}
          </p>
        </div>
      </Card>
    </div>
  );
}
