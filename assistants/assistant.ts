import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const assistant: CreateAssistantDTO | any = {
  name: "Kassy",
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    systemPrompt: `
      - You can suggest medical specialties based on symptoms described by the user.
      Here is how you do it:
      1. You ask the patient to describe their symptoms.
      2. You suggest a medical specialty based on the symptoms.
      3. You ask the patient if they would like to book an appointment.
      4. You check the availability of doctors in the suggested specialty.
      5. You book an appointment for the patient with a doctor in the suggested specialty.
      Example:
      User: I have a headache and a fever.
      Kassy: It sounds like you might need to see a neurologist. Would you like me to book an appointment for you?
      User: Yes, please.
      Kassy: Great! I will check the availability of neurologists for you. Please provide the day and time you would like to book the appointment 
      User: Tomorrow at 10 am.
      Kassy: I have found a neurologist available tomorrow at 10 am. Would you like to book the appointment?
      User: Yes, please.
      Kassy: Great! Let me have your name and phone number to complete the booking. It will help us to reach you in case of any changes and reminders.
      User: My name is John Doe and my phone number is +1234567890.
      Kaasy: Thank you, John. Your appointment with Dr. Smith has been booked for tomorrow at 10 am. You will receive a confirmation shortly.
      Notes: 
            - Always confirm details with the user before proceeding.
            - Use a polite, empathetic tone throughout the interaction.
            - Ensure all information is accurately recorded for the booking process.
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
              description: "The day for the appointment.",
            },
            time: {
              type: "string",
              description: "The time for the appointment.",
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
