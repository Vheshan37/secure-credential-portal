import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";

export default function RequestPopUp({ toggleComponent, request }) {
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
        className="bg-blue-50 flex flex-col rounded border border-gray-300 px-4 pt-4 pb-6 min-w-[350px] max-w-[80%] max-h-[90vh] overflow-y-auto"
      >
        <div className="text-green-600 flex justify-between items-center pb-2 mb-4">
          <span className="font-semibold text-lg">User's Request</span>
          <AiOutlineCloseSquare
            onClick={handleClose}
            size={24}
            className="cursor-pointer hover:text-red-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Personal Details */}
          <div className="w-full md:w-1/2 min-w-[250px]">
            <div className="text-gray-900 font-semibold border-b border-gray-300 mb-2">
              <span>Personal Details</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-gray-600">Name</label>
                <input
                  type="text"
                  id="name"
                  value={request?.name || ""}
                  disabled
                  className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="designation" className="text-gray-600">Designation</label>
                <input
                  type="text"
                  id="designation"
                  value={request?.designation || ""}
                  disabled
                  className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  value={request?.user?.email || ""}
                  disabled
                  className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-no" className="text-gray-600">Contact No</label>
                <input
                  type="tel"
                  id="contact-no"
                  value={request?.contact_no || ""}
                  disabled
                  className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="w-full md:w-1/2 min-w-[250px]">
            <div className="text-gray-900 font-semibold border-b border-gray-300 mb-2">
              <span>Service Details</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="circuit-id" className="text-gray-600">Circuit ID</label>
                <input
                  type="text"
                  id="circuit-id"
                  value={request?.circuit_no || ""}
                  disabled
                  className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="company-name" className="text-gray-600">Company Name</label>
                <input
                  type="text"
                  id="company-name"
                  value={request?.company || ""}
                  disabled
                  className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="service" className="text-gray-600">Service</label>
                <input
                  type="text"
                  id="service"
                  value={request?.service || ""}
                  disabled
                  className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <label htmlFor="description" className="text-gray-600">Description</label>
          <textarea
            id="description"
            rows={6}
            value={request?.description || ""}
            disabled
            className="transition rounded border-[0.5px] border-l-[2px] border-l-blue-600 py-2 px-3 border-blue-100 bg-gray-50 text-gray-700 focus:outline-none cursor-not-allowed resize-none overflow-y-auto"
            style={{ minHeight: '150px' }}
          ></textarea>
        </div>
      </div>
    </div>
  );
}