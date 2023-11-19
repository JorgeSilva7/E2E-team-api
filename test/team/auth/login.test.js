import { expect } from "@jest/globals";
import request, { teamService } from "../../request";

const loginEndpoint = "/auth/login";

describe("POST auth/login", () => {
  it("[ERROR] return an error when email is undefined", async () => {
    const response = await request()
      .post(loginEndpoint)
      .send({
        password: "password",
      })
      .expect(400);
    expect(response.body.error.name).toEqual("auth_login_validation_error");
  });

  it("[ERROR] return an error when crenditials are invalid", async () => {
    const response = await request()
      .post(loginEndpoint)
      .send({
        email: "email@gmail.com",
        password: "password",
      })
      .expect(400);

    expect(response.body.error.name).toEqual(
      "auth_login_invalid_credentials_error"
    );
  });

  it("[SUCCESS] login success", async () => {
    const response = await request()
      .post(loginEndpoint)
      .send(teamService.loginAdmin)
      .expect(200);

    expect(response.body).toHaveProperty("token");
    expect(response.body.token).not.toBeNull();
  });
});
