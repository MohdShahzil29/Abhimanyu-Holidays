import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { oneDayTours } from '../data/mockData';
import { Clock, MapPin, ArrowLeft, Calendar, Users } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TourDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [apiTour, setApiTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const tour = oneDayTours.find((t) => t.id === id) || apiTour;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    adults: '1',
    children: '0',
    message: ''
  });

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/one-day-tours/${id}`,
        );
        if (response.ok) {
          const data = await response.json();
          setApiTour(data);
        }
      } catch (error) {
        console.error('Error fetching one day tour detail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (oneDayTours.some((t) => t.id === id)) {
      setIsLoading(false);
      return;
    }

    fetchTour();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading tour...</p>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h2>
          <Link to="/one-day-tours" className="text-orange-600 hover:text-orange-700">
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock booking submission
    toast({
      title: "Booking Request Submitted!",
      description: "We'll contact you shortly to confirm your tour booking.",
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      adults: '1',
      children: '0',
      message: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/one-day-tours"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to One Day Tours
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Tour Details */}
          <div>
            <img
              src={tour.image}
              alt={tour.title}
              className="w-full h-96 object-cover rounded-lg shadow-lg mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{tour.description}</p>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center text-gray-700">
                <Clock className="mr-2 text-orange-600" size={20} />
                <span className="font-semibold">{tour.duration}</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{tour.price}</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tour Highlights</h3>
              <ul className="space-y-2">
                {tour.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-600 mr-2">✓</span>
                    <span className="text-gray-700">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tour Details</h3>
              <p className="text-gray-700 leading-relaxed">{tour.details}</p>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book This Tour</h2>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tour Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adults
                    </label>
                    <input
                      type="number"
                      name="adults"
                      value={formData.adults}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Children
                    </label>
                    <input
                      type="number"
                      name="children"
                      value={formData.children}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
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
    </div>
  );
};

export default TourDetail;
