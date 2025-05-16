import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen } from 'lucide-react';

const SelectDepartment = ({ department, onDepartmentChange }) => {
  const departments = [
    { id: '4IT', name: 'Information Technology (Sem 4)' },
    { id: '6IT', name: 'Information Technology (Sem 6)' },
    { id: '4CSE', name: 'Computer Science Engineering (Sem 4)' },
    { id: '6CSE', name: 'Computer Science Engineering (Sem 6)' },
    { id: '4ECE', name: 'Electronics & Communication Engineering (Sem 4)' },
    { id: '6ECE', name: 'Electronics & Communication Engineering (Sem 6)' },
    { id: '4CE', name: 'Computer Engineering (Sem 4)' },
    { id: '6CE', name: 'Computer Engineering (Sem 6)' }
  ];

  // const semesters = Array.from({ length: 8 }, (_, i) => ({
  //   id: i + 1,
  //   name: `${i + 1}${getSemesterSuffix(i + 1)} Semester`
  // }));

  // function getSemesterSuffix(num) {
  //   if (num === 1) return 'st';
  //   if (num === 2) return 'nd';
  //   if (num === 3) return 'rd';
  //   return 'th';
  // }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        <BookOpen className="w-6 h-6 text-indigo-600" />
        Select Your Department
      </h2>
      
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department" className="text-gray-800 font-medium">Department</Label>
            <Select value={department} onValueChange={onDepartmentChange}>
              <SelectTrigger className="w-full h-12 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id} className="hover:bg-indigo-50">
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select value={semester?.toString()} onValueChange={(value) => onSemesterChange(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem.id} value={sem.id.toString()}>
                    {sem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}
        </div>
        
        {/* Department Selection Visualization */}
        {department && (
          <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span className="text-gray-900 font-medium">Selected:</span>
              <span className="text-indigo-600 font-medium">
                {departments.find(dept => dept.id === department)?.name || department}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDepartment;