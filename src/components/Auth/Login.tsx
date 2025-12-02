import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loginWithEmailAPI, loginWithEmailOTPAPI } from "~/http/services/auth";
import { LoginIcon } from "../icons/LoginIcon";
import { EmailCard } from "./EmailCard";
import { OTPCard } from "./OTPCard";
import Cookies from "js-cookie";
import { updateUserStore } from "~/components/store/userDetails";

export function Login() {
  const [showOtp, setShowOtp] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [otpValue, setOtpValue] = useState("");
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [otpKey, setOtpKey] = useState(0);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { mutate: emailLogin, isPending: isEmailPending } = useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await loginWithEmailAPI(payload);
      if (!response?.success) {
        throw new Error(response?.message || "Email not found");
      }
      return response;
    },
    onSuccess: () => {
      setShowOtp(true);
      setSecondsLeft(30);
    },
    onError: (error: any) => {
      setEmailError(error?.message || "Failed to Login, try again");
    },
  });

  const { mutate: loginMutation, isPending: isLoginPending } = useMutation({
    mutationFn: async (payload: { email: string; otp: string }) => {
      const response = await loginWithEmailOTPAPI(payload);
      if (!response?.success) {
        throw new Error(response?.message || "Email not found");
      }
      return response;
    },
    onSuccess: (response) => {
      const user = response.data.user_details;

      if (response?.data?.access_token) {
        Cookies.set("token", response.data.access_token, { path: "/" });
      }
      if (response?.data?.refresh_token) {
        Cookies.set("refreshToken", response.data.refresh_token, { path: "/" });
      }

      updateUserStore({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        user_type: user.user_type,
      });

      setSecondsLeft(30);
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      setLoginError(error?.message || "Failed to Login, try again");
    },
  });

  const handleOTP = () => {
    setLoginError("");
    if (!otpValue || otpValue.length !== 4) {
      setLoginError("Please enter the 4-digit OTP");
      return;
    }
    loginMutation({ email, otp: otpValue });
  };

  const handleEmail = () => {
    setEmailError("");
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    emailLogin({ email });
  };

  useEffect(() => {
    if (showOtp && secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showOtp, secondsLeft]);

  useEffect(() => {
    if (showOtp) {
      setOtpValue("");
      setActiveOtpIndex(0);
      setOtpKey((prevKey) => prevKey + 1);
    }
  }, [showOtp]);

  return (
    <div className="grid grid-cols-2 h-screen overflow-hidden">
      <div className="flex flex-col relative overflow-hidden items-center justify-center">
        <div className="flex justify-center relative">
          {!showOtp ? (
            <EmailCard
              email={email}
              setEmail={(val) => {
                setEmail(val);
                setEmailError("");
              }}
              emailError={emailError}
              handleEmail={handleEmail}
              isEmailPending={isEmailPending}
            />
          ) : (
            <OTPCard
              email={email}
              otpValue={otpValue}
              setOtpValue={setOtpValue}
              activeOtpIndex={activeOtpIndex}
              setActiveOtpIndex={setActiveOtpIndex}
              otpKey={otpKey}
              loginError={loginError}
              secondsLeft={secondsLeft}
              handleOTP={handleOTP}
              handleEmail={handleEmail}
              isLoginPending={isLoginPending}
              setShowOtp={setShowOtp}
            />
          )}
        </div>
      </div>

      <div className="w-full h-full relative overflow-auto">
        <LoginIcon className="object-cover h-full w-full" />
        <div className="absolute top-2/5 left-1/2 -translate-x-2/5 -translate-y-3/4 w-[70%] 3xl:!w-[80%] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-white text-2xl 3xl:!text-3xl font-semibold leading-[100%]">
              About
            </p>
            <p className="text-[rgba(255,255,255,0.80)] text-sm 3xl:!text-base font-normal leading-[150%]">
              Enjoy seamless navigation, quick search, and secure storage for a
              smarter digital workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-white text-2xl 3xl:!text-3xl font-semibold leading-[100%]">
              Features
            </p>
            <ul className="flex flex-col gap-2 list-disc pl-5">
              <li className="text-white text-base 3xl:!text-lg font-normal leading-[120%]">
                Easy File Organization
                <p className="text-[rgba(255,255,255,0.80)] text-sm 3xl:!text-base font-light leading-[150%]">
                  Sort, rename, move, and categorize files with a clean and
                  user-friendly interface.
                </p>
              </li>
              <li className="text-white text-base 3xl:!text-lg font-normal leading-[120%]">
                Fast Search & Access
                <p className="text-[rgba(255,255,255,0.80)] text-sm 3xl:!text-base font-light leading-[150%]">
                  Instantly locate files and folders with smart search
                  functionality.
                </p>
              </li>
              <li className="text-white text-base 3xl:!text-lg font-normal leading-[120%]">
                Cloud Integration
                <p className="text-[rgba(255,255,255,0.80)] text-sm 3xl:!text-base font-light leading-[150%]">
                  Sync and manage your files across cloud services like Google
                  Drive and Dropbox.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
