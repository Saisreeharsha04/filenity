import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Loader2, Pencil } from "lucide-react";

interface OTPCardProps {
  email: string;
  otpValue: string;
  setOtpValue: (val: string) => void;
  activeOtpIndex: number;
  setActiveOtpIndex: (i: number) => void;
  otpKey: number;
  loginError: string;
  secondsLeft: number;
  handleOTP: () => void;
  handleEmail: () => void;
  isLoginPending: boolean;
  setShowOtp: (val: boolean) => void;
}

function maskEmail(email: string): string {
  if (!email) return "";
  const [username, domain] = email.split("@");
  if (!username || !domain) return email;
  const prefix = username.slice(0, 2);
  const suffix = username.slice(-2);
  const maskedLength = Math.max(username.length - 4, 1);
  const masked = "*".repeat(maskedLength);
  return `${prefix}${masked}${suffix}@${domain}`;
}

export function OTPCard({
  email,
  otpValue,
  setOtpValue,
  activeOtpIndex,
  setActiveOtpIndex,
  otpKey,
  loginError,
  secondsLeft,
  handleOTP,
  handleEmail,
  isLoginPending,
  setShowOtp,
}: OTPCardProps) {
  return (
    <Card className="w-[450px] rounded-md shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)] bg-transparent border-none relative z-10 gap-8">
      <CardHeader className="gap-4">
        <CardTitle>
          <p className="text-black text-center text-2xl font-normal capitalize">
            Verify Your OTP
          </p>
        </CardTitle>
        <CardDescription className="text-black text-sm font-normal text-center">
          we sent a 4 digit code to <br />
          <span className="text-black inline-flex items-center text-xs">
            {maskEmail(email)}
            <Button
              variant="outline"
              className="border-none shadow-none w-0 h-0 cursor-pointer"
              onClick={() => {
                setShowOtp(false);
                setOtpValue("");
                setActiveOtpIndex(0);
              }}
            >
              <Pencil className="!w-3 !h-3" />
            </Button>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 justify-center">
        <InputOTP
          key={otpKey}
          maxLength={4}
          value={otpValue}
          onChange={(val) => {
            setOtpValue(val);
            setActiveOtpIndex(val.length < 4 ? val.length : 3);
          }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && otpValue.length === 4) {
              handleOTP();
            }
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <InputOTPGroup key={i}>
              <InputOTPSlot
                index={i}
                className={`bg-white w-10 h-10 rounded border mr-3 data-[active=true]:ring-1 data-[active=true]:ring-[#2C53D2] data-[active=true]:border-[#2C53D2]  ${
                  activeOtpIndex === i
                    ? "border-[#2C53D2] ring-1 ring-[#2C53D2]"
                    : "border-[#CACACA] "
                }`}
              />
            </InputOTPGroup>
          ))}
        </InputOTP>
        {loginError && (
          <p className="text-xs text-red-500">{loginError}</p>
        )}
        <div className="flex items-center justify-center">
          <p className="text-black text-sm font-normal">
            Didn't receive the code?
          </p>
          <Button
            variant="outline"
            className="text-red-500 font-medium border-none shadow-none p-0 w-22 h-0 cursor-pointer hover:text-red-500"
            onClick={secondsLeft === 0 ? handleEmail : undefined}
          >
            Resend{" "}
            <span className="text-[#2C53D2]">
              {secondsLeft > 0 && `(${secondsLeft}s)`}
            </span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <Button
          variant="outline"
          onClick={handleOTP}
          className="w-full rounded-md bg-[#2C53D2] text-white text-base font-light h-11 hover:bg-[#2C53D2] hover:text-white cursor-pointer"
        >
          {isLoginPending ? <Loader2 className="animate-spin" /> : "Verify"}
        </Button>
      </CardFooter>
    </Card>
  );
}
