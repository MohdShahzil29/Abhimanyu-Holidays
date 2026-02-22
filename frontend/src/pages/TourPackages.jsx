import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { tourPackages } from '../data/mockData';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';

const TourPackages = () => {
  const [apiPackages, setApiPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/tour-packages`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setApiPackages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching tour packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const allPackages = useMemo(() => {
    const merged = [...tourPackages];
    const existingIds = new Set(tourPackages.map((pkg) => pkg.id));
    apiPackages.forEach((pkg) => {
      if (!existingIds.has(pkg.id)) {
        merged.push(pkg);
      }
    });
    return merged;
  }, [apiPackages]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tour Packages</h1>
          <p className="text-xl">Explore most popular & best travel deals at affordable price</p>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative overflow-hidden h-64">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {pkg.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2 text-orange-600" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>{pkg.destinations.join(' • ')}</span>
                  </div>
                </div>

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
    </div>
  );
};

export default TourPackages;
