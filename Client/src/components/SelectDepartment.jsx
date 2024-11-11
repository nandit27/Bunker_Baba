import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SelectDepartment = ({ department, semester, onDepartmentChange, onSemesterChange }) => {
  const departments = [
    { id: 'IT', name: 'Information Technology' },
    { id: 'CSE', name: 'Computer Science & Engineering' },
    { id: 'ECE', name: 'Electronics & Communication' },
    { id: 'ME', name: 'Mechanical Engineering' },
    { id: 'CE', name: 'Civil Engineering' }
  ];

  const semesters = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `${i + 1}${getSemesterSuffix(i + 1)} Semester`
  }));

  function getSemesterSuffix(num) {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-center mb-8">Select Your Department & Semester</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
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
        </div>
      </div>
    </div>
  );
};

export default SelectDepartment;