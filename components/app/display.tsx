import { shows } from "@/data/shows";
import { Message, MessageTypeEnum } from "@/lib/types/conversation.type";
import { vapi } from "@/lib/vapi.sdk";
import React, { useEffect } from "react";
import { ShowsComponent } from "./shows";
import { Ticket } from "./ticket";

import { Reservation } from "./reservation";

function Display() {
  const [showList, setShowList] = React.useState<Array<(typeof shows)[number]>>(
    []
  );

  const [status, setStatus] = React.useState<
    "show" | "confirm" | "ticket" | "reservation"
  >("show");

  const [loadingStatus, setLoadingStatus] = React.useState<
    "success" | "error" | "loading"
  >("loading");

  const [selectedShow, setSelectedShow] = React.useState<
    (typeof shows)[number] | null
  >(null);

  const [confirmDetails, setConfirmDetails] = React.useState<{}>();

  useEffect(() => {
    const onMessageUpdate = (message: Message) => {
      if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        message.functionCall.name === "suggestShows"
      ) {
        setStatus("show");
        vapi.send({
          type: MessageTypeEnum.ADD_MESSAGE,
          message: {
            role: "system",
            content: `Here is the list of suggested shows: ${JSON.stringify(
              shows.map((show) => show.title)
            )}`,
          },
        });
        setShowList(shows);
      } else if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        (message.functionCall.name === "confirmDetails" ||
          message.functionCall.name === "bookTickets")
      ) {
        const params = message.functionCall.parameters;

        setConfirmDetails(params);
        console.log("parameters", params);

        const result = shows.find(
          (show) => show.title.toLowerCase() == params.show.toLowerCase()
        );
        setSelectedShow(result ?? shows[0]);

        setStatus(
          message.functionCall.name === "confirmDetails" ? "confirm" : "ticket"
        );
      } else if (
        message.type === MessageTypeEnum.FUNCTION_CALL &&
        message.functionCall.name === "checkReservation"
      ) {
        const params = message.functionCall.parameters;
        setConfirmDetails(params);
        setStatus("reservation");

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
              setLoadingStatus("success"); // Successfully reserved
            } else {
              console.error("Error in webhook response:", data.message);
              setLoadingStatus("error"); // Failed to reserve
            }
          })
          .catch((error) => {
            console.error("Error sending reservation to webhook:", error);
            setLoadingStatus("error");
          });
      }
    };

    const reset = () => {
      setStatus("reservation");
      setShowList([]);
      setSelectedShow(null);
    };

    vapi.on("message", onMessageUpdate);
    vapi.on("call-end", reset);
    return () => {
      vapi.off("message", onMessageUpdate);
      vapi.off("call-end", reset);
    };
  }, []);

  return (
    <>
      {showList.length > 0 && status == "show" ? (
        <ShowsComponent showList={showList} />
      ) : null}

      {status !== "show" && status !== "reservation" ? (
        <Ticket
          type={status}
          show={selectedShow ?? shows[0]}
          params={confirmDetails}
        />
      ) : null}
      {status === "reservation" ? (
        <Reservation
          params={confirmDetails}
          onSubmit={(formData) =>
            console.log("Reservation submitted with:", formData)
          }
        />
      ) : null}
    </>
  );
}

export { Display };
