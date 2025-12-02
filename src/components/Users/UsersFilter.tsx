import { useNavigate } from "@tanstack/react-router";
import { LayoutGrid, Plus, StretchHorizontal } from "lucide-react";
import { useState } from "react";
import { SearchIcon } from "../icons/SearchIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface FileFilterProps {
  viewMode: string;
  setViewMode: (mode: "grid" | "list") => void;
}

export function UsersFilter({ viewMode, setViewMode }: FileFilterProps) {
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-end gap-3 mt-4 px-4">
      <div className="relative w-50 h-6 border border-[#D1D1D1] bg-[#F6F6F6] rounded-[3px] shadow-none flex items-center justify-between px-2">
        <Input
          type="search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search"
          className="p-0 h-full border-none rounded text-black font-normal text-[13px] 3xl:!text-base shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-[13px]"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <SearchIcon className="w-4 h-4" />
        </span>
      </div>

      <div className="bg-white grid grid-cols-2 border border-[#D1D1D1] rounded-[3px]">
        <div
          className={`w-full h-full flex items-center justify-center p-0.75 rounded-l-[3px] ${
            viewMode === "list" ? "bg-[#D1D1D1]" : "bg-white"
          }`}
        >
          <StretchHorizontal
            strokeWidth={1.5}
            className="w-4 h-4 cursor-pointer text-[#5D5D5D]"
            onClick={() => setViewMode("list")}
          />
        </div>
        <div
          className={`w-full h-full flex items-center rounded-r-[3px] justify-center p-0.75 ${
            viewMode === "grid" ? "bg-[#D1D1D1]" : "bg-white"
          }`}
        >
          <LayoutGrid
            strokeWidth={1.5}
            className="w-4 h-4 cursor-pointer text-[#5D5D5D]"
            onClick={() => setViewMode("grid")}
          />
        </div>
      </div>

      <Button
        onClick={() => navigate({to : "/users/add-user"})}
        className="bg-[#F2994A] hover:bg-[#F2994A] cursor-pointer flex items-center gap-2 p-1 rounded-[3px] px-3 h-6"
      >
        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
          <Plus className="text-[#F2994A] !w-2 !h-2" strokeWidth={3} />
        </div>
        <p className="text-xs 3xl:!text-sm text-white font-light">Add User</p>
      </Button>
    </div>
  );
}
