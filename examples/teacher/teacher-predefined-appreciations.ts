import { teacherPredefinedAppreciations } from "../../src";

import { ExampleCredentialsError, credentials } from "../_credentials";
import { loginUsingCredentials } from "../_login-using-crendentials";

void (async function main() {
  if (!credentials.teacher_username || !credentials.teacher_password)
    throw new ExampleCredentialsError("teacher");

  const { session, account } = await loginUsingCredentials(
    credentials.teacher_username,
    credentials.teacher_password
  );

  const teacherId = account.id;
  const classId = 19;

  const result = await teacherPredefinedAppreciations(session, teacherId, classId);
  console.log(JSON.stringify(result, null, 2));
})();

