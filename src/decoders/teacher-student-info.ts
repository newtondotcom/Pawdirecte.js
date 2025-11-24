import type { TeacherStudentInfo } from "~/models";

export const decodeTeacherStudentInfo = (data: Record<string, any>): TeacherStudentInfo => {
  return {
    id: Number(data.id),
    firstName: data.prenom,
    lastName: data.nom,
    particle: data.particule ?? "",
    gender: data.sexe ?? "",
    boardingType: data.regime ?? "",
    birthDate: new Date(data.dateDeNaissance),
    email: data.email ?? "",
    phone: data.mobile ?? "",
    isPrimarySchool: Boolean(data.isPrimaire),
    photoURL: data.photo ?? "",
    classId: Number(data.classeId ?? 0),
    classLabel: data.classeLibelle ?? "",
    classIsGraded: Boolean(data.classeEstNote),
    schoolId: Number(data.idEtablissement ?? 0),
    tags: Array.isArray(data.dispositifs) ? data.dispositifs : []
  };
};

