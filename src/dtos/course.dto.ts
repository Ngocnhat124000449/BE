export interface ICourseDTO {
  CourseId: number;
  CourseCode: string;
  CourseName: string;
  Credits: number;
  DepartmentId: number | null;
}

export interface ICourseReq {
  CourseCode: string;
  CourseName: string;
  Credits: number;
  DepartmentId?: number | null;
}