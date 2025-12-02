import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { NewFolderIcon } from "../icons/NewFolder";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewFolderDialog({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[370px] [&>button]:hidden px-2 py-4">
        <DialogHeader className="bg-[linear-gradient(180deg,#FFF_0%,#E1E1E1_69.23%)] rounded-sm flex items-center justify-center px-1">
          <div className="mt-8">
            <NewFolderIcon />
          </div>
        </DialogHeader>
        <div className="grid gap-4 px-3">
          <div className="grid gap-3">
            <Label
              htmlFor="folder-name"
              className="text-[#6D6D6D] text-x[13px] 3xl:!text-base font-normal leading-[100%]"
            >
              Folder Name
            </Label>
            <Input
              id="folder-name"
              placeholder="Enter Folder Name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
              className="rounded-md border border-[#D1D1D1] bg-[#F1F1F1] placeholder:text-[#B0B0B0] text-lg 3xl:!text-xl font-normal h-10 placeholder:text-[13px] focus:outline-none focus:ring-0 focus-visible:ring-0 autofill:bg-transparent shadow-none"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-end px-3 gap-4 mx-1">
          <Button
            variant="outline"
            className="rounded px-5 text-[#454545] h-7.5 text-xs 3xl:!text-sm font-normal border-none shadow-none bg-[#F1F1F1]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="rounded px-5 bg-[#2F80ED] h-7.5 text-white text-xs 3xl:!text-sm font-normal border-none shadow-none"
          >
            create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
