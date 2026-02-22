import React, { useEffect, useMemo, useState } from 'react';
import TourCard from '../components/TourCard';
import { oneDayTours } from '../data/mockData';

const OneDayTours = () => {
  const [apiTours, setApiTours] = useState([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/one-day-tours`,
        );
        if (!response.ok) return;
        const data = await response.json();
        setApiTours(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching one day tours:', error);
      }
    };

    fetchTours();
  }, []);

  const allTours = useMemo(() => {
    const merged = [...oneDayTours];
    const existingIds = new Set(oneDayTours.map((tour) => tour.id));
    apiTours.forEach((tour) => {
      if (!existingIds.has(tour.id)) {
        merged.push(tour);
      }
    });
    return merged;
  }, [apiTours]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">One Day Tours</h1>
          <p className="text-xl">Experience the best of Jaipur and beyond in a single day</p>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OneDayTours;
