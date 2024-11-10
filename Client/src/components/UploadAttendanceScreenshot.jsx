import React, { useState } from 'react';
import { Upload, Image, FileCheck, Trophy } from 'lucide-react';

const UploadAttendanceScreenshot = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);
  
  const handleFile = (file) => {
    setFileName(file.name);
    onUpload(file);
  };
  
  return (
    <div className="p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Image className="w-6 h-6" />
        Upload Your Attendance Report
      </h2>
      
      <div
        className={`border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
        }`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6">
          <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transform transition-all duration-300 ${
            fileName ? 'bg-black rotate-0' : 'bg-gray-100 -rotate-6'
          }`}>
            {fileName ? (
              <FileCheck className="w-12 h-12 text-white" />
            ) : (
              <Upload className="w-12 h-12 text-gray-600" />
            )}
          </div>
          
          {fileName ? (
            <div className="bg-gray-100 px-4 py-2 rounded-full">
              <p className="text-gray-700">✨ {fileName} uploaded successfully!</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900">Drop your attendance screenshot here</p>
              <p className="text-sm text-gray-600 mt-1">or click to browse files</p>
            </div>
          )}
          
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
            accept="image/*"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`px-6 py-3 rounded-xl cursor-pointer transform transition-all duration-300 ${
              fileName
                ? 'bg-black hover:bg-gray-900 text-white'
                : 'bg-black hover:bg-gray-900 text-white hover:scale-105'
            }`}
          >
            {fileName ? 'Upload Another File' : 'Choose File'}
          </label>
        </div>
      </div>
      
      {/* Fun Achievement Badge */}
      {fileName && (
        <div className="mt-6 flex items-center justify-center">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-xl flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-900 font-medium">Achievement Unlocked!</p>
              <p className="text-sm text-gray-600">First Step Towards Better Attendance 🌟</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadAttendanceScreenshot;