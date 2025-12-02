import { TanstackTable } from "../core/TanstackTable";
import { columns } from "./DashboardColumns";
import { DashboardStats } from "./DashboardStats";
import { GetDashboardRecentFilesAPI } from "~/http/services/dashboard";
import { useEffect, useState } from "react";

function Spinner({ size = 6 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-${size} h-${size} border-2 border-t-blue-500 border-gray-200 rounded-full animate-spin`}
      ></div>
    </div>
  )
}

export function Dashboard() {
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    let cancelled = false;

    async function fetchRecentFiles(page = 1, allData: any[] = []) {
      const res = await GetDashboardRecentFilesAPI();
      const currentFiles = res?.data?.recentFiles ?? [];
      const pagination = res?.data?.pagination_info;

      const newData = [...allData, ...currentFiles];

      if (pagination?.next_page && !cancelled) {
        return fetchRecentFiles(pagination.next_page, newData);
      }
      return newData;
    }

    fetchRecentFiles().then((data) => {
      if (!cancelled) {
        setRecentFiles(data);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const RecentFilesData = recentFiles.map((file) => ({
    id: file.id,
    name: file.name ?? "",
    size: file.size ?? "",
    type: file.type ?? "",
    modified_date: file.updated_at ?? "",
    category: file.category ?? "",
    tags: file.tags ?? [],
  }));

  return (
    <div className="bg-white flex flex-col gap-2 w-[99%] rounded-md mx-auto">
      <DashboardStats />
      <div className="flex items-center justify-between px-5">
        <p className="text-[#454545] text-base font-medium 3xl:!text-lg">Recent Files</p>
        <p className="text-[#649CF1] text-[13px] 3xl:!text-base font-medium">See all</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[calc(100vh-208px)]">
          <Spinner size={8} />
          <p className="ml-2 text-gray-500">Loading files...</p>
        </div>
      ) : (
        <TanstackTable
          data={RecentFilesData}
          columns={columns}
          height={"calc(100vh - 208px)"}
        />
      )}
    </div>
  );
}
