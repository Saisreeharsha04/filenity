const TAG_COLORS: string[] = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-[rgba(86,204,242,0.10)] text-[#00C1FF]",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-teal-100 text-teal-800",
    "bg-orange-100 text-orange-800",
    "bg-cyan-100 text-cyan-800",
  ];
  
  const tagColorMap = new Map<string, string>();
  
  let colorIndex = 0;
  
  export const getColorForTag = (tag: string) => {
    if (tagColorMap.has(tag)) {
      return tagColorMap.get(tag)!;
    }
  
    const color = TAG_COLORS[colorIndex % TAG_COLORS.length];
    tagColorMap.set(tag, color);
    colorIndex++;
    return color;
  };
   