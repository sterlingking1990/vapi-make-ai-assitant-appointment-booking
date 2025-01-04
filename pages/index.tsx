import Image from "next/image";
import { Inter } from "next/font/google";
import { Assistant } from "@/components/app/assistant";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-800">
          Welcome to HealthBuddy Villa
        </h1>
        <p className="text-lg text-blue-700">
          Meet Kassy, your HealthBuddy assistant! She’ll help you schedule
          healthcare appointments with ease and care.
        </p>
        <div>
          <Assistant />
        </div>
      </div>
    </main>
  );
}
