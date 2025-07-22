import { AiOutlineInfoCircle } from "react-icons/ai";

export default function Request({
  className,
  radioName,
  request,
  requestToggler,
  historyToggler,
  icon,
  isFull,
  isSelected,
  onSelect,
}) {
  const formatDateTimeUTC = (dateString) => {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div
      className={`flex gap-2 bg-blue-50 rounded border-l-[2px] border-blue-600 text-gray-600 items-stretch p-2 ${className}`}
    >
      <div className="flex items-center px-2">
        <input
          type="radio"
          name={radioName}
          checked={isSelected}
          onChange={() => onSelect(request)}
          className="w-5 h-5 accent-blue-600 rounded border-gray-300 cursor-pointer"
        />
      </div>
      <div className="w-full">
        <div className="flex justify-between border-b border-gray-300">
          <div className="flex gap-2">
            <span className="font-semibold">{request?.circuit_no}</span>
            {icon}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs">{formatDateTimeUTC(request?.date_time)}</span>
            <AiOutlineInfoCircle
              onClick={requestToggler}
              className="text-gray-300 hover:text-gray-600 cursor-pointer transition-all"
            />{" "}
          </div>
        </div>
        <div className="flex flex-col mt-1 gap-0.5">
          <span
            className="text-sm cursor-pointer hover:text-gray-700 hover:font-semibold"
            onClick={historyToggler}
          >
            <span className="font-semibold">Email:</span> {request?.user.email}
          </span>
          <span className="text-sm cursor-pointer hover:text-gray-700">
            <span className="font-semibold">Mobile:</span> {request?.contact_no}
          </span>
          <span
            className={`text-sm cursor-pointer hover:text-gray-700 text-justify line-clamp-2 ${
              isFull && `line-clamp-none`
            }`}
          >
            <span className="font-semibold">Description:</span>{" "}
            {request?.description}
          </span>
        </div>
      </div>
    </div>
  );
}
