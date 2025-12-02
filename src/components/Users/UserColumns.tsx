import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";
import { EditIcon } from "../icons/Table/EditIcon";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ReactElement } from "react";
import { RedDot } from "../icons/Table/RedDot";
import { GreenDot } from "../icons/Table/GreenDot";
import { BlueDot } from "../icons/Table/BlueDot";

  type User = {
    full_name: string;
    email: string;
    service: string[];
    role: string;
    total_size: string;
    status: string;
    last_login: string;
  }

const columnHelper = createColumnHelper<User>();

export const user_columns: ColumnDef<any>[] = [
  {
    accessorKey: "s.no",
    header: () => <span className="pl-2">S.No</span>,
    size: 70,
    cell: ({ row, table }) => {
        const sortedRows = table.getSortedRowModel().rows;
      const globalIndex = sortedRows.findIndex((r: any) => r.id === row.id);
      const serialNumber = globalIndex + 1;
      return(
        <div className="w-5 h-5 flex items-center pl-3">
          {serialNumber.toString().padStart(2, "0")}
      </div> 
      )
    }   
  },
  {
    accessorKey: "full_name",
    header: "Name",
    size: 180,
    cell: ({ row }) =><div className="text-xs 3xl:!text-sm">{row.original.full_name}</div>
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 200,
    cell: ({ row }) => <div className="text-xs 3xl:!text-sm">{row.original.email}</div>,
  },
  {
    accessorKey: "service",
    header: "Service",
    size: 200,
    cell: ({ row }) => 
    <div className="flex flex-wrap gap-1 ">
        {row.original.service.map((service: string, idx: number) => (
          <div
            key={idx}
            className="px-2 py-0.5 rounded-full text-xs 3xl:!text-sm font-normal text-[#5D5D5D] border border-[rgba(0,0,0,0.10)] bg-[#F2F2F2]"
          >
            {service}
          </div>
        ))}
    </div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    size: 150,
    cell: ({ row }) => {
      const role = row.original.role;
      let Dot: ReactElement | null = null;
      let textColor = "";

      switch (role) {
        case "ADMIN":
          Dot = <RedDot />;
          textColor = "text-red-600";
          break;
        case "USER":
          Dot = <GreenDot />;
          textColor = "text-green-600";
          break;
        case "DEVELOPER":
          Dot = <BlueDot />;
          textColor = "text-blue-600";
          break;
        default:
          textColor = "text-gray-700";
      }

      const formattedRole = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

      return (
        <div className={`flex items-center gap-2 text-xs 3xl:!text-sm  ${textColor}`}>
          {Dot}
          {formattedRole}
        </div>
      );
    },
  },
  {
    accessorKey: "total_size",
    header: "Storage Used",
    size: 150,
    cell: ({ row }) => <div className="text-xs 3xl:!text-sm">{row.original.total_size}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 150,
    cell: ({ row }) => {
      const status = row.original.status;
      let textColor = "";
      let bgColor = "";

      switch (status) {
        case "ACTIVE":
          textColor = "text-[#399761]";
          bgColor = "bg-[rgba(57,151,97,0.10)]";
          break;
        case "INACTIVE":
          textColor = "text-[#EB5757]";
          bgColor = "bg-[rgba(235,87,87,0.10)]";
          break;
        case "SUSPENDED":
          textColor = "text-[#FFA000]";
          bgColor = "bg-[rgba(255,160,0,0.10)]";
          break;
        default:
          textColor = "text-gray-700";
          bgColor = "bg-[rgba(0,0,0,0.10)]";
      }

      const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(); 
      return (
        <div className={`w-fit p-0.5 px-2 rounded-full text-xs 3xl:!text-sm ${textColor} ${bgColor}`}>
          {formattedStatus}
        </div>
      );
    },
  },
  {
    accessorKey: "last_login",
    header: "Last Login",
    size: 150,
    cell: ({ row }) => {
      const rawDate = row.original.last_login;
      let formatted = "";
  
      if (rawDate) {
        const date = new Date(rawDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const day = String(date.getUTCDate()).padStart(2, "0");
        const hours = String(date.getUTCHours()).padStart(2, "0");
        const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  
        formatted = `${year}-${month}-${day} ${hours}:${minutes}`;
      }
  
      return <div className="text-xs 3xl:!text-sm">{formatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 100,
    cell: () => (
        <div className="flex items-center gap-3">
          <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-0 h-auto w-auto cursor-pointer"
              >
                <Eye className='!w-3.5 !h-3.5 3xl:!w-4.5 3xl:!h-4.5' strokeWidth={1.5} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" sideOffset={1} alignOffset={20} className="bg-black/80 rounded-none border border-gray-100 px-2 py-1.5 text-white font-light leading-[100%]">
            View</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-0 h-auto w-auto cursor-pointer"
              >
                <EditIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" sideOffset={1} alignOffset={20} className="bg-black/80 rounded-none border border-gray-100 px-2 py-1.5 text-white font-light leading-[100%]">
            Eidt</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="p-0 h-auto w-auto cursor-pointer"
              >
                <Trash2 className='!w-3.5 !h-3.5 3xl:!w-4.5 3xl:!h-4.5 text-red-600' strokeWidth={1.5}/>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" sideOffset={1} alignOffset={20} className="bg-black/80 rounded-none border border-gray-100 px-2 py-1.5 text-white font-light leading-[100%]">
            Delete</TooltipContent>
          </Tooltip>

          </TooltipProvider>
        </div>
    )
  }
];
