import request, { teamService } from "./request";

async function login() {
  const response = await request().post("/auth/login").send(teamService.login);

  return response.body.token;
}

export default login;
