import { Request } from "~/core/request";
import { decodeTeacherLevelsList } from "~/decoders/teacher-levels-list";
import {
  SessionTokenRequired,
  type Session,
  type TeacherLevelsList
} from "~/models";

export const teacherLevelsList = async (
  session: Session,
  teacherId?: number
): Promise<TeacherLevelsList> => {
  if (!session.token) throw new SessionTokenRequired();

  const request = new Request("/niveauxListe.awp?verbe=get")
    .addVersionURL()
    .setToken(session.token)
    .setFormData({});

  const response = await request.send(session.fetcher);
  session.token = response.token;

  return decodeTeacherLevelsList(response.data, teacherId);
};

