import { Request } from "~/core/request";
import { decodeTeacherClassCouncil } from "~/decoders/teacher-class-council";
import { decodeTeacherPredefinedAppreciations } from "~/decoders/teacher-predefined-appreciation";
import {
  SessionTokenRequired,
  type Session,
  type TeacherClassCouncil,
  type TeacherPredefinedAppreciations
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

export const teacherPredefinedAppreciations = async (
  session: Session,
  teacherId: number,
  classId: number
): Promise<TeacherPredefinedAppreciations> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(
    `/Prof Principal/${teacherId}/C/${classId}/appreciationsPredefinies.awp?verbe=get`
  )
    .addVersionURL()
    .setToken(session.token)
    .setFormData({});

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherPredefinedAppreciations(response.data);
};

export const teacherSubjectPredefinedAppreciations = async (
  session: Session,
  teacherId: number,
  classId: number
): Promise<TeacherPredefinedAppreciations> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request(
    `/Enseignant/${teacherId}/C/${classId}/appreciationsPredefinies.awp?verbe=get`
  )
    .addVersionURL()
    .setToken(session.token)
    .setFormData({});

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherPredefinedAppreciations(response.data);
};

