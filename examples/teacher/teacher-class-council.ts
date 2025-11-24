import { teacherClassCouncil } from "../../src";

import { ExampleCredentialsError, credentials } from "../_credentials";
import { loginUsingCredentials } from "../_login-using-crendentials";

void (async function main() {
  if (!credentials.teacher_username || !credentials.teacher_password)
    throw new ExampleCredentialsError("teacher");

  const { session, account } = await loginUsingCredentials(
    credentials.teacher_username,
    credentials.teacher_password
  );

  // Replace those identifiers with the appropriate teacher/class/period ids if needed.
  const teacherId = account.id;
  const classId = 19;
  const periodId = "A001";

  const council = await teacherClassCouncil(session, teacherId, classId, periodId);
  console.log(JSON.stringify(council));
})();

