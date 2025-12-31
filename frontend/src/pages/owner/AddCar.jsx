import React, { useState } from "react";
import Title from "../../components/owner/Title";
import assets from "../../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddCar = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: "",
    pricePerDay: "",
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: "",
    location: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCar((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      toast.error("Please upload a car image");
      setLoading(false);
      return;
    }
    if (!car.brand || !car.model || !car.pricePerDay || !car.location) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      const carDataString = JSON.stringify(car);
      formData.append("carData", carDataString);
      formData.append("image", image);

      const { data } = await axios.post("/api/owner/add-car", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Car added successfully!");
        // Reset form
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: "",
          pricePerDay: "",
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: "",
          location: "",
          description: "",
        });
        // Redirect to manage cars or dashboard
        navigate("/owner/manage-cars");
      } else {
        toast.error(data.message || "Failed to add car");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add New Car"
        subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."
      />

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-6 text-gray-700 mt-8 max-w-2xl">
        {/* Car Image Upload */}
        <div className="flex flex-col gap-3">
          <label className="text-lg font-medium">
            Car Image <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <label htmlFor="car-image" className="cursor-pointer">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_icon}
                alt="Upload car"
                className="w-32 h-32 object-cover rounded-lg border-2 border-dashed border-gray-300"
              />
              <input
                type="file"
                id="car-image"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </label>
            <p className="text-sm text-gray-500">
              {image ? image.name : "Upload a clear picture of your car (required)"}
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">
              Brand <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="brand"
              value={car.brand}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. Toyota"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Model <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="model"
              value={car.model}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. Camry"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={car.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="2023"
              min="1900"
              max="2026"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Price Per Day (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="pricePerDay"
              value={car.pricePerDay}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="2500"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Category</label>
            <select
              name="category"
              value={car.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select category</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="hatchback">Hatchback</option>
              <option value="coupe">Coupe</option>
              <option value="luxury">Luxury</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Transmission</label>
            <select
              name="transmission"
              value={car.transmission}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Fuel Type</label>
            <select
              name="fuel_type"
              value={car.fuel_type}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Seating Capacity</label>
            <input
              type="number"
              name="seating_capacity"
              value={car.seating_capacity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="5"
              min="2"
              max="8"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={car.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. Mumbai, Maharashtra"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={car.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Add features, condition, or any special notes about the car..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 mt-6 bg-blue-600 text-white rounded-md font-medium transition-colors ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Car"}
          {!loading && <img src={assets.tick_icon} alt="Tick" className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};

export default AddCar;