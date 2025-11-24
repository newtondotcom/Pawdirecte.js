import { teacherStudentInfo } from "~/api";

import { ExampleCredentialsError, credentials } from "../_credentials";
import { loginUsingCredentials } from "../_login-using-crendentials";

void (async function main() {
  if (!credentials.teacher_username || !credentials.teacher_password)
    throw new ExampleCredentialsError("teacher");

  const { session } = await loginUsingCredentials(
    credentials.teacher_username,
    credentials.teacher_password
  );
  const studentId = 4404;
  const info = await teacherStudentInfo(session, studentId, "");
  console.log(JSON.stringify(info));
})();

