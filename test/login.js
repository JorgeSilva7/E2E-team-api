import request, { teamService } from "./request";

async function loginAdmin(admin = true) {
  const credentials = admin ? teamService.loginAdmin : teamService.loginUser;
  const response = await request().post("/auth/login").send(credentials);

  return response.body.token;
}

export default loginAdmin;
