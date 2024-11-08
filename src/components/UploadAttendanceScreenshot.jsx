import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, FileInput } from '@/components/ui';

const UploadAttendanceScreenshot = ({ onUpload }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Attendance Screenshot</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          Upload a screenshot of your attendance report so we can analyze it.
        </p>
        <FileInput
          label="Choose File"
          placeholder="Drag and drop or click to upload"
          onSelectedFile={onUpload}
        />
      </CardContent>
    </Card>
  );
};
export default UploadAttendanceScreenshot;
