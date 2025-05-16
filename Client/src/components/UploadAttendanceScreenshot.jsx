import React, { useState } from 'react';
import { Upload, Image, FileCheck, Trophy } from 'lucide-react';

const UploadAttendanceScreenshot = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState(null);
  
  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    onUpload(file);
  };
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        <Image className="w-6 h-6 text-indigo-600" />
        Upload Your Attendance Report
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive 
              ? 'border-indigo-500 bg-indigo-50/50' 
              : 'border-gray-300 hover:border-indigo-300 bg-white hover:bg-indigo-50/20'
          }`}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            handleFile(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => e.preventDefault()}
          tabIndex="0"
          aria-label="Drag and drop area for attendance report"
          role="button"
        >
          <div className="flex flex-col items-center gap-4">
            <div className={`w-20 h-20 rounded-xl flex items-center justify-center transform transition-all duration-300 ${
              fileName 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 rotate-0 shadow-lg' 
                : 'bg-indigo-100 -rotate-6'
            }`}>
              {fileName ? (
                <FileCheck className="w-10 h-10 text-white" />
              ) : (
                <Upload className="w-10 h-10 text-indigo-600" />
              )}
            </div>
            
            {fileName ? (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full">
                <p className="text-indigo-700">✨ {fileName} uploaded successfully!</p>
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
              aria-label="Upload attendance screenshot"
            />
            <label
              htmlFor="file-upload"
              className={`px-6 py-3 rounded-xl cursor-pointer transform transition-all duration-300 ${
                fileName
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:scale-105'
              }`}
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('file-upload').click();
                }
              }}
            >
              {fileName ? 'Upload Another File' : 'Choose File'}
            </label>
          </div>
        </div>
        
        {/* Achievement Badge */}
        {fileName && (
          <div className="mt-8 flex items-center justify-center">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl flex items-center gap-3 border border-indigo-100">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">Achievement Unlocked!</p>
                <p className="text-sm text-indigo-600">First Step Towards Better Attendance 🌟</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadAttendanceScreenshot;