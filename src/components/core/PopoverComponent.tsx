import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandGroup, CommandItem } from "../ui/command";
import { ChevronDown } from "lucide-react";

interface PopoverProps {
  items: { value: string; name: string }[];
  onSelect: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedValue?: string;
  placeholder?: string;
}

const PopoverComponent: React.FC<PopoverProps> = ({
  items,
  onSelect,
  open,
  onOpenChange,
  selectedValue,
  placeholder = "Select"
}) => {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button className="relative flex items-center justify-between border border-[#D1D1D1] bg-[#F6F6F6] rounded-[3px] !h-6 shadow-none w-26 focus-visible:ring-0 focus:ring-0 focus:ring-offset-0 cursor-pointer">
          <div className="w-full h-full px-2 border-r flex items-center">
            <span className="text-[13px] 3xl:!text-sm text-black">
              {selectedValue ? 
                items.find((item) => item.value === selectedValue)?.name || placeholder :
                <span className="text-[13px] 3xl:!text-sm text-[#6D6D6D]">{placeholder}</span>
              }
            </span>
          </div>
          <div className="w-7 h-5.5 bg-white rounded flex items-center justify-center">
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-30 bg-white border-none shadow-[0_0_9px_rgba(0,0,0,0.30)]">
        <Command>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => {
                  onOpenChange(false);
                  onSelect(item.value);
                }}
                className="text-[13px] 3xl:!text-base hover:bg-gray-100 cursor-pointer font-normal"
              >
                {item.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverComponent;