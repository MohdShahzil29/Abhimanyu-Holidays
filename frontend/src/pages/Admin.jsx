import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import {
  Upload,
  Plus,
  X,
  Hotel,
  MessageSquare,
  LogOut,
  Check,
  XCircle,
  Trash2,
} from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("one-day-tour");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [oneDayTours, setOneDayTours] = useState([]);
  const [tourPackages, setTourPackages] = useState([]);
  const [deletingTourId, setDeletingTourId] = useState(null);
  const [deletingPackageId, setDeletingPackageId] = useState(null);
  const [oneDayTourData, setOneDayTourData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    highlights: [""],
    details: "",
    image: null,
  });

  const [tourPackageData, setTourPackageData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    destinations: [""],
    image: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    fetchContactSubmissions();
    fetchHotelBookings();
    fetchOneDayTours();
    fetchTourPackages();
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (activeTab === "contact-inquiries") {
      fetchContactSubmissions();
    }
    if (activeTab === "hotel-bookings") {
      fetchHotelBookings();
    }
    if (activeTab === "one-day-tour") {
      fetchOneDayTours();
    }
    if (activeTab === "tour-package") {
      fetchTourPackages();
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || activeTab !== "contact-inquiries") return;
    const intervalId = setInterval(() => {
      fetchContactSubmissions();
    }, 8000);
    return () => clearInterval(intervalId);
  }, [activeTab, isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const fetchContactSubmissions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/contact-submissions`,
        {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setContactSubmissions(data);
      }
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
    }
  };

  const fetchHotelBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/hotel-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setHotelBookings(data);
      }
    } catch (error) {
      console.error("Error fetching hotel bookings:", error);
    }
  };

  const fetchOneDayTours = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/one-day-tours`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setOneDayTours(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching one day tours:", error);
    }
  };

  const fetchTourPackages = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/tour-packages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setTourPackages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching tour packages:", error);
    }
  };

  const updateContactStatus = async (submissionId, status) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/contact-submissions/${submissionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        fetchContactSubmissions();
        toast({
          title: "Status Updated",
          description: `Contact submission marked as ${status}`,
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteOneDayTour = async (tourId) => {
    try {
      setDeletingTourId(tourId);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/one-day-tours/${tourId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete one day tour");
      }

      toast({
        title: "Deleted",
        description: "One day tour removed successfully.",
      });
      fetchOneDayTours();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "One day tour delete nahi ho paaya.",
        variant: "destructive",
      });
    } finally {
      setDeletingTourId(null);
    }
  };

  const deleteTourPackage = async (packageId) => {
    try {
      setDeletingPackageId(packageId);
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/tour-packages/${packageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete tour package");
      }

      toast({
        title: "Deleted",
        description: "Tour package removed successfully.",
      });
      fetchTourPackages();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Tour package delete nahi ho paaya.",
        variant: "destructive",
      });
    } finally {
      setDeletingPackageId(null);
    }
  };

  const handleOneDayTourChange = (e) => {
    const { name, value } = e.target;
    setOneDayTourData({ ...oneDayTourData, [name]: value });
  };

  const handleTourPackageChange = (e) => {
    const { name, value } = e.target;
    setTourPackageData({ ...tourPackageData, [name]: value });
  };

  const handleHighlightChange = (index, value) => {
    const newHighlights = [...oneDayTourData.highlights];
    newHighlights[index] = value;
    setOneDayTourData({ ...oneDayTourData, highlights: newHighlights });
  };

  const addHighlight = () => {
    setOneDayTourData({
      ...oneDayTourData,
      highlights: [...oneDayTourData.highlights, ""],
    });
  };

  const removeHighlight = (index) => {
    const newHighlights = oneDayTourData.highlights.filter(
      (_, i) => i !== index,
    );
    setOneDayTourData({ ...oneDayTourData, highlights: newHighlights });
  };

  const handleDestinationChange = (index, value) => {
    const newDestinations = [...tourPackageData.destinations];
    newDestinations[index] = value;
    setTourPackageData({ ...tourPackageData, destinations: newDestinations });
  };

  const addDestination = () => {
    setTourPackageData({
      ...tourPackageData,
      destinations: [...tourPackageData.destinations, ""],
    });
  };

  const removeDestination = (index) => {
    const newDestinations = tourPackageData.destinations.filter(
      (_, i) => i !== index,
    );
    setTourPackageData({ ...tourPackageData, destinations: newDestinations });
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "one-day-tour") {
        setOneDayTourData({ ...oneDayTourData, image: file });
      } else {
        setTourPackageData({ ...tourPackageData, image: file });
      }
    }
  };

  const handleOneDayTourSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("title", oneDayTourData.title);
      formData.append("description", oneDayTourData.description);
      formData.append("duration", oneDayTourData.duration);
      formData.append("price", oneDayTourData.price);
      formData.append("details", oneDayTourData.details);
      formData.append(
        "highlights",
        JSON.stringify(
          oneDayTourData.highlights.filter((h) => h.trim() !== ""),
        ),
      );
      formData.append("image", oneDayTourData.image);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/one-day-tours`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        toast({
          title: "One Day Tour Added!",
          description: "The tour has been successfully added to the system.",
        });
        fetchOneDayTours();
        setOneDayTourData({
          title: "",
          description: "",
          duration: "",
          price: "",
          highlights: [""],
          details: "",
          image: null,
        });
      } else {
        throw new Error("Failed to add tour");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add one day tour. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTourPackageSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("title", tourPackageData.title);
      formData.append("description", tourPackageData.description);
      formData.append("duration", tourPackageData.duration);
      formData.append("price", tourPackageData.price);
      formData.append(
        "destinations",
        JSON.stringify(
          tourPackageData.destinations.filter((d) => d.trim() !== ""),
        ),
      );
      formData.append("image", tourPackageData.image);

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"}/api/admin/tour-packages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        toast({
          title: "Tour Package Added!",
          description: "The package has been successfully added to the system.",
        });
        fetchTourPackages();
        setTourPackageData({
          title: "",
          description: "",
          duration: "",
          price: "",
          destinations: [""],
          image: null,
        });
      } else {
        throw new Error("Failed to add package");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add tour package. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Admin Panel</h1>
              <p className="text-orange-100 mt-1">
                Manage tours, bookings, and inquiries
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap space-x-2 mb-8 border-b">
          <button
            onClick={() => setActiveTab("one-day-tour")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "one-day-tour"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            Add One Day Tour
          </button>
          <button
            onClick={() => setActiveTab("tour-package")}
            className={`px-4 py-3 font-semibold transition-colors ${
              activeTab === "tour-package"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            Add Tour Package
          </button>
          <button
            onClick={() => setActiveTab("contact-inquiries")}
            className={`px-4 py-3 font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === "contact-inquiries"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            <MessageSquare size={18} />
            <span>Contact Inquiries ({contactSubmissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("hotel-bookings")}
            className={`px-4 py-3 font-semibold transition-colors flex items-center space-x-2 ${
              activeTab === "hotel-bookings"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            <Hotel size={18} />
            <span>Hotel Bookings ({hotelBookings.length})</span>
          </button>
        </div>

        {/* One Day Tour Form */}
        {activeTab === "one-day-tour" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Upload className="text-orange-600 mr-3" size={32} />
              <h2 className="text-2xl font-bold text-gray-900">
                Add One Day Tour
              </h2>
            </div>

            <form onSubmit={handleOneDayTourSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={oneDayTourData.title}
                  onChange={handleOneDayTourChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Jaipur Evening Tour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={oneDayTourData.description}
                  onChange={handleOneDayTourChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Brief description of the tour"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={oneDayTourData.duration}
                    onChange={handleOneDayTourChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 4-5 hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={oneDayTourData.price}
                    onChange={handleOneDayTourChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., ₹1,500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Highlights *
                </label>
                {oneDayTourData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) =>
                        handleHighlightChange(index, e.target.value)
                      }
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Birla Temple"
                    />
                    {oneDayTourData.highlights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addHighlight}
                  className="mt-2 flex items-center text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus size={20} className="mr-1" /> Add Highlight
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  name="details"
                  value={oneDayTourData.details}
                  onChange={handleOneDayTourChange}
                  required
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Detailed information about the tour"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tour Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "one-day-tour")}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {oneDayTourData.image && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {oneDayTourData.image.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold transition-colors flex items-center justify-center"
              >
                <Upload className="mr-2" size={20} />
                Add One Day Tour
              </button>
            </form>

            <div className="mt-10 border-t pt-8">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Existing One Day Tours ({oneDayTours.length})
                </h3>
                <button
                  type="button"
                  onClick={fetchOneDayTours}
                  className="ml-auto text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Refresh
                </button>
              </div>

              {oneDayTours.length === 0 ? (
                <p className="text-gray-500">No one day tours added yet.</p>
              ) : (
                <div className="space-y-3">
                  {oneDayTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full md:w-28 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{tour.title}</p>
                        <p className="text-sm text-gray-600">
                          {tour.duration} • {tour.price}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{tour.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteOneDayTour(tour.id)}
                        disabled={deletingTourId === tour.id}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-60"
                      >
                        <Trash2 size={16} className="mr-1" />
                        {deletingTourId === tour.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tour Package Form */}
        {activeTab === "tour-package" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Upload className="text-orange-600 mr-3" size={32} />
              <h2 className="text-2xl font-bold text-gray-900">
                Add Tour Package
              </h2>
            </div>

            <form onSubmit={handleTourPackageSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={tourPackageData.title}
                  onChange={handleTourPackageChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Rajasthan Tour Package"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={tourPackageData.description}
                  onChange={handleTourPackageChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Brief description of the package"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration *
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={tourPackageData.duration}
                    onChange={handleTourPackageChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., 7 Days / 6 Nights"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={tourPackageData.price}
                    onChange={handleTourPackageChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., ₹25,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destinations *
                </label>
                {tourPackageData.destinations.map((destination, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) =>
                        handleDestinationChange(index, e.target.value)
                      }
                      required
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="e.g., Jaipur"
                    />
                    {tourPackageData.destinations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDestination(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addDestination}
                  className="mt-2 flex items-center text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus size={20} className="mr-1" /> Add Destination
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, "tour-package")}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {tourPackageData.image && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {tourPackageData.image.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-md font-semibold transition-colors flex items-center justify-center"
              >
                <Upload className="mr-2" size={20} />
                Add Tour Package
              </button>
            </form>

            <div className="mt-10 border-t pt-8">
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Existing Tour Packages ({tourPackages.length})
                </h3>
                <button
                  type="button"
                  onClick={fetchTourPackages}
                  className="ml-auto text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Refresh
                </button>
              </div>

              {tourPackages.length === 0 ? (
                <p className="text-gray-500">No tour packages added yet.</p>
              ) : (
                <div className="space-y-3">
                  {tourPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full md:w-28 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{pkg.title}</p>
                        <p className="text-sm text-gray-600">
                          {pkg.duration} • {pkg.price}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{pkg.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteTourPackage(pkg.id)}
                        disabled={deletingPackageId === pkg.id}
                        className="inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-60"
                      >
                        <Trash2 size={16} className="mr-1" />
                        {deletingPackageId === pkg.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* Contact Inquiries Tab */}
        {activeTab === "contact-inquiries" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <MessageSquare className="text-orange-600 mr-3" size={32} />
              <h2 className="text-2xl font-bold text-gray-900">
                Contact Inquiries
              </h2>
              <button
                type="button"
                onClick={fetchContactSubmissions}
                className="ml-auto text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                Refresh
              </button>
            </div>

            {contactSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare
                  className="text-gray-400 mx-auto mb-4"
                  size={48}
                />
                <p className="text-gray-500">No contact inquiries yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contactSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {submission.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {submission.email} • {submission.phone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(submission.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            submission.status === "pending" ||
                            submission.status === "new"
                              ? "bg-yellow-100 text-yellow-800"
                              : submission.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {submission.status}
                        </span>
                        {(submission.status === "pending" ||
                          submission.status === "new") && (
                          <>
                            <button
                              onClick={() =>
                                updateContactStatus(submission.id, "resolved")
                              }
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                              title="Mark as resolved"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() =>
                                updateContactStatus(submission.id, "dismissed")
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                              title="Dismiss"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Message:
                      </p>
                      <p className="text-gray-700">{submission.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hotel Bookings Tab */}
        {activeTab === "hotel-bookings" && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Hotel className="text-orange-600 mr-3" size={32} />
              <h2 className="text-2xl font-bold text-gray-900">
                Hotel Bookings
              </h2>
            </div>

            {hotelBookings.length === 0 ? (
              <div className="text-center py-12">
                <Hotel className="text-gray-400 mx-auto mb-4" size={48} />
                <p className="text-gray-500">No hotel bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hotelBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {booking.hotel_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Guest: {booking.customer_name} •{" "}
                          {booking.customer_email}
                        </p>
                        <p className="text-sm text-gray-600">
                          Phone: {booking.customer_phone}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Booking ID: {booking.id} •{" "}
                          {new Date(booking.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-orange-600">
                          {booking.rooms} room(s)
                        </p>
                        <p className="text-sm text-gray-600">
                          {booking.adults} adults, {booking.children} children
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Check-in:
                        </p>
                        <p className="text-gray-700">
                          {new Date(booking.check_in).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Check-out:
                        </p>
                        <p className="text-gray-700">
                          {new Date(booking.check_out).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {booking.special_requirements && (
                      <div className="mt-3 bg-blue-50 p-3 rounded">
                        <p className="text-sm font-medium text-blue-700 mb-1">
                          Special Requirements:
                        </p>
                        <p className="text-blue-700">
                          {booking.special_requirements}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
