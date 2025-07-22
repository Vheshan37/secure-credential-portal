export default function Request({ className, icon, item }) {

  const formatDateTimeUTC = (dateString) => {
    const date = new Date(dateString);
    
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  };


  return (
    <div
      className={`flex gap-2 bg-blue-50 rounded border-l-[2px] border-blue-600 text-gray-600 items-stretch p-2 ${className}`}
    >
      <div className="w-full">
        <div className="flex justify-between border-b border-gray-300">
          <div className="flex gap-2">
            <span className="font-semibold">{item.circuit_no}</span>
            {icon}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs">{formatDateTimeUTC(item.date_time)}</span>
          </div>
        </div>
        <div className="flex flex-col mt-1 gap-0.5">
          <span className="text-sm text-justify">
            <span className="font-semibold">Message:</span>
            <span>{item.description}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
