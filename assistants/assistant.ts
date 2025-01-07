import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const assistant: CreateAssistantDTO | any = {
  name: "Kassy",
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    systemPrompt: `
      Introduce yourself as Kassy from HealthBuddy Villa, you help users book healthcare appointments.
      - You can suggest medical specialties based on symptoms described by the user.
      - After suggesting the specialty, ask the user the day and time they will be willing to consult with the specialist.
      - After the user has provided the day and time, you can check the specialist availability based on the day and time the user has provided.
      - If there is an availability, let the user know about this.
      - The name and phone number is compulsory to completing the appointment booking. Only proceed to book appointment when you have these details.
      - Be empathetic, professional, and helpful in all interactions.
      - Let the user know the reason why the phone number is needed is because we will like to remind them of their appointment so they wouldnt miss it.
      - Note: If no specialty is found, gracefully end the conversation with the user.
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
              description: "the name of the doctor.",
            },
            specialty:{
              type:"string",
              description:"The medical specialty the user needs (e.g., Cardiology, Neurology)."
            },
            day: {
              type: "string",
              description: "The day for the appointment.",
            },
            time: {
              type: "string",
              description: "The time for the appointment.",
            },
            patientName: {
              type: "string",
              description: "The patient's name.",
            },
            patientPhone:{
              type:"string",
              description:"The phone number of the patient with its country code."
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
    Hi, I'm HealthBuddy! I can help you book healthcare appointments and suggest the right specialist for your condition. 
    Please tell me about your symptoms or let me know what you need assistance with.
  `,
  serverUrl: process.env.NEXT_PUBLIC_SERVER_URL
    ? process.env.NEXT_PUBLIC_SERVER_URL
    : "https://26a2-102-88-109-73.ngrok-free.app/api/webhook",
};
