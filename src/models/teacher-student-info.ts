export type TeacherStudentInfo = Readonly<{
  id: number;
  firstName: string;
  lastName: string;
  particle: string;
  gender: string;
  boardingType: string;
  birthDate: Date;
  email: string;
  phone: string;
  isPrimarySchool: boolean;
  photoURL: string;
  classId: number;
  classLabel: string;
  classIsGraded: boolean;
  schoolId: number;
  tags: Array<string | Record<string, unknown>>;
}>;

