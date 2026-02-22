import React, { useState } from 'react';
import { taxiServices } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { Car } from 'lucide-react';

const TaxiServices = () => {
  const { toast } = useToast();
  const [selectedTaxi, setSelectedTaxi] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    pickupTime: '',
    message: ''
  });

  const handleBooking = (taxi) => {
    setSelectedTaxi(taxi);
    window.scrollTo({ top: document.getElementById('booking-form').offsetTop - 100, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Taxi Booking Request Submitted!",
      description: `We'll contact you shortly to confirm your ${selectedTaxi?.name || 'taxi'} booking.`,
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      pickupLocation: '',
      dropLocation: '',
      pickupDate: '',
      pickupTime: '',
      message: ''
    });
    setSelectedTaxi(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Taxi Services</h1>
          <p className="text-xl">Comfortable and reliable transportation for your journey</p>
        </div>
      </div>

      {/* Taxi Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {taxiServices.map((taxi) => (
            <div
              key={taxi.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
            >
              {taxi.popular && (
                <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                  Popular
                </div>
              )}
              <div className="p-6">
                <img
                  src={taxi.image}
                  alt={taxi.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{taxi.name}</h3>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="font-semibold mr-2">Seats:</span> {taxi.seats}
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold mr-2">Fuel:</span> {taxi.fuel}
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold mr-2">Transmission:</span> {taxi.transmission}
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold mr-2">AC:</span> {taxi.ac}
                  </p>
                  <p className="flex items-center text-orange-600 font-bold">
                    <span className="mr-2">Rate:</span> {taxi.pricePerKm}/km
                  </p>
                </div>
                <button
                  onClick={() => handleBooking(taxi)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition-colors"
                >
                  Book Now →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Form */}
      <div id="booking-form" className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Car className="mx-auto mb-4 text-orange-600" size={48} />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedTaxi ? `Book ${selectedTaxi.name}` : 'Book a Taxi'}
            </h2>
            <p className="text-gray-600">Fill out the form below and we'll contact you shortly</p>
          </div>

          <div className="bg-gray-50 rounded-lg shadow-md p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Location *
                  </label>
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drop Location *
                  </label>
                  <input
                    type="text"
                    name="dropLocation"
                    value={formData.dropLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date *
                  </label>
                  <input
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time *
                  </label>
                  <input
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold transition-colors"
              >
                Submit Booking Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxiServices;