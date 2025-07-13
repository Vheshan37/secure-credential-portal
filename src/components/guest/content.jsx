import { MdBlock, MdDoneAll } from "react-icons/md";
import { LiaHourglassEndSolid } from "react-icons/lia";
import Request from "../guest/request";
import RequestForm from "./requestForm";
import SystemCredential from "./systemCredential";

export default function () {
  return (
    <div className="p-4 h-full w-full flex flex-col overflow-hidden">
      {/* Top */}
      <div className="border-b pb-2 border-gray-300">
        <span className="text-green-600 text-xl font-semibold">
          Guest Panel
        </span>
      </div>
      {/* Center */}
      <div className="h-full w-full p-4 flex gap-6">
        <div className="w-2/3 border border-gray-300 rounded shadow-md p-4 flex flex-col">
          <div className="text-green-600 font-semibold text-lg pb-2">
            Request Form
          </div>
          <div className="my-2 h-full gap-4 flex flex-col overflow-y-auto overflow-x-hidden">
            <RequestForm />
          </div>
        </div>
        <div className="w-1/3 flex flex-col gap-6">
          <div className="border border-gray-300 rounded h-1/2 shadow-md p-4 flex flex-col gap-2">
            <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
              Request History
            </div>
            <div className="grow overflow-y-auto overflow-x-hidden flex flex-col gap-2">
              <Request
                icon={<LiaHourglassEndSolid className="text-orange-400" />}
              />
              <Request icon={<MdDoneAll className="text-green-400" />} />
              <Request icon={<MdBlock className="text-red-400" />} />
            </div>
          </div>
          <div className="border border-gray-300 rounded h-1/2 shadow-md p-4 flex flex-col gap-2">
            <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
              System Credentials
            </div>
            <div className="grow overflow-y-auto flex flex-col gap-2">
              <SystemCredential/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
