import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Baseline, Download, FolderMinus, Info, Trash2 } from "lucide-react";
import {
  DownloadFileAPI,
  DeleteFileAPI,
  GetFileInfoAPI,
} from "~/http/services/files";
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

type DashboardActionsProps = {
  file: FileType;
};

export function DashboardActions({ file }: DashboardActionsProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [infoData, setInfoData] = useState<any>(null);

  const handleDownload = async () => {
    try {
      const res = await DownloadFileAPI(file.id);
      if (!res || !res.success) throw new Error("Download request failed");

      const downloadUrl: string = res.data;
      if (!downloadUrl) throw new Error("No download URL returned");

      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to fetch file");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = file.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      toast.success(`"${file.name}" downloaded successfully`);
    } catch (err) {
      console.error("Download error:", err);
      toast.error(`"${file.name}" download failed`);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await DeleteFileAPI(file.id);
      if (!res || !res.success) throw new Error("Delete request failed");

      setDeleteOpen(false);

      toast.success(`"${file.name}" deleted successfully`);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(`"${file.name}" delete failed`);
    }
  };

  const handleInfo = async () => {
    try {
      const res = await GetFileInfoAPI(file.id);
      if (!res?.success) throw new Error("Info fetch failed");
      setInfoData(res.data);
      setInfoOpen(true);
    } catch (err) {
      console.error(err);
      toast.error("Info failed");
    }
  };

  return (
    <>
      {/* Toaster for popup messages */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Actions */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 h-auto w-auto cursor-pointer"
              onClick={handleDownload}
            >
              <Download className="!w-3.5 !h-3.5" strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 h-auto w-auto cursor-pointer"
            >
              <FolderMinus className="!w-3.5 !h-3.5" strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Folder View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 h-auto w-auto cursor-pointer"
            >
              <Baseline className="!w-3.5 !h-3.5" strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Letter</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 h-auto w-auto cursor-pointer"
              onClick={handleInfo}
            >
              <Info className="!w-3.5 !h-3.5" strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Info</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="p-0 h-auto w-auto cursor-pointer"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2
                className="!w-3.5 !h-3.5 text-red-600"
                strokeWidth={1.5}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
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
              <p>
                <strong>Name:</strong> {infoData.file_name}
              </p>
              <p>
                <strong>Type:</strong> {infoData.content_type}
              </p>
              <p>
                <strong>Uploaded By:</strong> {infoData.uploaded_by}
              </p>
              <p>
                <strong>Uploaded At:</strong>{" "}
                {new Date(infoData.uploaded_at).toLocaleString()}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
          <DialogFooter>
            <Button onClick={() => setInfoOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{file.name}</strong>
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
}
