export default function Request({ className, icon}) {
  return (
    <div
      className={`flex gap-2 bg-blue-50 rounded border-l-[2px] border-blue-600 text-gray-600 items-stretch p-2 ${className}`}
    >
      <div className="w-full">
        <div className="flex justify-between border-b border-gray-300">
          <div className="flex gap-2">
            <span className="font-semibold">Circuit ID</span>            
            {icon}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs">2025-07-07 07:30 AM</span>            
          </div>
        </div>
        <div className="flex flex-col mt-1 gap-0.5">          
          <span className="text-sm text-justify">
            <span className="font-semibold">Message:</span> Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Fuga natus odio porro
            quos dolorem accusantium enim laborum rem error.
          </span>
        </div>
      </div>
    </div>
  );
}
