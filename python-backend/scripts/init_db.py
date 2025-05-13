import os
import sys
import logging
from pymongo import MongoClient

# Add the parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.weekly_schedule import WeeklySchedule
from models.attendance import AttendanceRecord

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_indexes():
    """Create necessary indexes in MongoDB"""
    try:
        mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/bunker-baba')
        db_name = os.getenv('DB_NAME', 'bunker_baba')
        
        client = MongoClient(mongodb_uri)
        db = client[db_name]
        
        # Create indexes for weekly_schedules collection
        db.weekly_schedules.create_index('department', unique=True)
        
        # Create indexes for attendance_records collection
        db.attendance_records.create_index([
            ('student_id', 1),
            ('created_at', -1)
        ])
        db.attendance_records.create_index('department')
        
        logger.info("Successfully created database indexes")
        
    except Exception as e:
        logger.error(f"Failed to create indexes: {str(e)}")
        raise

def main():
    try:
        # Create indexes
        create_indexes()
        
        # Initialize weekly schedules
        weekly_schedule = WeeklySchedule()
        weekly_schedule.initialize_default_schedules()
        
        logger.info("Successfully initialized database")
        
    except Exception as e:
        logger.error(f"Failed to initialize database: {str(e)}")
        raise

if __name__ == "__main__":
    main() 