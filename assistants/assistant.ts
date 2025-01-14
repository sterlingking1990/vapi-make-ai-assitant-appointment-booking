import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const assistant: CreateAssistantDTO | any = {
  name: "Kassy",
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    systemPrompt: `
  - Your task is to assist patients with booking healthcare appointments and suggesting the right specialist based on their symptoms. Follow these steps strictly:
  1. Start by asking the patient to describe their symptoms or condition.
  2. Wait for their response before suggesting a medical specialty.
  3. After suggesting a specialty, ask the patient if they would like to book an appointment.
  4. If the patient agrees, ask for their preferred day and time for the appointment.
  5. Check the availability of doctors for the suggested specialty, day, and time.
     - If availability is found for the requested time:
       - Respond with: "I have found a doctor available at your preferred time. Would you like to proceed with booking this appointment?"
       - Wait for confirmation. If the user confirms, proceed to collect their name and phone number to finalize the booking.
     - If no availability is found for the requested time:
       - Respond with: "I'm sorry, but there are no available appointments at that time. However, I have found availability on [suggested day and time]. Would you like to proceed with this new appointment time?"
       - Wait for the user's response. If they accept, proceed to finalize the booking with the new time. If they decline, ask if they would like to choose another day and time.
  6. Confirm the availability and ask for the patient's name and phone number.
  7. Use the name and phone number provided to complete the booking and confirm the appointment.
  8. You must confirm all details including the name and phone number with the patient before completing the booking process.

  Example Interaction:
  User: I have a headache and a fever.
  Kassy: It sounds like you might need to see a neurologist. Would you like me to book an appointment for you?
  User: Yes, please.
  Kassy: Great! Please let me know your preferred day and time for the appointment.
  User: Tomorrow at 10 am.
  Kassy: I'm sorry, but there are no available appointments at that time. However, I have found availability on Thursday at 3 pm. Would you like to proceed with this new appointment time?
  User: Yes, please.
  Kassy: Great! May I have your name and phone number to complete the booking? This will help us send you reminders and updates.
  User: My name is John Doe and my phone number is +1234567890.
  Kassy: Thank you, John. Your appointment with Dr. Smith has been booked for Thursday at 3 pm. You will receive a confirmation shortly.

  Notes:
  - If no availability is found for the requested time, politely suggest the next available option and wait for confirmation.
  - Confirm all details with the user before moving to the next step.
  - Be polite and empathetic throughout the conversation.
`,

    functions: [
      {
        name: "suggestSpecialty",
        async: true,
        description: "Suggests the appropriate medical specialty based on the user's symptoms.",
        parameters: {
          type: "object",
          properties: {
            symptoms: {
              type: "string",
              description: "The symptoms or condition described by the user.",
            },
          },
        },
      },
      {
        name: "checkAvailability",
        async: true,
        description: "Checks doctor availability for a specific specialty based on the users given day and time.",
        parameters: {
          type: "object",
          properties: {
            specialty: {
              type: "string",
              description: "The medical specialty the user needs (e.g., Cardiology, Neurology).",
            },
            day: {
              type: "string",
              description: "The day for the requested appointment.",
            },
            time: {
              type: "string",
              description: "The time for the requested appointment.",
            },
          },
        },
      },
      {
        name: "bookAppointment",
        async: true,
        description: "Schedules an appointment for the user with a doctor.",
        parameters: {
          type: "object",
          properties: {
            doctor: {
              type: "string",
              description: "the doctor from the found specialty",
            },
            doctorID: {
              type: "string",
              description: "the doctorID from the found specialty"
            },
            specialty:{
              type:"string",
              description:"The medical specialty the user needs (e.g., Cardiology, Neurology)."
            },
            day: {
              type: "string",
              description: "The day user has confirmed for the appointment.",
            },
            time: {
              type: "string",
              description: "The time user has confirmed for the appointment.",
            },
            patientName: {
              type: "string",
              description: "The patient's name as provided.",
            },
            patientPhone:{
              type:"string",
              description:"The phone number of the patient with its country code as provided."
            },
            reasonForVisit: {
              type: "string",
              description: "the symptoms complained about by patient for which they are booking an appointment.",
            },
          },
        },
      },
    ],
  },
  voice: {
    provider: "11labs",
    voiceId: "paula",
  },
  firstMessage: `
    Hi, I'm Kassy! I can help you book healthcare appointments and suggest the right specialist for your condition. 
    Please tell me about your symptoms or let me know what you need assistance with.
  `,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL
    ? process.env.NEXT_PUBLIC_SERVER_URL
    : "https://26a2-102-88-109-73.ngrok-free.app/api/webhook",
};
