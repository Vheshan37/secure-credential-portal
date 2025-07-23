import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { AiOutlineCloseSquare } from "react-icons/ai";
import { MdBlock, MdDoneAll } from "react-icons/md";
import { LiaHourglassEndSolid } from "react-icons/lia";
import Request from "./request";

export default function RequestHistory({ toggleComponent, email }) {
  const formRef = useRef();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/requestHistory?email=${email}`
        );
        const data = await response.json();
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
      setLoading(false);
    };

    if (email) {
      fetchHistory();
    }
  }, [email]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <LiaHourglassEndSolid className="text-orange-400" />;
      case "rejected":
        return <MdBlock className="text-red-400" />;
      case "completed":
        return <MdDoneAll className="text-green-400" />;
      default:
        return <LiaHourglassEndSolid className="text-orange-400" />;
    }
  };

  return (
    <div className="absolute z-20 top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm flex justify-center items-center">
      <div
        ref={formRef}
        className="bg-blue-50 flex flex-col rounded border border-gray-300 px-2 pt-2 pb-4 min-w-2/3 max-w-4/5 max-h-2/3 min-h-1/3"
      >
        <div className="text-green-600 flex justify-between items-center border-b border-gray-300 pb-2 mb-4">
          <span className="font-semibold text-lg">
            Request History for {email}
          </span>
          <AiOutlineCloseSquare
            onClick={handleClose}
            size={24}
            className="cursor-pointer"
          />
        </div>

        <div className="flex flex-col grow overflow-y-auto overflow-x-hidden gap-3">
          {loading ? (
            <div className="text-center py-4">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-4">No history found</div>
          ) : (
            history.map((req) => (
              <Request
                key={req.id}
                request={req}
                className="drop-shadow-md"
                icon={getStatusIcon(req.status.status)}
                isFull={true}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
