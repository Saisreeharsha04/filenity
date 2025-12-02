import { useState, ReactElement } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { getColorForTag } from "../helper/getColorForTag";
import { BlueDot } from "../icons/Table/BlueDot";
import { RedDot } from "../icons/Table/RedDot";
import { GreenDot } from "../icons/Table/GreenDot";
import { VioletDot } from "../icons/Table/VioletDot";
import { Folders } from "../icons/Table/Folders";
import { PDF } from "../icons/Table/pdf";
import { Video } from "../icons/Table/Video";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Baseline, Download, FolderMinus, Info, Trash2 } from "lucide-react";
import {
  DeleteFileAPI,
  DownloadFileAPI,
  GetFileInfoAPI,
  formatFileSize,
} from "~/http/services/files";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast, Toaster } from "react-hot-toast";

export type FileType = {
  id: number;
  name: string;
  updated_at: string;
  size: number;
  type: string;
  category: string | null;
  tags: string[];
};

export async function handleDownload(fileId: number, fileName: string) {
  try {
    const res = await DownloadFileAPI(fileId);
    if (!res?.success) throw new Error("Download request failed");

    const downloadUrl: string = res.data;
    if (!downloadUrl) throw new Error("No download URL returned");

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error("Failed to fetch file");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
    toast.success(`${fileName} downloaded successfully`);
  } catch (err) {
    console.error(err);
    toast.error("Download failed");
  }
}

export const getFileIcon = (type: string): ReactElement | null => {
  switch (type) {
    case "folder":
      return <Folders className="w-5 h-5 text-gray-600" />;
    case "pdf":
      return <PDF className="w-5 h-5 text-red-600" />;
    case "video":
      return <Video className="w-5 h-5 text-violet-600" />;
    case "image":
      return <BlueDot />;
    default:
      return null;
  }
};

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "name",
    header: () => <span className="pl-3 font-medium text-gray-700">Name</span>,
    size: 450,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 pl-3 py-2 text-sm text-gray-700">
        {getFileIcon(row.original.type)}
        <span className="truncate">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "type",
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
        case "pdf":
          Dot = <GreenDot />;
          textColor = "text-green-600";
          break;
        case "image":
          Dot = <BlueDot />;
          textColor = "text-blue-600";
          break;
        case "video":
          Dot = <VioletDot />;
          textColor = "text-violet-600";
          break;
        default:
          textColor = "text-gray-500";
      }

      return (
        <div className={`flex items-center gap-2 py-2 text-sm ${textColor}`}>
          {Dot} {type}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    size: 80,
    cell: ({ row }) => (
      <div className="py-2 text-sm text-gray-700">
        {formatFileSize(row.original.size)}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 120,
    cell: ({ row }) => (
      <div className="py-2 text-sm text-gray-600">
        {row.original.category ?? "--"}
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 200,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 py-2">
        {row.original.tags.length > 0 ? (
          row.original.tags.map((tag, idx) => (
            <div
              key={idx}
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColorForTag(
                tag
              )}`}
            >
              {tag}
            </div>
          ))
        ) : (
          <span className="text-gray-400 text-xs">No Tags</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: "Date Modified",
    size: 140,
    cell: ({ row }) => (
      <div className="py-2 text-sm text-gray-700">
        {new Date(row.original.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    size: 200,
    cell: ({ row }) => {
      const file = row.original;
      const [infoOpen, setInfoOpen] = useState(false);
      const [infoData, setInfoData] = useState<any>(null);
      const [deleteOpen, setDeleteOpen] = useState(false);

      const handleInfo = async () => {
        try {
          const res = await GetFileInfoAPI(file.id);
          if (!res?.success) throw new Error("Info fetch failed");
          setInfoData(res.data);
          setInfoOpen(true);
        } catch (err) {
          console.error(err);
          toast.error("Failed to fetch info");
        }
      };

      const handleDelete = async () => {
        try {
          await DeleteFileAPI(file.id);
          toast.success(`"${file.name}" deleted successfully`);
          setDeleteOpen(false);

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (err) {
          console.error(err);
          toast.error(`"${file.name}" delete failed`);
        }
      };

      const handleDownloadClick = () => handleDownload(file.id, file.name);

      return (
        <>
          <TooltipProvider>
            <div className="flex items-center gap-3 py-2">
              {/* Download */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 h-auto w-auto"
                    onClick={handleDownloadClick}
                  >
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download</TooltipContent>
              </Tooltip>

              {/* Folder View */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-0 h-auto w-auto">
                    <FolderMinus className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Folder View</TooltipContent>
              </Tooltip>

              {/* Letter */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="p-0 h-auto w-auto">
                    <Baseline className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Letter</TooltipContent>
              </Tooltip>

              {/* Info */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 h-auto w-auto"
                    onClick={handleInfo}
                  >
                    <Info className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Info</TooltipContent>
              </Tooltip>

              {/* Delete */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-0 h-auto w-auto"
                    onClick={() => setDeleteOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Info Dialog */}
          <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>File Information</DialogTitle>
                <DialogDescription>
                  Details about the selected file.
                </DialogDescription>
              </DialogHeader>
              {infoData ? (
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {infoData.file_name}</p>
                  <p><strong>Type:</strong> {infoData.content_type}</p>
                  <p><strong>Uploaded By:</strong> {infoData.uploaded_by}</p>
                  <p><strong>Uploaded At:</strong> {new Date(infoData.uploaded_at).toLocaleString()}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
              <DialogFooter>
                <Button onClick={() => setInfoOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Dialog */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete <strong>{file.name}</strong>?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];


