import { expect } from "@jest/globals";
import request from "../../request";
import login from "../../login";

const clubEndpoint = "/clubs/";

describe("POST club/", () => {
  let token;
  beforeAll(async () => {
    token = await login();
  });

  it("[ERROR] return an error when the authorization token is not provided", async () => {
    const response = await request().post(clubEndpoint).expect(401);
    expect(response.body.error.name).toEqual("auhtorization_token_is_required");
    expect(response.body.error.message).toEqual(
      "the authorization header is needed and the token"
    );
  });

  it("[ERROR] return an error when the name is undefined", async () => {
    const response = await request()
      .post(clubEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "password",
        adminId: "123",
      })
      .expect(400);
    expect(response.body.error.name).toEqual("club_validation_error");
    expect(response.body.error.message).toEqual("name is required");
  });

  it("[ERROR] return an error when the adminId is undefined", async () => {
    const response = await request()
      .post(clubEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
      })
      .expect(400);
    expect(response.body.error.name).toEqual("club_validation_error");
    expect(response.body.error.message).toEqual(
      "adminId is required and must be a valid user id"
    );
  });

  it("[ERROR] return an error when the description is not a string", async () => {
    const response = await request()
      .post(clubEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        adminId: "123",
        description: true,
      })
      .expect(400);
    expect(response.body.error.name).toEqual("club_validation_error");
    expect(response.body.error.message).toEqual(
      "description must be a valid string"
    );
  });

  it("[SUCCESS] create a club successful", async () => {
    const usersResponse = await request()
      .get("/users/")
      .set("Authorization", `Bearer ${token}`);

    const { users } = usersResponse.body;

    const response = await request()
      .post(clubEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "club name",
        adminId: users[0]._id,
      })
      .expect(201);
    expect(response.body.club).not.toBeNull();
    expect(response.body.club.name).toEqual("club name");
    expect(response.body.club.admin).toEqual(users[0]._id);
    expect(response.body.club.description).toBeUndefined();
  });
});
