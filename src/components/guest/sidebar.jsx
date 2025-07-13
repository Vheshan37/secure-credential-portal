import { GiExitDoor } from "react-icons/gi";

export default function SideBar({className}) {
  return (
    <div className={`${className}`}>
      <img src="/images/logo.png" alt="" className="max-w-[160px]"/>
      <span className="text-white font-bold text-xl text-center">ADMINISTRATOR COMPANY</span>      
    </div>
  );
}
