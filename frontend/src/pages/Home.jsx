import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import TourCard from '../components/TourCard';
import { oneDayTours, tourPackages, taxiServices, hotels, features, achievements } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Home = () => {
  const { toast } = useToast();
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [apiOneDayTours, setApiOneDayTours] = useState([]);
  const [apiTourPackages, setApiTourPackages] = useState([]);

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      toast({
        title: 'Message Sent!',
        description: "Thank you for contacting us. We'll get back to you shortly.",
      });
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Contact form submit nahi ho paya. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursResponse, packagesResponse] = await Promise.all([
          fetch(`${backendUrl}/api/one-day-tours`),
          fetch(`${backendUrl}/api/tour-packages`),
        ]);

        if (toursResponse.ok) {
          const toursData = await toursResponse.json();
          setApiOneDayTours(Array.isArray(toursData) ? toursData : []);
        }
        if (packagesResponse.ok) {
          const packagesData = await packagesResponse.json();
          setApiTourPackages(Array.isArray(packagesData) ? packagesData : []);
        }
      } catch (error) {
        console.error('Error fetching home page API data:', error);
      }
    };

    fetchData();
  }, [backendUrl]);

  const mergedOneDayTours = useMemo(() => {
    const merged = [...oneDayTours];
    const existingIds = new Set(oneDayTours.map((tour) => tour.id));
    apiOneDayTours.forEach((tour) => {
      if (!existingIds.has(tour.id)) {
        merged.push(tour);
      }
    });
    return merged;
  }, [apiOneDayTours]);

  const mergedTourPackages = useMemo(() => {
    const merged = [...tourPackages];
    const existingIds = new Set(tourPackages.map((pkg) => pkg.id));
    apiTourPackages.forEach((pkg) => {
      if (!existingIds.has(pkg.id)) {
        merged.push(pkg);
      }
    });
    return merged;
  }, [apiTourPackages]);

  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About</h2>
            <h3 className="text-2xl font-semibold text-orange-600 mb-6">AbhimanyuHolidays</h3>
          </div>
          <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed space-y-4">
            <p>
              Abhimanyu Holidays is a premier travel and tour company dedicated to crafting unforgettable travel experiences across both domestic and international destinations. Renowned for its reliability, transparency, and meticulous attention to detail, Abhimanyu Holidays is a trusted partner for travelers seeking seamless and memorable vacations.
            </p>
            <p>
              With a strong commitment to customer satisfaction, the company offers a comprehensive suite of services, including customized tour packages, flight and hotel bookings, and expertly guided tours. One of the key strengths of Abhimanyu Holidays is its personalized approach to travel planning. Every itinerary is thoughtfully designed to reflect the client's preferences, budget, and travel aspirations — whether it's a romantic getaway, a family vacation, or a corporate retreat.
            </p>
            <p>
              Backed by a team of experienced travel professionals and a robust global network of partners, Abhimanyu Holidays continues to expand its footprint in the travel industry, delivering exceptional service and creating journeys that leave lasting impressions.
            </p>
            <div className="text-center mt-8">
              <Link
                to="/about"
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
              >
                Read More <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* One Day Tours */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              ABHIMANYU HOLIDAYS
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-600">One Day Tours</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {mergedOneDayTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/one-day-tours"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Explore All One Day Tours <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Tour Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              ABHIMANYU HOLIDAYS
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-orange-600 mb-4">Tour Packages</h3>
            <p className="text-gray-600">Explore most popular & best travel deals at affordable price.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mergedTourPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                  <Link
                    to={`/tour-packages/${pkg.id}`}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Read More <ArrowRight className="ml-1" size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Taxi Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              ABHIMANYU HOLIDAYS
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-600">Taxi Services</h3>
          </div>
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
                <div className="p-5">
                  <img
                    src={taxi.image}
                    alt={taxi.name}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{taxi.name}</h3>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <p>{taxi.seats}</p>
                    <p>{taxi.fuel}</p>
                    <p>{taxi.transmission}</p>
                    <p>{taxi.ac}</p>
                  </div>
                  <Link
                    to="/contact"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md font-semibold transition-colors"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Booking */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Abhimanyu Holidays
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-orange-600 mb-4">Hotel Booking</h3>
            <p className="text-gray-600">Premium accommodations showcasing Rajasthan's royal hospitality and modern comforts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.slice(0, 6).map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">AMENITIES</h4>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/hotels/${hotel.id}`}
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    Read More <ArrowRight className="ml-1" size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Abhimanyu Holidays
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold text-blue-600">What We Offer</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-20 h-20 mx-auto mb-4"
                />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Contact us by mail, fill the contact form below.
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
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
                  value={contactForm.email}
                  onChange={handleContactChange}
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
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message *
                </label>
                <textarea
                  rows="5"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">OUR ACHIEVEMENTS</h2>
            <p className="text-xl">Numbers That Speak Our Success.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{achievement.number}</div>
                <div className="text-sm md:text-base">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
