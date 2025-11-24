import {
  teacherClassCouncil,
  TeacherClassCouncilStudentUpdatePayload,
  updateTeacherClassCouncilStudent
} from "../../src";
import { ExampleCredentialsError, credentials } from "../_credentials";
import { loginUsingCredentials } from "../_login-using-crendentials";

async function main() {
  if (!credentials.teacher_username || !credentials.teacher_password) {
    throw new ExampleCredentialsError("teacher");
  }

  const { session, account } = await loginUsingCredentials(
    credentials.teacher_username,
    credentials.teacher_password
  );

  const teacherId = account.id;
  const classId = 19;
  const periodId = "A001";

  const council = await teacherClassCouncil(session, teacherId, classId, periodId);
  if (!council.students.length) {
    throw new Error("No students returned by the class council endpoint.");
  }

  const [student] = council.students;
  const payload : TeacherClassCouncilStudentUpdatePayload = {
    student: {
      ...student,
      appreciationPrincipalTeacher: {
        ...student.appreciationPrincipalTeacher,
        text: `Updated via example on ${new Date().toISOString()}`,
        date: new Date()
      },
    },
    classAppreciation: {
      ...council.classAppreciation,
      date: new Date()
    }
  };

  const result = await updateTeacherClassCouncilStudent(
    session,
    teacherId,
    classId,
    periodId,
    payload
  );

  console.log("Updated appreciations:");
  console.log(JSON.stringify(result, null, 2));
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

