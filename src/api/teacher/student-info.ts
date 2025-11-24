import { Request } from "~/core/request";
import { decodeTeacherStudentInfo } from "~/decoders/teacher-student-info";
import { SessionTokenRequired, type Session, type TeacherStudentInfo } from "~/models";

export const teacherStudentInfo = async (
  session: Session,
  studentId: number,
  schoolYear = ""
): Promise<TeacherStudentInfo> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(`/eleves/${studentId}.awp?verbe=get`)
    .addVersionURL()
    .setToken(session.token)
    .setFormData({
      anneeScolaire: schoolYear
    });

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherStudentInfo(response.data);
};

