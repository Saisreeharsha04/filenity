  import { useNavigate } from "@tanstack/react-router";
  import { Button } from "../ui/button";
  import { Card, CardContent, CardFooter } from "../ui/card";
  import { Input } from "../ui/input";
  import { Label } from "../ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../ui/select";
  import { useMutation } from "@tanstack/react-query";
  import { useState } from "react";
  import { AddUserAPI } from "~/http/services/users";
  import { Loader2 } from "lucide-react";

  interface Errors {
    full_name?: string;
    email?: string;
    phone?: string | null;
    user_type?: string;
  }
  export function AddUser() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<Errors>({
      full_name: "",
      email: "",
      phone: "",
      user_type: "USER",
    })
    const [errors, setErrors] = useState<Errors>({});

    const { mutate: UserDetails, isPending: isUserPending } = useMutation({
      mutationFn: async () => {
        const payload = {
          ...userData,
          phone: userData.phone?.trim() === "" ? null : userData.phone,
        };
        const response = await AddUserAPI(payload);
        if(!response?.success) throw new Error(response?.message);
        return response;
      },
      onSuccess: () => {
          navigate({ to: "/users" });
          resetForm();
      },
      onError: (err: any) => {
        setErrors(err?.data || {message: err?.message});
      },
    });

    const resetForm = () => {
      setUserData({
        full_name: "",
        email: "",
        phone: "",
        user_type: "USER",
      })
      setErrors({});
    }

    const handleCreateUser = () => {
      UserDetails();
      setErrors({});
    }
    return (
      <div className="w-[99%] mx-auto bg-white rounded-md h-[calc(100vh-65px)] overflow-auto">
        <div className="flex items-center justify-center">
          <Card className="border-none shadow-[0px_0px_12px_0px_rgba(0,0,0,0.09)] bg-white w-[430px] py-4 mt-5">
            <CardContent className="px-4 gap-4 flex flex-col">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal        "
                >
                  Name<span className="text-red-500 font-medium">*</span>
                </Label>
                <Input
                  id="name"
                  value={userData?.full_name}
                  onChange={(e) => setUserData({...userData, full_name: e.target.value})}
                  placeholder="Enter user name"
                  className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
                />
                {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
                >
                  Email<span className="text-red-500 font-medium">*</span>
                </Label>
                <Input
                  id="email"
                  value={userData?.email}
                  onChange={(e) => setUserData({...userData, email: e.target.value})}
                  placeholder="Enter email"
                  className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone"
                  className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={userData.phone ?? ""}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      phone: e.target.value.trim() === "" ? null : e.target.value,
                    })
                  }
                  placeholder="Enter phone number"
                  className="shadow-none rounded-sm border border-[#D1D1D1] h-10 bg-[#F6F6F6] focus-visible:ring-0 placeholder:text-[#B0B0B0] text-black/80"
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="role"
                  className="text-[#6D6D6D] text-[13px] 3xl:!text-sm font-normal leading-[100%]"
                >
                  Role<span className="text-red-500 font-medium">*</span>
                </Label>
                <Select value={userData?.user_type} onValueChange={(e) => setUserData({...userData, user_type: e})}>
                  <SelectTrigger className="w-full shadow-none rounded-sm border border-[#D1D1D1] !h-10 bg-[#F6F6F6] focus-visible:ring-0 text-black/80 [&>svg]:opacity-100">
                    <button>
                      <SelectValue placeholder="Select a role" />
                    </button>
                  </SelectTrigger>
                  <SelectContent className="text-sm 3xl:!text-base font-normal p-1">
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="DEVELOPER">Developer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.user_type && <p className="text-red-500 text-xs">{errors.user_type}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center gap-4 px-4">
              <Button
                onClick={() => navigate({ to: "/users" })}
                variant="outline"
                className="rounded px-5 text-[#454545] h-7.5 text-[13px] 3xl:!text-sm font-normal border-[#EBEBEB] shadow-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick = {handleCreateUser}
                className="rounded bg-[#2F80ED] hover:bg-[#2F80ED] h-7.5 w-18 text-white text-[13px] 3xl:!text-sm font-normal border-none shadow-none cursor-pointer"
              >
                {isUserPending ? <Loader2 className="animate-spin" /> : "Save"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
