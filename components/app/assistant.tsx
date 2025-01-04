"use client";

import { useVapi } from "../../hooks/useVapi";
import { AppointmentSetup } from "./appointmentsetup";
import { AssistantButton } from "./assistantButton";
import { Display } from "./display";

function Assistant() {
  const { toggleCall, callStatus, audioLevel } = useVapi();
  return (
    <div>
      <div className="user-input mt-6 flex justify-center mb-6">
        <AssistantButton
          audioLevel={audioLevel}
          callStatus={callStatus}
          toggleCall={toggleCall}
        />
      </div>
      <div>
        <AppointmentSetup />
      </div>
    </div>
  );
}

export { Assistant };
