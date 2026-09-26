export interface IEnrollReq {
  ClassId: number;
}

export interface IEnrollmentDTO {
  EnrollmentId: number;
  ClassId: number;
  StudentId: string;
  EnrollmentDate: Date;
}