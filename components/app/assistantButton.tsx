import { CALL_STATUS, useVapi } from "@/hooks/useVapi";
import { Loader2, Mic, Square } from "lucide-react";
import { Button } from "../ui/button";

const AssistantButton = ({
  toggleCall,
  callStatus,
  audioLevel = 0,
}: Partial<ReturnType<typeof useVapi>>) => {
  const color =
    callStatus === CALL_STATUS.ACTIVE
      ? "red"
      : callStatus === CALL_STATUS.LOADING
      ? "orange"
      : "green";
  const buttonStyle = {
    borderRadius: "50%",
    width: "60px",
    height: "60px",
    color: "white",
    border: "none",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor:
      callStatus === CALL_STATUS.ACTIVE
        ? "red"
        : callStatus === CALL_STATUS.LOADING
        ? "orange"
        : "green",
    cursor: "pointer",
  };

  return (
    <Button
      style={buttonStyle}
      className={`transition ease-in-out duration-200 flex items-center justify-center text-white text-xl font-bold ${
        callStatus === CALL_STATUS.ACTIVE
          ? "bg-red-600 hover:bg-red-800"
          : callStatus === CALL_STATUS.LOADING
          ? "bg-orange-500 hover:bg-orange-600"
          : "bg-green-500 hover:bg-green-600"
      }`}
      onClick={toggleCall}
    >
      {callStatus === CALL_STATUS.ACTIVE ? (
        <Square />
      ) : callStatus === CALL_STATUS.LOADING ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Mic />
      )}
    </Button>
  );
};

export { AssistantButton };
