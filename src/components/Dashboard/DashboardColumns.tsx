import { ReactElement } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { getColorForTag } from "../helper/getColorForTag";
import { BlueDot } from "../icons/Table/BlueDot";
import { RedDot } from "../icons/Table/RedDot";
import { GreenDot } from "../icons/Table/GreenDot";
import { VioletDot } from "../icons/Table/VioletDot";
import { Folders } from "../icons/Table/Folders";
import { PDF } from "../icons/Table/pdf";
import { Video } from "../icons/Table/Video";
import { Person } from "../core/TanstackTable";
import { DashboardActions } from "./DashboardActions";
import { formatFileSize } from "~/http/services/files";

export const getFileIcon = (
  type: string,
  size: number = 10
) => {
  switch (type) {
    case "folder":
      return <Folders className="w-5 h-5" />;
    case "pdf":
      return <PDF className="w-5 h-5" />;
    case "video":
      return <Video className="w-5 h-5" />;
    case "document":
      return <PDF className="w-5 h-5" />; 
    case "jpeg":
    case "jpg":
      return (
        <Avatar className="w-5 h-5">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        </Avatar>
      );
    default:
      return null;
  }
};

const columnHelper = createColumnHelper<Person>();

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "name", 
    id: "fileName",
    header: () => <span className="pl-2">Name</span>,
    size: 450,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-2">
        <div className="w-5 h-5 flex items-center">
          {row.original.icon ?? getFileIcon(row.original.type, 20)}
        </div>
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "type",
    id: "fileType",
    header: "Type",
    size: 120,
    cell: ({ row }) => {
      const type = row.original.type;
      let Dot: ReactElement | null = null;
      let textColor = "";

      switch (type) {
        case "folder":
          Dot = <RedDot />;
          textColor = "text-red-600";
          break;
        case "document":
          Dot = <GreenDot />;
          textColor = "text-green-600";
          break;
        case "jpg":
        case "jpeg":
          Dot = <BlueDot />;
          textColor = "text-blue-600";
          break;
        case "video":
          Dot = <VioletDot />;
          textColor = "text-violet-600";
          break;
        default:
          textColor = "text-gray-700";
      }

      return (
        <div className={`flex items-center gap-2 ${textColor}`}>
          {Dot}
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    size: 80,
   cell: ({ row }) => <div>{formatFileSize(row.original.size)}</div>,
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 120,
    cell: ({ row }) => <div>{row.original.category}</div>,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 200,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag: string, idx: number) => {
          const colorClasses = getColorForTag(tag);
          return (
            <div
              key={idx}
              className={`px-2 py-0.5 rounded-full text-xs font-normal ${colorClasses}`}
            >
              {tag}
            </div>
          );
        })}
      </div>
    ),
  },
  {
    accessorKey: "modified_date",
    header: "Date Modified",
    size: 140,
    cell: ({ row }) => {
      const rawDate = row.original.modified_date;
      let formatted = "";

      if (rawDate) {
        const date = new Date(rawDate);
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        const month = monthNames[date.getMonth()];
        const day = String(date.getDate()).padStart(2, "0");
        const year = date.getFullYear();

        formatted = `${month} ${day}, ${year}`;
      }
      return <div className="pl-1">{formatted}</div>;
    },
  },
   {
    accessorKey: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <DashboardActions file={row.original} />
      </div>
    ),
  },
];