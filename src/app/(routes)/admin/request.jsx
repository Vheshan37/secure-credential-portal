import {
  AiOutlineEye,
  AiOutlineHistory,
  AiOutlineInfoCircle,
} from "react-icons/ai";

export default function Request({ className, radioName }) {
  return (
    <div
      className={`flex gap-2 bg-blue-50 rounded border-l-[2px] border-blue-600 text-gray-600 items-stretch p-2 ${className}`}
    >
      <div className="flex items-center px-2">
        <input
          type="radio"
          name={radioName}
          className="w-5 h-5 accent-blue-600 rounded border-gray-300 cursor-pointer"
        />
      </div>
      <div className="w-full">
        <div className="flex justify-between border-b border-gray-300">
          <span className="font-semibold">Circuit ID</span>
          <div className="flex gap-2 items-center">
            <span className="text-xs">Date & Time</span>
            <AiOutlineInfoCircle className="text-gray-300 hover:text-gray-600 cursor-pointer transition-all" />{" "}
          </div>
        </div>
        <div className="flex flex-col mt-1 gap-0.5">
          <span className="text-sm">
            <span className="font-semibold">Email:</span> johndoe@gmail.com
          </span>
          <span className="text-sm">
            <span className="font-semibold">Mobile:</span> +94 71 989 2932
          </span>
          <span className="text-sm text-justify line-clamp-2 ">
            <span className="font-semibold">Description:</span> Lorem ipsum
            dolor sit amet consectetur adipisicing elit. Fuga natus odio porro
            quos dolorem accusantium enim laborum rem error. Hic accusantium
            error enim dolorum perferendis iure molestiae vero aliquid harum
            quae ea facilis nisi itaque optio, necessitatibus, pariatur quaerat
            deserunt ad alias assumenda rem sit suscipit exercitationem non.
            Veniam, deserunt!
          </span>
        </div>
      </div>
    </div>
  );
}
