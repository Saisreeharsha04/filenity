import { useEffect, useState } from "react";
import { TanstackTable } from "../core/TanstackTable";
import { UsersFilter } from "./UsersFilter";
import { user_columns } from "./UserColumns";
import { GetUsersAPI } from "~/http/services/users";

export function Users() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [users, setUsers] = useState<any[]>([]);
  const limit = 10;

  useEffect(() => {
    let cancelled = false;

    async function fetchUsers(page = 1, allData: any[] = []) {
      const res = await GetUsersAPI({ page, limit });
      const currentUsers = res?.data?.allUsers ?? [];
      const pagination = res?.data?.pagination_info;

      const newData = [...allData, ...currentUsers];

      if (pagination?.next_page && !cancelled) {
        return fetchUsers(pagination.next_page, newData);
      }
      return newData;
    }

    fetchUsers().then((data) => {
      if (!cancelled) setUsers(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);
  
  const tableData = users.map((item: any) => ({
    id: item.id ?? "",
    full_name: item.full_name ?? "",
    email: item.email ?? "",
    service: item.service ?? [],
    role: item.role ?? "",
    storage_used: item.storage_used ?? "",
    status: item.status ?? "",
    last_login: item.last_login ?? "",
  }));

  return (
    <div className="bg-white flex flex-col gap-4 w-[99%] rounded-md mx-auto">
      <UsersFilter viewMode={viewMode} setViewMode={setViewMode} />
      <TanstackTable
        data={tableData}
        columns={user_columns}
        loading={users.length === 0}
        height="calc(100vh - 120px)"
      />
    </div>
  );
}
