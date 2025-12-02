import { AvatarImage } from "@radix-ui/react-avatar";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  CirclePlus,
  LayoutGrid,
  LogOut,
  Settings,
  Tag,
  Trash2,
  UsersRound,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Categories } from "../icons/header/Categories";
import { Files } from "../icons/header/Files";
import { Projects } from "../icons/header/Projects";
import { Avatar } from "../ui/avatar";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Cookies from "js-cookie";
import { userStore } from "../store/userDetails";

const layout = [
  { icon: <LayoutGrid className="!w-3 !h-3" strokeWidth={1.5} />, name: "Dashboard", to: "/dashboard" },
  { icon: <svg className="w-4 h-4"><Files /></svg>, name: "Files", to: "/files" },
  { icon: <svg className="w-4 h-4"><Projects /></svg>, name: "Projects", to: "/projects" },
  { icon: <svg className="w-4 h-4"><Categories /></svg>, name: "Categories", to: "/projects" },
  { icon: <Tag className="w-4 h-4" strokeWidth={1.5} />, name: "Tags", to: "/projects" },
  { icon: <UsersRound className="w-4 h-4" strokeWidth={1.5} />, name: "Users", to: "/users" },
];

const personalSpace = [
  { name: "CloudNest Storage", status: "Active" },
  { name: "FileHaven", status: "switch" },
  { name: "DataDock", status: "switch" },
  { name: "vaultSpace", status: "switch" },
  { name: "SyncSphere", status: "switch" },
  { name: "StoreSmart", status: "switch" },
  { name: "FilesHaven", status: "switch" },
  { name: "Actanos", status: "switch" },
  { name: "FigLinks", status: "switch" },
];

export function Header() {
  const [spaceOpen, setSpaceOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);

  const [user, setUser] = useState<{ full_name?: string; user_type?: string }>({});

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setUser({
      full_name: userStore.state.full_name,
      user_type: userStore.state.user_type,
    });
  }, []);

  const handleLogout = () => {
    userStore.setState(() => ({
      full_name: "",
      email: "",
      phone: "",
      user_type: "",
    }));
    
    const clearCookies = ["token", "refreshToken", "userDetails", "device_token", "_device_id"];
    clearCookies.forEach((cookie) => Cookies.remove(cookie, { path: "/" }));
    sessionStorage.clear();
    localStorage.removeItem("userState");
    navigate({ to: "/" });
  };

  const profile = [
    { icon: <CirclePlus className="w-4 h-4 text-gray-600" />, name: "Profile" },
    { icon: <Settings className="w-4 h-4 text-gray-600" />, name: "Settings" },
    { icon: <Trash2 className="w-4 h-4 text-gray-600" />, name: "Trash" },
    { icon: <LogOut className="w-4 h-4 text-red-500" />, name: "Logs", onClick: handleLogout },
  ];

  useEffect(() => {
    const currentLayout = layout.find((item) => item.to === location.pathname);
    if (currentLayout) {
      setSelectedLayout(currentLayout.name);
    }
  }, [location.pathname]);

  return (
    <div className="bg-[#F1F1F1] h-screen">
      <div className="relative flex items-center justify-between bg-[#F1F1F1] p-0.5">
        {spaceOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSpaceOpen(false)}
            aria-hidden="true"
          />
        )}
        <Popover open={spaceOpen} onOpenChange={setSpaceOpen}>
          <PopoverTrigger asChild>
            <button
              role="combobox"
              aria-expanded={spaceOpen}
              aria-label="Select personal space"
              className="flex items-center justify-between mx-3 p-1.75 gap-4 rounded-sm bg-white hover:bg-white cursor-pointer shadow-[0px_0px_2px_rgba(0,0,0,0.20)] px-2"
            >
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                </Avatar>
                <p className="text-[#454545] text-[13px] 3xl:!text-base font-normal leading-[100%] text-center">
                  Personal Space
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-black/50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="pt-1 pb-3 pl-1 pr-0 bg-white border-none shadow-[0px_0px_10px_rgba(0,0,0,0.20)] max-w-64 mx-3 z-50">
            <Command>
              <CommandGroup className="max-h-42 overflow-auto">
                {personalSpace.map((item, index) => (
                  <CommandItem
                    className="flex items-center justify-between gap-2"
                    onSelect={() => setSpaceOpen(false)}
                    key={index}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      </Avatar>
                      <p className="ml-2 text-[13px] 3xl:!text-base font-normal">{item.name}</p>
                    </div>
                    <p
                      className={`text-[10px] 3xl:!text-sm ${
                        item.status === "Active"
                          ? "bg-[#D8F0E2] text-green-700"
                          : "bg-gray-100"
                      } rounded-full p-1 px-2 leading-[100%]`}
                    >
                      {item.status}
                    </p>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <div className="flex items-center justify-between gap-4">
          {layout.map((item, index) => (
            <Link
              key={index}
              to={item.to || "#"}
              className={`flex items-center justify-between py-1 px-2 rounded cursor-pointer transition-colors ${
                selectedLayout === item.name
                  ? "bg-[rgba(47,128,237,0.30)] border border-[#2F80ED] text-[#2F80ED]"
                  : ""
              }`}
              onClick={() => setSelectedLayout(item.name)}
            >
              {item.icon &&
                React.cloneElement(item.icon, {
                  className: `w-4 ${item.name === "Dashboard" ? "h-5" : "h-4"} ${
                    selectedLayout === item.name
                      ? "text-[#2F80ED] stroke-[#2F80ED] stroke-width-1"
                      : "text-gray-600"
                  }`,
                })}
              <p
                className={`ml-1 text-xs 3xl:!text-sm ${
                  selectedLayout === item.name ? "text-[#2F80ED]" : "text-gray-600"
                }`}
              >
                {item.name}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white m-2 rounded-sm">
          <div className="relative group">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-1 px-1">
                  <Avatar className="w-[30px] h-[30px] bg-[#c0c4cc] text-white text-lg 3xl:!text-xl cursor-pointer rounded-sm">
                    <AvatarImage src="https://github.com/shadcn.png" alt="" />
                  </Avatar>
                  <div className="flex flex-col justify-center pr-6">
                    <p className="text-[13px] 3xl:!text-[15px] font-normal text-black">
                      {user.full_name || "User Name"}
                    </p>
                    <p className="text-[11px] 3xl:!text-xs text-[#828282] font-normal">
                      {user.user_type || "Role"}
                    </p>
                  </div>
                  <ChevronDown className="h-5 w-5 shrink-0 text-black/50" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-38 border-none shadow-[0px_0px_10px_rgba(0,0,0,0.15)] rounded-sm p-1"
              >
                {profile.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={item.onClick}>
                      {item.icon}
                      <p className="text-sm 3xl:!text-base font-normal text-gray-600">{item.name}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
