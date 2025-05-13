from typing import Dict, Any, List
from pymongo import MongoClient
from bson import ObjectId
import os
from dotenv import load_dotenv
import datetime

# Load environment variables
load_dotenv()

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI')
DB_NAME = os.getenv('DB_NAME')

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
attendance_collection = db['attendance_records']

class AttendanceRecord:
    def __init__(self):
        self.client = MongoClient(MONGODB_URI)
        self.db = self.client[DB_NAME]
        self.collection = self.db.attendance_records

    def save_record(self, student_id: str, department: str, data: Dict[str, Any]) -> str:
        """Save attendance record to database"""
        document = {
            'student_id': student_id,
            'department': department,
            'attendance_data': data['attendance'],
            'recommendations': data['recommendations'],
            'created_at': datetime.datetime.utcnow()
        }
        result = self.collection.insert_one(document)
        return str(result.inserted_id)

    def get_student_records(self, student_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get attendance records for a student"""
        cursor = self.collection.find(
            {'student_id': student_id},
            {'_id': 0}  # Exclude _id from results
        ).sort('created_at', -1).limit(limit)
        
        return list(cursor)

    def get_record_by_id(self, record_id: str) -> Dict[str, Any]:
        """Get a specific attendance record"""
        record = self.collection.find_one({'_id': ObjectId(record_id)})
        if not record:
            raise ValueError(f"No record found with id: {record_id}")
        record['_id'] = str(record['_id'])  # Convert ObjectId to string
        return record

    def add_subject(self, subject_name, class_type, attended, total):
        percentage = (attended / total) * 100 if total > 0 else 0
        
        self.records.append({
            "subjectName": subject_name,
            "classType": class_type,
            "attended": attended,
            "total": total,
            "percentage": percentage
        })
        
        self._calculate_overall_percentage()
        
    def _calculate_overall_percentage(self):
        if not self.records:
            self.overall_percentage = 0
            return
            
        total_attended = sum(record["attended"] for record in self.records)
        total_classes = sum(record["total"] for record in self.records)
        
        self.overall_percentage = (total_attended / total_classes) * 100 if total_classes > 0 else 0
    
    def to_dict(self):
        return {
            "student_id": self.student_id,
            "records": self.records,
            "overallPercentage": self.overall_percentage,
            "created_at": self.created_at
        }
    
    def save(self):
        result = attendance_collection.insert_one(self.to_dict())
        return str(result.inserted_id)
    
    @staticmethod
    def find_by_student_id(student_id):
        records = attendance_collection.find({"student_id": student_id}).sort("created_at", -1)
        return [record for record in records]
    
    @staticmethod
    def find_by_id(record_id):
        record = attendance_collection.find_one({"_id": ObjectId(record_id)})
        return record 