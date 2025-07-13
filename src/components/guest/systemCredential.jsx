export default function SystemCredential() {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-gray-700">OTP Code</span>
      <div className="flex gap-1">
        <input
          type="text"
          name=""
          id=""
          maxLength={1}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 w-[40px] text-center font-semibold"
        />
        <input
          type="text"
          name=""
          id=""
          maxLength={1}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 w-[40px] text-center font-semibold"
        />
        <input
          type="text"
          name=""
          id=""
          maxLength={1}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 w-[40px] text-center font-semibold"
        />
        <input
          type="text"
          name=""
          id=""
          maxLength={1}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 w-[40px] text-center font-semibold"
        />
        <input
          type="text"
          name=""
          id=""
          maxLength={1}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 w-[40px] text-center font-semibold"
        />
        <input
          type="text"
          name=""
          id=""
          maxLength={1}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 w-[40px] text-center font-semibold"
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded w-full cursor-pointer">
          Verify
        </button>
      </div>
      <span className="text-sm text-gray-600">
        Enter the OTP you received to decrypt your credentials.
      </span>
      <div className="flex flex-col gap-2 pt-4">
        <input
          type="text"
          name=""
          id=""
          placeholder="Username"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 text-center font-semibold"
        />
        <input
          type="password"
          name=""
          id=""
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition text-gray-600 text-center font-semibold"
        />
      </div>
    </div>
  );
}
