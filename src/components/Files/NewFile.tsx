import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { getColorForTag } from "../helper/getColorForTag";
import { FileIcon, Trash2, Upload, X, Download, Loader2 } from "lucide-react";
import { GreenTick } from "../icons/GreenTick";
import { GetSignedUrlAPI, RegisterFileMetaAPI, DownloadFileAPI } from "~/http/services/files";
import { toast, Toaster } from "react-hot-toast";

type UploadedFileInfo = {
  file: File;
  progress: number;
  fileId?: number;
};

export type FileType = {
  id: number;
  name: string;
  updated_at: string;
  size: number;
  type: string;
  category: string | null;
  tags: string[];
};

interface Errors {
  files?: string;
}

export function NewFile() {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState<UploadedFileInfo[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [category, setCategory] = useState("");
  const TOTAL_SIZE = 120 * 1024 * 1024;

  const [filesList, setFilesList] = useState<FileType[]>([]);

  const { mutateAsync: uploadFile, isPending } = useMutation({
    mutationFn: async (fileObj: File) => {
      const signedRes = await GetSignedUrlAPI({
        name: fileObj.name,
        content_type: fileObj.type,
      });

      const uploadUrl = signedRes?.uploadUrl || signedRes?.data?.uploadUrl;
      const filePath = signedRes?.filePath || signedRes?.data?.filePath;

      if (!uploadUrl || !filePath) throw new Error("Failed to get signed URL");

      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": fileObj.type },
        body: fileObj,
      });

      const metaPayload = {
        name: fileObj.name,
        path: filePath,
        mime_type: fileObj.type,
        size: fileObj.size,
        type: category || fileObj.type.split("/")[1],
      };

      const metaRes = await RegisterFileMetaAPI(metaPayload);
      return metaRes?.data;
    },
  });

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) setTags([...tags, newTag]);
      setInputValue("");
    }
    if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: UploadedFileInfo[] = Array.from(e.target.files).map((f) => ({
      file: f,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };

  const removeTag = (tagToRemove: string) => setTags(tags.filter((t) => t !== tagToRemove));
  const removeFile = (name: string) => setFiles((prev) => prev.filter((f) => f.file.name !== name));

  const handleDownload = async (fileId?: number) => {
    if (!fileId) return;
    const res = await DownloadFileAPI(fileId);
    console.log("Download API Response:", res);
  };

  const formatSize = (size: number) => `${(size / (1024 * 1024)).toFixed(0)}MB`;

  const handleSubmit = async () => {
    setErrors({});
    if (files.length === 0) {
      setErrors({ files: "Please select at least one file" });
      return;
    }

    try {
      setFiles((prev) => prev.map((f) => ({ ...f, progress: 0 })));

      const uploadedFiles: FileType[] = [];

      for (const fileObj of files) {
        const uploadedData = await uploadFile(fileObj.file);

        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === fileObj.file.name
              ? { ...f, progress: 100, fileId: uploadedData?.id }
              : f
          )
        );

        toast.success(`${fileObj.file.name} uploaded successfully`);

        uploadedFiles.push({
          id: uploadedData?.id!,
          name: fileObj.file.name,
          updated_at: new Date().toISOString(),
          size: fileObj.file.size,
          type: uploadedData?.type || fileObj.file.type.split("/")[1],
          category: category || null,
          tags,
        });
      }

      setFilesList((prev) => [...uploadedFiles, ...prev]);

      setFiles([]);
      setTags([]);
      setInputValue("");
      setCategory("");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
  };

  return (
    <div className="w-[99%] mx-auto bg-white rounded-md h-[calc(100vh-65px)] overflow-auto">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex items-center justify-center">
        <Card className="w-[650px] py-4 shadow gap-4 mt-5">
          <CardContent className="flex flex-col gap-4">
            {/* Category */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#6D6D6D]">Category (Optional)</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter file name"
                className="border h-10 bg-[#F6F6F6]"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-[#6D6D6D]">Tags (Optional)</Label>
              <div className="flex flex-wrap gap-2 bg-[#F6F6F6] border rounded-sm px-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className={`flex items-center gap-1 h-5 px-2 rounded-full text-xs ${getColorForTag(tag)}`}
                  >
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <Input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={tags.length === 0 ? "Enter tags" : ""}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
                />
              </div>
            </div>

            {/* File Upload */}
            <label
              htmlFor="file-upload"
              className="border-dashed border bg-[#F6F6F6] flex flex-col items-center p-4 rounded gap-2 cursor-pointer"
            >
              <Upload className="text-black/50 mb-4" />
              <p className="text-sm">Drag and drop or Browse</p>
              <span className="text-xs">Max size 50GB</span>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {errors.files && <p className="text-red-500 text-xs">{errors.files}</p>}

            {/* Files List */}
            <div className="max-h-68 overflow-auto flex flex-col gap-2">
              {files.map(({ file, progress, fileId }) => (
                <div key={file.name} className="p-1 px-2 border rounded-md flex items-center gap-3">
                  <FileIcon className="text-blue-500 w-6 h-6" />
                  <div className="flex-1">
                    <p className="text-[13px]">{file.name}</p>
                    <div className="flex items-center gap-1 text-xs mb-1">
                      <span>
                        {formatSize((progress / 100) * TOTAL_SIZE)} of {formatSize(TOTAL_SIZE)}
                      </span>
                      {progress >= 100 && (
                        <div className="flex items-center gap-1">
                          <GreenTick />
                          <p>Completed</p>
                        </div>
                      )}
                    </div>
                    {progress < 100 && (
                      <div className="w-full bg-gray-200 h-1 rounded">
                        <div className="bg-blue-500 h-1 rounded" style={{ width: `${progress}%` }}></div>
                      </div>
                    )}
                  </div>
                  {fileId && (
                    <button onClick={() => handleDownload(fileId)}>
                      <Download className="text-green-600 w-5 h-5" />
                    </button>
                  )}
                  <button onClick={() => removeFile(file.name)}>
                    {progress >= 100 ? <Trash2 className="text-red-500 w-4.5 h-4.5" /> : <X className="text-gray-500 w-5 h-5" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Uploaded Files List */}
            {filesList.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Uploaded Files</h4>
                {filesList.map((f) => (
                  <div key={f.id} className="p-1 px-2 border rounded-md flex items-center gap-3 mb-1">
                    <FileIcon className="text-blue-500 w-6 h-6" />
                    <div className="flex-1">
                      <p className="text-[13px]">{f.name}</p>
                      <p className="text-[11px] text-gray-500">{new Date(f.updated_at).toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleDownload(f.id)}>
                      <Download className="text-green-600 w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate({ to: "/files", search: { viewMode: "list" } })}>
              Cancel
            </Button>
            <Button className="bg-[#2F80ED] text-white" disabled={isPending} onClick={handleSubmit}>
              {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
