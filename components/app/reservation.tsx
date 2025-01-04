import React from "react";

interface ReservationProps {
  params: any;
  onSubmit: (formData: { day: string; numberOfGuests: string }) => void;
}

export const Reservation: React.FC<ReservationProps> = ({
  params,
  onSubmit,
}) => {
  const [formData, setFormData] = React.useState({ params });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.params);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
          Movie Reservation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="day"
              className="block text-sm font-medium text-gray-700"
            >
              Day of Reservation
            </label>
            <input
              type="text"
              id="day"
              name="day"
              value={formData.params.day}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter reservation day"
            />
          </div>
          <div>
            <label
              htmlFor="numberOfGuests"
              className="block text-sm font-medium text-gray-700"
            >
              Number of Guests
            </label>
            <input
              type="text"
              id="numberOfGuests"
              name="numberOfGuests"
              value={formData.params.numberOfGuests}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of guests"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
