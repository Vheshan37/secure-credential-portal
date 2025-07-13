import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useActionState, useRef } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { MdBlock, MdDoneAll } from "react-icons/md";
import { LiaHourglassEndSolid } from "react-icons/lia";
import Request from "./request";

export default function RequestHistory({ toggleComponent }) {
  const formRef = useRef();

  useGSAP(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: -50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }
    );
  }, []);

  const handleClose = () => {
    gsap.to(formRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        toggleComponent();
      },
    });
  };

  return (
    <div className="absolute z-20 top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm flex justify-center items-center">
      <div
        ref={formRef}
        className="bg-blue-50 flex flex-col rounded border border-gray-300 px-2 pt-2 pb-4 min-w-[350px] max-w-2/3 max-h-2/3 min-h-1/3"
      >
        <div className="text-green-600 flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
          <span className="font-semibold text-lg">Request History</span>
          <AiOutlineCloseSquare
            onClick={handleClose}
            size={24}
            className="cursor-pointer"
          />
        </div>

        <div className="flex flex-col grow overflow-y-auto overflow-x-hidden gap-3">
          <Request className="drop-shadow-md" icon={<LiaHourglassEndSolid className="text-orange-400" />} isFull={false}/>
          <Request className="drop-shadow-md" icon={<MdBlock className="text-red-400" />} isFull={true}/>
          <Request className="drop-shadow-md" icon={<MdDoneAll className="text-green-400" />} isFull={true}/>
          <Request className="drop-shadow-md" icon={<LiaHourglassEndSolid className="text-orange-400" />} isFull={true}/>
          <Request className="drop-shadow-md" icon={<MdBlock className="text-red-400" />} isFull={true}/>
          <Request className="drop-shadow-md" icon={<MdDoneAll className="text-green-400" />} isFull={true}/>
        </div>

        
        
        
      </div>
    </div>
  );
}
