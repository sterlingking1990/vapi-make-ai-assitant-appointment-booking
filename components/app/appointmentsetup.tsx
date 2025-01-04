import { Message, MessageTypeEnum } from "@/lib/types/conversation.type";
import { vapi } from "@/lib/vapi.sdk";
import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Appointment {
  appointmentID: string;
  specialty: string;
  doctor: string;
  appointmentDate: string;
  appointmentTime: string;
}

function AppointmentSetup() {
  const [appointment, setAppointment] = React.useState<Appointment | null>(
    null
  );

  const detailsRef = useRef(null);

  const downloadAsImage = async () => {
    if (detailsRef.current) {
      const canvas = await html2canvas(detailsRef.current);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "appointment-card.png";
      link.click();
    }
  };

  // Function to download as a PDF
  const downloadAsPDF = async () => {
    if (detailsRef.current) {
      const canvas = await html2canvas(detailsRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10, 180, 0); // Adjust dimensions as needed
      pdf.save("appointment-card.pdf");
    }
  };

  useEffect(() => {
    const onMessageUpdate = (message: Message) => {
      if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        message.functionCall.name === "suggestSpecialty"
      ) {
        const params = message.functionCall.parameters;
        fetch("/api/makewebhook", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        })
          .then(async (response) => {
            const data = await response.json();

            if (response.ok) {
              console.log("Webhook response:", data);
              // Based on the webhook response, update the UI
              //setLoadingStatus("success"); // Successfully reserved
              if (data.result === "no specialty") {
                vapi.send({
                  type: MessageTypeEnum.ADD_MESSAGE,
                  message: {
                    role: "system",
                    content: `We do not have specialty for your case, we are still expanding please bear with us `,
                  },
                });
              } else {
                vapi.send({
                  type: MessageTypeEnum.ADD_MESSAGE,
                  message: {
                    role: "system",
                    content: `You are expected to see : ${JSON.stringify(
                      data.result
                    )}`,
                  },
                });
              }
            } else {
              console.error("Error in webhook response:", data.message);
              //setLoadingStatus("error"); // Failed to reserve
            }
          })
          .catch((error) => {
            console.error("Error sending reservation to webhook:", error);
            //setLoadingStatus("error");
          });
      } else if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        message.functionCall.name === "checkAvailability"
      ) {
        const params = message.functionCall.parameters;
        fetch("/api/checkavailabilitywh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        })
          .then(async (response) => {
            const data = await response.json();

            if (response.ok) {
              console.log("Webhook response:", data);
              if (data.doctorID === "") {
                vapi.send({
                  type: MessageTypeEnum.ADD_MESSAGE,
                  message: {
                    role: "system",
                    content: `The specialty you intend to consult is not available for that day and time`,
                  },
                });
              } else {
                vapi.send({
                  type: MessageTypeEnum.ADD_MESSAGE,
                  message: {
                    role: "system",
                    content: `The specialty was found and available here are the details : ${JSON.stringify(
                      data.doctor
                    )}`,
                  },
                });
              }
            } else {
              console.error("Error in webhook response:", data.message);
              //setLoadingStatus("error"); // Failed to reserve
            }
          })
          .catch((error) => {
            console.error("Error sending reservation to webhook:", error);
            //setLoadingStatus("error");
          });
      } else if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        message.functionCall.name === "bookAppointment"
      ) {
        const params = message.functionCall.parameters;
        fetch("/api/bookappointmentwh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        })
          .then(async (response) => {
            const data = await response.json();
            setAppointment(data);

            if (response.ok) {
              console.log("Webhook response:", data);
              vapi.send({
                type: MessageTypeEnum.ADD_MESSAGE,
                message: {
                  role: "system",
                  content: `Your appointment has been successfully created. Ensure to arrive 15min earlier: ${JSON.stringify(
                    data.doctor
                  )}`,
                },
              });
            } else {
              console.error("Error in webhook response:", data.message);
              //setLoadingStatus("error"); // Failed to reserve
            }
          })
          .catch((error) => {
            console.error("Error sending reservation to webhook:", error);
            //setLoadingStatus("error");
          });
      }
    };
    const reset = () => {
      console.log("reset is done");
      setAppointment(null);
    };

    vapi.on("message", onMessageUpdate);
    vapi.on("call-end", reset);
    return () => {
      vapi.off("message", onMessageUpdate);
      vapi.off("call-end", reset);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-200 to-blue-500 flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg text-center space-y-4">
        <h1 className="text-3xl font-semibold text-blue-800">
          Your appointment schedule card
        </h1>
        {appointment ? (
          <div
            ref={detailsRef}
            className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 text-left"
          >
            <p className="text-lg text-blue-800">
              <strong>Specialty:</strong> {appointment.specialty}
            </p>
            <p className="text-lg text-blue-800">
              <strong>Doctor:</strong> {appointment.doctor}
            </p>
            <p className="text-lg text-blue-800">
              <strong>AppointmentID:</strong> {appointment.appointmentID}
            </p>
            <p className="text-lg text-blue-800">
              <strong>Date:</strong> {appointment.appointmentDate}
            </p>
            <p className="text-lg text-blue-800">
              <strong>Time:</strong> {appointment.appointmentTime}
            </p>
            <div className="mt-6 text-center text-sm text-gray-700">
              Endeavor to come 15 minutes before your appointment time.
            </div>
          </div>
        ) : (
          <p className="text-blue-700">No appointment scheduled yet.</p>
        )}
        {appointment && (
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={downloadAsImage}
              className="flex items-center px-6 py-2 bg-green-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-green-600 focus:ring focus:ring-green-300 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Download as Image
            </button>
            <button
              onClick={downloadAsPDF}
              className="flex items-center px-6 py-2 bg-blue-500 text-white text-sm font-medium rounded-md shadow-md hover:bg-blue-600 focus:ring focus:ring-blue-300 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Download as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { AppointmentSetup };
