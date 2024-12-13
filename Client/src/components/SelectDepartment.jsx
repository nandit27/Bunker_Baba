import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
    <div className="space-y-6 p-6 ">
      <h2 className="text-2xl font-bold text-center mb-8">Select Your Department</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={department} onValueChange={onDepartmentChange} className="w-full h-12">
            <SelectTrigger className="w-full h-full border rounded-md ">
              <SelectValue placeholder="Select your department" />
            </SelectTrigger>
            <SelectContent className="bg-white opacity-100">
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
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
    </div>
  );
};

export default SelectDepartment;