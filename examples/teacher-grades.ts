import { teacherGrades } from "../src";

import { ExampleCredentialsError, credentials } from "./_credentials";
import { loginUsingCredentials } from "./_login-using-crendentials";

void (async function main() {
  if (!credentials.teacher_username || !credentials.teacher_password)
    throw new ExampleCredentialsError("teacher");

  const { session, account } = await loginUsingCredentials(
    credentials.teacher_username,
    credentials.teacher_password
  );
  const studentId = 4404;
  const grades = await teacherGrades(session, studentId, ""); // sensitive NOT ALL ACCOUNTS CAN GO BACK
  console.log(JSON.stringify(grades));
})();
