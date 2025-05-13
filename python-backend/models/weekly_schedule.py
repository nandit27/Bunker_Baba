from typing import Dict, Any
from pymongo import MongoClient
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class WeeklySchedule:
    def __init__(self):
        mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        db_name = os.getenv('DB_NAME', 'bunker_baba')
        
        self.client = MongoClient(mongodb_uri)
        self.db = self.client[db_name]
        self.collection = self.db.weekly_schedules

    def get_department_schedule(self, department: str) -> Dict[str, Any]:
        """Get weekly schedule for a department"""
        schedule = self.collection.find_one({'department': department})
        if not schedule:
            raise ValueError(f"No schedule found for department: {department}")
        return schedule['courses']

    def update_department_schedule(self, department: str, schedule: Dict[str, Any]) -> None:
        """Update or insert weekly schedule for a department"""
        self.collection.update_one(
            {'department': department},
            {
                '$set': {
                    'courses': schedule,
                    'updated_at': datetime.utcnow()
                }
            },
            upsert=True
        )

    def get_all_departments(self) -> list:
        """Get list of all departments"""
        return [doc['department'] for doc in self.collection.find({}, {'department': 1})]

    def delete_department_schedule(self, department: str) -> bool:
        """Delete a department schedule"""
        result = self.collection.delete_one({'department': department})
        return result.deleted_count > 0

    def initialize_default_schedules(self) -> None:
        """Initialize default schedules if none exist"""
        default_schedules = {
            "4IT": {
                "HS131.02A / HSS": { "lectures": 2, "labs": 0 },
                "IT355 / SNT": { "lectures": 3, "labs": 1 },
                "IT356 / CAMI": { "lectures": 4, "labs": 1 },
                "IT357 / CN": { "lectures": 3, "labs": 1 },
                "IT358 / FSWD": { "lectures": 0, "labs": 1 },
                "IT359 / DAA": { "lectures": 4, "labs": 1 },
                "IT360 / SGP": { "lectures": 0, "labs": 1 }
            },
            "4CE": {
                "CE262 / DCN": { "lectures": 4, "labs": 1 },
                "CE263 / DBMS": { "lectures": 3, "labs": 2 },
                "CE264 / DAA": { "lectures": 4, "labs": 1 },
                "CE266 / SE": { "lectures": 3, "labs": 1 },
                "CE268 / SGP": { "lectures": 0, "labs": 1 },
                "CE269 / PIP": { "lectures": 0, "labs": 1 },
                "HS111.03 / HSS": { "lectures": 2, "labs": 0 }
            }
        }

        for dept, schedule in default_schedules.items():
            self.update_department_schedule(dept, schedule)