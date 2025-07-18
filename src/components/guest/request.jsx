export default function Request({ className, icon, item}) {
  return (
    <div
      className={`flex gap-2 bg-blue-50 rounded border-l-[2px] border-blue-600 text-gray-600 items-stretch p-2 ${className}`}
    >
      <div className="w-full">
        <div className="flex justify-between border-b border-gray-300">
          <div className="flex gap-2">
            <span className="font-semibold">{item.circuitId}</span>            
            {icon}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs">{item.date_time}</span>            
          </div>
        </div>
        <div className="flex flex-col mt-1 gap-0.5">          
          <span className="text-sm text-justify">
            <span className="font-semibold">Message:</span>
            <span>{item.message}</span> 
          </span>
        </div>
      </div>
    </div>
  );
}
