import { Request } from "~/core/request";
import { decodeTeacherClassCouncil } from "~/decoders/teacher-class-council";
import {
  SessionTokenRequired,
  type Session,
  type TeacherClassCouncil
} from "~/models";

export const teacherClassCouncil = async (
  session: Session,
  teacherId: number,
  classId: number,
  periodId: string
): Promise<TeacherClassCouncil> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(
    `/enseignants/${teacherId}/C/${classId}/periodes/${periodId}/conseilDeClasse.awp?verbe=get`
  )
    .addVersionURL()
    .setToken(session.token)
    .setFormData({});

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherClassCouncil(response.data);
};

