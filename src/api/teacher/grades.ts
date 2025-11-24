import { Request } from "~/core/request";
import { decodeGrade } from "~/decoders/grade";
import { buildOverview } from "~/decoders/grades-overview";
import { decodePeriodWithSubjects } from "~/decoders/period";
import {
  decodeTeacherLSUN,
  decodeTeacherGradesSettings
} from "~/decoders/teacher-grades";
import {
  type Session,
  SessionTokenRequired,
  type TeacherGradesResponse
} from "~/models";

export const teacherGrades = async (
  session: Session,
  studentId: number,
  schoolYear = ""
): Promise<TeacherGradesResponse> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(`/eleves/${studentId}/notes.awp?verbe=get`)
    .addVersionURL()
    .setToken(session.token)
    .setFormData({
      anneeScolaire: schoolYear
    });

  const response = await request.send(session.fetcher);
  session.token = response.token;
  const data = response.data ?? {};

  return {
    studentId,
    statsCode: data.foStat ?? "",
    periods: Array.isArray(data.periodes)
      ? data.periodes.map(decodePeriodWithSubjects)
      : [],
    grades: Array.isArray(data.notes) ? data.notes.map(decodeGrade) : [],
    overview: buildOverview(data),
    lsun: decodeTeacherLSUN(data.LSUN),
    settings: decodeTeacherGradesSettings(data.parametrage)
  };
};

