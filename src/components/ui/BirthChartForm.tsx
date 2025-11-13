'use client';

import React, { useState } from 'react';

/**
 * BirthChartForm Component
 * 
 * Transparent glassmorphism form for birth chart inputs
 * Matches website monochrome theme
 */

interface BirthChartFormProps {
  onGenerate?: (data: BirthChartData) => void;
  onClear?: () => void;
}

export interface BirthChartData {
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
}

const BirthChartForm: React.FC<BirthChartFormProps> = ({ onGenerate, onClear }) => {
  const [formData, setFormData] = useState<BirthChartData>({
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    gender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (onGenerate) {
      onGenerate(formData);
    }
  };

  const handleClear = () => {
    setFormData({
      dateOfBirth: '',
      timeOfBirth: '',
      placeOfBirth: '',
      gender: '',
    });
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="birth-chart-form-container w-full max-w-md">
      {/* Glassmorphism Card */}
      <div 
        className="glassmorphism-card rounded-lg p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        }}
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Birth Chart Generator
        </h3>

        <form onSubmit={handleGenerate} className="space-y-5">
          {/* Date of Birth */}
          <div className="form-group">
            <label 
              htmlFor="dateOfBirth" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            />
          </div>

          {/* Time of Birth */}
          <div className="form-group">
            <label 
              htmlFor="timeOfBirth" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Time of Birth
            </label>
            <input
              type="time"
              id="timeOfBirth"
              name="timeOfBirth"
              value={formData.timeOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            />
          </div>

          {/* Place of Birth */}
          <div className="form-group">
            <label 
              htmlFor="placeOfBirth" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Place of Birth
            </label>
            <input
              type="text"
              id="placeOfBirth"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              placeholder="City, Country"
              required
              className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label 
              htmlFor="gender" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-black">Select Gender</option>
              <option value="male" className="bg-black">Male</option>
              <option value="female" className="bg-black">Female</option>
              <option value="other" className="bg-black">Other</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-md bg-white/10 border border-white/30 text-white font-medium hover:bg-white/20 hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 px-6 py-3 rounded-md bg-black/30 border border-white/20 text-white font-medium hover:bg-black/50 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirthChartForm;
