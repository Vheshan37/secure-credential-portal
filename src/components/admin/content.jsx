import Request from "./request";
import ResponseForm from "./responseForm";

export default function Content({requestToggler, historyToggler}) {
  return (
    <div className="p-4 h-full w-full flex flex-col overflow-hidden">
      {/* Top */}
      <div className="border-b pb-2 border-gray-300">
        <span className="text-green-600 text-xl font-semibold">
          Admin Panel
        </span>
      </div>
      {/* Center */}
      <div className="h-full w-full p-4 flex gap-8">
        <div className="w-2/3 border border-gray-300 rounded shadow-md p-4 flex flex-col">
          <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
            Client Requests
          </div>
          <div className="my-2 h-full gap-4 flex flex-col overflow-y-auto overflow-x-hidden">
            {/* Request Component */}
            <Request className="shadow-md" radioName="requestGroup" requestToggler={requestToggler} historyToggler={historyToggler}/>
            <Request className="shadow-md" radioName="requestGroup" requestToggler={requestToggler} historyToggler={historyToggler}/>
            <Request className="shadow-md" radioName="requestGroup" requestToggler={requestToggler} historyToggler={historyToggler}/>
            <Request className="shadow-md" radioName="requestGroup" requestToggler={requestToggler} historyToggler={historyToggler}/>
            <Request className="shadow-md" radioName="requestGroup" requestToggler={requestToggler} historyToggler={historyToggler}/>
            <Request className="shadow-md" radioName="requestGroup" requestToggler={requestToggler} historyToggler={historyToggler}/>
          </div>
        </div>
        <div className="w-1/3 border border-gray-300 rounded shadow-md p-4 flex flex-col">
          <div className="text-green-600 font-semibold text-lg border-b border-gray-300 pb-2">
            Send Response
          </div>
          <div className="my-2 h-full overflow-y-auto overflow-x-hidden">
            <ResponseForm/>
          </div>
        </div>
      </div>
    </div>
  );
}
