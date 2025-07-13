import Content from "@/components/guest/content";
import SideBar from "@/components/guest/sidebar";

export default function Admin() {
  return (
    <>
      <div className="w-screen h-screen flex bg-white overflow-hidden">
        <SideBar className="bg-gradient-to-b from-blue-900 to-green-900 w-fit p-4 h-full flex flex-col justify-center items-center shadow-lg shadow-gray-500 max-w-[300px]" />
        {/* Content */}
        <Content/>
      </div>
    </>
  );
}
