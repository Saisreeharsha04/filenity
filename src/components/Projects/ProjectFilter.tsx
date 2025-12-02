import { useState } from "react";
import { Input } from "../ui/input";
import { ChevronDown, LayoutGrid, Plus, StretchHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { Button } from "../ui/button";
import { SearchIcon } from "../icons/SearchIcon";
import { useNavigate } from "@tanstack/react-router";
import { DateTimePicker } from "../core/Meeting/Calendar";
import PopoverComponent from "../core/PopoverComponent";

const types = [
  { value: "File", name: "File" },
  { value: "Folder", name: "Folder" },
  { value: "Video", name: "Video" },
  { value: "Document", name: "Document" },
  { value: "Image", name: "Image" },
];

const sizes = [
  { value: "53MB", name: "53MB" },
  { value: "60MB", name: "60MB" },
  { value: "120MB", name: "120MB" },
  { value: "200MB", name: "200MB" },
  { value: "300MB", name: "300MB" },
];

interface FileFilterProps {
  viewMode: string;
  setViewMode: (mode: "grid" | "list") => void;
}

export function ProjectFilter({ viewMode, setViewMode }: FileFilterProps) {
  const [searchString, setSearchString] = useState("");
  const [open, setOpen] = useState(false);
  const [openSize, setOpenSize] = useState(false);
  const [selected, setSelected] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();
  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleSelectSize = (value: string) => {
    setSelectedSize(value);
  };

  return (
    <div className="flex items-center justify-end gap-3 mt-4 px-4">
      <PopoverComponent
        items={types}
        onSelect={handleSelect}
        open={open}
        onOpenChange={setOpen}
        selectedValue={selected}
        placeholder="Type"
      />
      <PopoverComponent
        items={sizes}
        onSelect={handleSelectSize}
        open={openSize}
        onOpenChange={setOpenSize}
        selectedValue={selectedSize}
        placeholder="Size"
      />

      <DateTimePicker
        placeholder="Date"
        value={null}
        onChange={(e) => console.log(e)}
      />

      <div className="relative w-40 h-6 border border-[#D1D1D1] bg-[#F6F6F6] rounded-[3px] shadow-none flex items-center justify-between px-2">
        <Input
          type="search"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          placeholder="Search by Title"
          className="p-0 h-full border-none rounded text-black font-normal text-[13px] 3xl:!text-base shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 placeholder:text-[13px]"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          <SearchIcon className="w-4 h-4" />
        </span>
      </div>

      <div className="bg-white grid grid-cols-2 border border-[#D1D1D1] rounded-[3px]">
      <div
          className={`w-full h-full flex items-center rounded-l-[3px] justify-center p-0.75 ${
            viewMode === "grid" ? "bg-[#D1D1D1]" : "bg-white"
          }`}
        >
          <LayoutGrid
            strokeWidth={1.5}
            className="w-4 h-4 cursor-pointer text-[#5D5D5D]"
            onClick={() => setViewMode("grid")}
          />
        </div>
        <div
          className={`w-full h-full flex items-center justify-center p-0.75 rounded-r-[3px] ${
            viewMode === "list" ? "bg-[#D1D1D1]" : "bg-white"
          }`}
        >
          <StretchHorizontal
            strokeWidth={1.5}
            className="w-4 h-4 cursor-pointer text-[#5D5D5D]"
            onClick={() => setViewMode("list")}
          />
        </div>
      </div>

      <Button 
      onClick={() => navigate({to : "/projects/new-project"})}
      className="bg-[#2F80ED] flex items-center gap-2 p-1 rounded-[3px] px-2 h-6 cursor-pointer hover:bg-[#2F80ED]">
        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
          <Plus className="text-[#2F80ED] !w-2 !h-2" strokeWidth={3} />
        </div>
        <p className="text-xs 3xl:!text-sm text-white font-light">New Project</p>
      </Button>
    </div>
  );
}
