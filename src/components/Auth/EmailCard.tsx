import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface EmailCardProps {
  email: string;
  setEmail: (val: string) => void;
  emailError: string;
  handleEmail: () => void;
  isEmailPending: boolean;
}

export function EmailCard({
  email,
  setEmail,
  emailError,
  handleEmail,
  isEmailPending,
}: EmailCardProps) {
  return (
    <Card className="w-[450px] rounded-md shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] bg-transparent border-none relative z-10 gap-12">
      <CardHeader className="gap-4">
        <CardTitle>
          <p className="text-3xl text-center text-black font-normal leading-[100%]">
            Login
          </p>
        </CardTitle>
        <CardDescription className="text-[#333] text-sm font-normal text-center leading-[130%]">
          Greetings! Kindly enter your credentials.
        </CardDescription>
      </CardHeader>
      <div className="flex flex-col gap-5">
        <CardContent>
          <form className="flex flex-col items-start space-y-4">
            <div className="w-full flex flex-col gap-1">
              <Label className="text-black text-sm font-normal leading-[130%]">
                Email
              </Label>
              <Input
                id="email"
                placeholder="Enter your email"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleEmail();
                  }
                }}
                value={email.toLowerCase()}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-[#D1D1D1] bg-[#F1F1F1] placeholder:text-black/50 text-lg font-normal h-11 focus:outline-none focus:ring-0 focus-visible:ring-0"
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <Button
            variant="outline"
            onClick={handleEmail}
            className="w-full rounded-md bg-[#2C53D2] text-white text-base font-light h-11 hover:bg-[#2C53D2] hover:text-white cursor-pointer"
          >
            {isEmailPending ? <Loader2 className="animate-spin" /> : "Send OTP"}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
