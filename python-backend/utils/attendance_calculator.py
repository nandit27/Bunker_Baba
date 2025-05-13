import json
import os
import logging
from typing import Dict, Any, List
from models.weekly_schedule import WeeklySchedule

logger = logging.getLogger(__name__)

class AttendanceCalculator:
    def __init__(self):
        self.weekly_schedule = WeeklySchedule()

    def calculate_allowed_skips(self, department: str, attendance_data: Dict[str, Any], 
                              desired_percentage: float, weeks_remaining: int) -> Dict[str, Any]:
        """
        Calculate allowed skips and generate recommendations based on attendance data
        """
        try:
            # Get department schedule from database
            try:
                department_schedule = self.weekly_schedule.get_department_schedule(department)
            except ValueError as e:
                logger.error(f"Department schedule error: {str(e)}")
                raise

            # Extract summary
            total_attended = sum(record['attended'] for record in attendance_data['records'])
            total_classes = sum(record['total'] for record in attendance_data['records'])

            # Process attendance data into structured format
            processed_data = {}
            for record in attendance_data['records']:
                course_code = record['subjectName'].split('/')[0].strip()
                class_type = 'LECT' if record['classType'] == 'THEORY' else 'LAB'

                if course_code not in processed_data:
                    processed_data[course_code] = {
                        'LECT': {'present': 0, 'total': 0},
                        'LAB': {'present': 0, 'total': 0}
                    }

                processed_data[course_code][class_type]['present'] = record['attended']
                processed_data[course_code][class_type]['total'] = record['total']

            # Calculate future classes based on weekly schedule
            future_classes = sum(
                schedule['lectures'] + schedule['labs']
                for schedule in department_schedule.values()
            ) * weeks_remaining

            # Calculate metrics
            current_percentage = (total_attended / total_classes * 100) if total_classes > 0 else 0
            total_classes_including_remaining = total_classes + future_classes
            minimum_required_attendance = (desired_percentage / 100) * total_classes_including_remaining
            additional_classes_needed = max(0, minimum_required_attendance - total_attended)
            allowed_skips = max(0, future_classes - additional_classes_needed)

            # Generate course-wise recommendations
            recommendations = []
            for course, data in processed_data.items():
                lecture_percentage = (
                    (data['LECT']['present'] / data['LECT']['total'] * 100)
                    if data['LECT']['total'] > 0 else None
                )
                lab_percentage = (
                    (data['LAB']['present'] / data['LAB']['total'] * 100)
                    if data['LAB']['total'] > 0 else None
                )

                # Find matching course in weekly schedule
                course_key = next(
                    (key for key in department_schedule.keys() if course in key),
                    None
                )
                weekly_classes = department_schedule.get(
                    course_key,
                    {'lectures': 0, 'labs': 0}
                )
                future_classes_for_course = (
                    weekly_classes['lectures'] + weekly_classes['labs']
                ) * weeks_remaining

                recommendations.append({
                    'course': course,
                    'currentAttendance': {
                        'lectures': f"{lecture_percentage:.1f}%" if lecture_percentage is not None else 'N/A',
                        'labs': f"{lab_percentage:.1f}%" if lab_percentage is not None else 'N/A'
                    },
                    'weeklyClasses': weekly_classes,
                    'canSkip': (lecture_percentage and lecture_percentage > 85) or 
                              (lab_percentage and lab_percentage > 85),
                    'futureClasses': future_classes_for_course,
                    'recommendation': self._get_recommendation(
                        lecture_percentage, lab_percentage,
                        future_classes <= additional_classes_needed
                    )
                })

            return {
                'summary': {
                    'currentPercentage': current_percentage,
                    'totalClasses': total_classes,
                    'totalAttended': total_attended,
                    'futureClasses': future_classes,
                    'allowedSkips': allowed_skips,
                    'additionalClassesNeeded': additional_classes_needed
                },
                'recommendations': recommendations
            }

        except Exception as e:
            logger.error(f"Error calculating allowed skips: {str(e)}")
            raise

    def _get_recommendation(self, lecture_percent: float, lab_percent: float, 
                          cannot_miss: bool) -> str:
        """Generate recommendation based on attendance percentages"""
        if cannot_miss:
            return "Cannot miss lectures"
        if lecture_percent is None and lab_percent is None:
            return "No data available"
        if ((lecture_percent and lecture_percent < 75) or 
            (lab_percent and lab_percent < 75)):
            return "Cannot miss lectures"
        if lecture_percent > 90 or lab_percent > 90:
            return "Safe to miss some classes"
        return "Attend if possible" 