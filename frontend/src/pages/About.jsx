import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl">Your Trusted Travel Partner</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            <span className="text-orange-600">Abhimanyu</span>
            <span className="text-blue-600">Holidays</span>
          </h2>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Abhimanyu Holidays is a premier travel and tour company dedicated to crafting unforgettable travel experiences across both domestic and international destinations. Renowned for its reliability, transparency, and meticulous attention to detail, Abhimanyu Holidays is a trusted partner for travelers seeking seamless and memorable vacations.
            </p>

            <p>
              With a strong commitment to customer satisfaction, the company offers a comprehensive suite of services, including customized tour packages, flight and hotel bookings, and expertly guided tours. One of the key strengths of Abhimanyu Holidays is its personalized approach to travel planning.
            </p>

            <p>
              Every itinerary is thoughtfully designed to reflect the client's preferences, budget, and travel aspirations — whether it's a romantic getaway, a family vacation, or a corporate retreat. Our experienced travel consultants work closely with clients to understand their unique needs and create tailored experiences that exceed expectations.
            </p>

            <p>
              Backed by a team of experienced travel professionals and a robust global network of partners, Abhimanyu Holidays continues to expand its footprint in the travel industry, delivering exceptional service and creating journeys that leave lasting impressions.
            </p>

            <div className="bg-orange-50 border-l-4 border-orange-600 p-6 my-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>24/7 customer support for hassle-free travel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Experienced and professional travel guides</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Customized packages tailored to your preferences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Competitive pricing with transparent billing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Sanitized vehicles and safety-first approach</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 mr-2">✓</span>
                  <span>Wide range of destinations and tour options</span>
                </li>
              </ul>
            </div>

            <p>
              Whether you're looking to explore the majestic forts of Rajasthan, experience the spiritual essence of Ayodhya, witness the beauty of Kashmir, or discover international destinations, Abhimanyu Holidays has the perfect package for you. We take pride in our attention to detail, ensuring every aspect of your journey is carefully planned and executed.
            </p>

            <p>
              Our commitment to excellence has earned us the trust of thousands of satisfied travelers. We believe in building long-term relationships with our clients, and many of them return to us for their travel needs year after year. Join the Abhimanyu Holidays family and let us create memories that will last a lifetime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;