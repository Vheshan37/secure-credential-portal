import { guestLogin } from "@/actions/auth";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useActionState, useRef } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";

export default function GuestLogin({ onClose }) {
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
        onClose();
      },
    });
  };

  const [state, action, isPending] = useActionState(guestLogin, undefined);

  return (
    <div className="absolute z-20 w-full h-full bg-white/5 backdrop-blur-sm flex justify-center items-center">
      <form
        ref={formRef}
        action={action}
        className="bg-blue-50 rounded border border-gray-300 px-2 pt-2 pb-4 min-w-[350px]"
      >
        <div className="text-green-600 flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
          <span className="font-semibold text-lg">Login as a Guest</span>
          <AiOutlineCloseSquare
            onClick={handleClose}
            size={24}
            className="cursor-pointer"
          />
        </div>
        <div className="flex flex-col mb-2">
          <label htmlFor="" className="block mb-1 text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="johndoe@gmail.com"
            name=""
            id=""
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-text"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="" className="block mb-1 text-gray-600">
            Circuit No
          </label>
          <input
            type="text"
            placeholder="E10002345"
            name=""
            id=""
            className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          />
        </div>
        <div className="mb-2 flex justify-start">
          <span className="text-sm text-gray-400 ps-1 pe-4 text-left">
            Your IP and email are used only for session authentication
          </span>
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login as a guest
          </button>
        </div>
      </form>
    </div>
  );
}
