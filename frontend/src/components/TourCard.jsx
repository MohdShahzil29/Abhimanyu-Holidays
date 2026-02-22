import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';

const TourCard = ({ tour }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative overflow-hidden h-56">
        <img
          src={tour.image}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {tour.price}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{tour.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock size={16} className="mr-1" />
          <span>{tour.duration}</span>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Tour Highlights</h4>
          <div className="flex flex-wrap gap-2">
            {tour.highlights.map((highlight, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/one-day-tours/${tour.id}`}
          className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2 rounded-md font-semibold transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default TourCard;