"use client";
import * as React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import dayjs from "dayjs";
import { Calendar } from "~/components/ui/calendar";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(localeData);
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface DateTimePickerProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  placeholder?: string;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | null>(value);
  const [time, setTime] = React.useState(
    value ? dayjs(value).format("hh:mm A") : dayjs().format("hh:mm A")
  );
  const [month, setMonth] = React.useState<Date>(value || new Date());

  React.useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const popoverContent = document.querySelector(
        "[data-radix-popper-content-wrapper]"
      );
      if (
        popoverContent &&
        !popoverContent.contains(target) &&
        !target.closest("[data-radix-select-content]")
      ) {
        // setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const formatDateTime = (date: Date | null) => {
    return date ? dayjs(date).format("DD-MMM-YYYY hh:mm A") : "";
  };

  const handleClearValue = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalDate(null);
    setTime(dayjs().format("hh:mm A"));
    setMonth(new Date());
    onChange(null);
  };

  const isSelectedTimePast = () => {
    if (!internalDate || !time) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDateOnly = new Date(
      internalDate.getFullYear(),
      internalDate.getMonth(),
      internalDate.getDate()
    );

    if (selectedDateOnly.getTime() > today.getTime()) {
      return false;
    }

    if (selectedDateOnly.getTime() < today.getTime()) {
      return true;
    }

    const [timeStr, meridiem] = time.split(" ");
    const [hourStr, minuteStr] = timeStr.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const isPM = meridiem === "PM";

    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const selectedDateTime = new Date(internalDate);
    selectedDateTime.setHours(hour, minute, 0, 0);

    const currentDateTime = new Date();
    currentDateTime.setSeconds(0, 0);

    return selectedDateTime.getTime() < currentDateTime.getTime();
  };

  const isOkButtonEnabled = internalDate && !isSelectedTimePast();

  React.useEffect(() => {
    setInternalDate(value);
    setMonth(value || new Date());
    if (value) {
      setTime(dayjs(value).format("hh:mm A"));
    }
  }, [value]);

  const CustomNavigation = () => {
    const currentYear = dayjs().year();
    const years = Array.from(
      { length: 101 },
      (_, i) => currentYear - 50 + i
    );
    const months = dayjs.monthsShort();

    const handleMonthChange = (val: string) => {
      const selectedMonth = parseInt(val);
      const newDate = dayjs(month)
        .month(selectedMonth)
        .toDate();
      setMonth(newDate);
    };

    const handleYearChange = (val: string) => {
      const selectedYear = parseInt(val);
      const newDate = dayjs(month)
        .year(selectedYear)
        .toDate();
      setMonth(newDate);
    };

    const goToPrevMonth = () => {
      setMonth(dayjs(month).subtract(1, "month").toDate());
    };

    const goToNextMonth = () => {
      setMonth(dayjs(month).add(1, "month").toDate());
    };

    return (
      <div className="flex items-center justify-between px-2 py-1 w-full">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 p-0 text-[rgba(0,0,0,0.60)] rounded-sm cursor-pointer"
          onClick={goToPrevMonth}
          type="button"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1 items-center">
          <Select
            value={String(month.getMonth())}
            onValueChange={(val) => handleMonthChange(val)}
          >
            <SelectTrigger className="w-[55px] border border-gray-300 shadow text-xs 3xl:!text-sm py-0 px-1 !h-6 rounded text-gray-800 focus:outline-0 focus:ring-0 focus-visible:ring-0">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent
              className="!min-w-8 bg-white border-none shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] h-60 p-0 m-0 focus-visible:ring-0 text-xs 3xl:!text-sm"
              align="center"
              side="top"
            >
              {months.map((monthName, index) => (
                <SelectItem
                  key={monthName}
                  value={String(index)}
                  className="hover:bg-gray-100"
                >
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(month.getFullYear())}
            onValueChange={(val) => handleYearChange(val)}
          >
            <SelectTrigger className="w-[65px] border border-gray-300 shadow text-xs 3xl:!text-sm py-0 px-1 !h-6 rounded text-gray-800">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent
              className="!min-w-8 bg-white border-none shadow-[0px_8px_16px_0px_rgba(0,0,0,0.1)] h-60 p-0 m-0 focus-visible:ring-0 text-xs 3xl:!text-sm"
              align="center"
              side="top"
            >
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={String(year)}
                  className="hover:bg-gray-100"
                >
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0 text-[rgba(0,0,0,0.60)] rounded-sm cursor-pointer"
          onClick={goToNextMonth}
          type="button"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className=" bg-white">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-between pl-2 border border-[#D1D1D1] bg-[#F6F6F6] rounded-[3px] !h-6 shadow-none w-26 focus-visible:ring-0 focus:ring-0 focus:ring-offset-0 cursor-pointer",
              !value && "text-[rgba(0,0,0,0.40)] text-sm"
            )}
            type="button"
          >
            {value ? (
              formatDateTime(value)
            ) : (
              <p className="text-[13px] text-[#6D6D6D] font-normal">
                {placeholder}
              </p>
            )}
            {value ? (
              <X
                className="h-4 w-4 text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                onClick={handleClearValue}
              />
            ) : (
              <div className="w-6 h-5.5 bg-white rounded-r flex items-center justify-center border-l">
                <style>{`
            .rdp-caption { display: none !important; }
            .rdp-nav { display: none !important; }
            .rdp-nav_button { display: none !important; }
            .rdp-nav_button_previous { display: none !important; }
            .rdp-nav_button_next { display: none !important; }
          `}</style>
                <CalendarDays
                  className="text-gray-500 cursor-pointer w-4 h-4 pr-0.5"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto bg-white border border-gray-300 p-0 rounded"
          align="center"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="p-2">
            <CustomNavigation />
          </div>
            <style dangerouslySetInnerHTML={{
              __html: `
                .rdp-caption { display: none !important; }
                .rdp-nav { display: none !important; }
                .rdp-nav_button { display: none !important; }
                .rdp-nav_button_previous { display: none !important; }
                .rdp-nav_button_next { display: none !important; }
                .rdp-caption_label { display: none !important; }
                .rdp-caption_start { display: none !important; }
                .rdp-caption_end { display: none !important; }
                .rdp-caption_between { display: none !important; }
                .rdp-vhidden { display: none !important; }
                .rdp-month { margin-top: 0 !important; }
                .rdp-months { margin-top: 0 !important; }
                [class*="caption"] { display: none !important; }
                [class*="nav"] { display: none !important; }
              `
            }} />
          <Calendar
            mode="single"
            selected={internalDate || undefined}
            onSelect={(date) => {
              setInternalDate(date ?? null);
              if (date) {
                const [timeStr, meridiem] = time.split(" ");
                const [hourStr, minuteStr] = timeStr.split(":");
                let hour = parseInt(hourStr, 10);
                const minute = parseInt(minuteStr, 10);
                const isPM = meridiem === "PM";

                if (isPM && hour < 12) hour += 12;
                if (!isPM && hour === 12) hour = 0;

                const newDate = new Date(date);
                newDate.setHours(hour, minute, 0, 0);
                onChange(newDate);
              } else {
                onChange(null);
              }
            }}
            month={month}
            onMonthChange={setMonth}
            disabled={{ before: new Date() }}
            className="h-67 rounded border-t"
            classNames={{
              day_disabled:
                "line-through cursor-not-allowed text-gray-400 opacity-60",
              months: "flex flex-col sm:flex-row gap-2",
              caption: "hidden",
              nav_button: "hidden",
              head_cell:
                "w-8 text-sm text-[rgba(0,0,0,0.40)] m-0.5 font-normal space-y-2",
              row: "flex w-full",
              cell: "h-4 w-8 p-0 m-0.5",
              day: "h-7 w-7 text-sm rounded-sm transition-colors duration-150 hover:text-white hover:bg-[linear-gradient(45deg,_#e52e71,_#5313ad)] text-[#430ca6]",
              day_selected:
                "text-white bg-[linear-gradient(45deg,_#e52e71,_#5313ad)] rounded-lg",
              day_today: "text-black border border-[#430ca6] rounded-sm",
              day_outside: "text-[rgba(0,0,0,0.40)] opacity-40",
              day_range_middle:
                "text-white bg-gradient-to-r from-[#430ca6]/20 via-[#a533cf]/20 to-[#ec6d78]/20 rounded-sm",
            }}
          />
          <hr className="text-gray-300" />
          <div className="flex justify-end m-1 w-[95%]">
            <Button
              onClick={() => setOpen(false)}
              disabled={!isOkButtonEnabled}
              className="px-2 py-0.5 text-white bg-[linear-gradient(45deg,_#e52e71,_#5313ad)] rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Ok
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}