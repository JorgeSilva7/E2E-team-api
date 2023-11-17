import { expect } from "@jest/globals";
import request, { teamService } from "../../request";
import loginAdmin from "../../login";
import getClub from "../../util/getClub";
import faker from "faker";

describe("POST /clubs/:clubId/members", () => {
  let token;
  let clubId;
  let nonAdminToken;
  let clubMembersEndpoint;
  const getClubId = async (token, email) => {
    const club = await getClub(token, email);
    return club._id;
  };

  beforeAll(async () => {
    token = await loginAdmin();
    nonAdminToken = await loginAdmin(false);
    // Get a club of admin. Do not create a new one.
    clubId = await getClubId(token, teamService.loginAdmin.email);
    clubMembersEndpoint = `/clubs/${clubId}/members`;
  });

  it("[ERROR] return an error when the authorization token is not provided", async () => {
    // Catched by middleware, does not requires a valid clubId
    const response = await request().post(clubMembersEndpoint).expect(401);
    // FIXME typo in the error name
    expect(response.body.error.name).toEqual("auhtorization_token_is_required");
    expect(response.body.error.message).toEqual(
      "the authorization header is needed and the token"
    );
  });

  it("[ERROR] return an error when the name is undefined", async () => {
    // Does not require a valid clubId
    const response = await request()
      .post(clubMembersEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastName: "lastName",
        email: "email@example.com",
      })
      .expect(400);
    expect(response.body.error.name).toEqual("member_validation_error");
    expect(response.body.error.message).toEqual("name is required");
  });

  it("[ERROR] return an error when the lastName is undefined", async () => {
    // Does not require a valid clubId
    const response = await request()
      .post(clubMembersEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        email: "email@example.com",
      })
      .expect(400);
    expect(response.body.error.name).toEqual("member_validation_error");
    expect(response.body.error.message).toEqual("lastName is required");
  });

  it("[ERROR] return an error when the club does not exist", async () => {
    // MongoDB ObjectId
    const nonexistentClubId = Array(24).fill("0").join("");
    const response = await request()
      .post(`/clubs/${nonexistentClubId}/members`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        lastName: "lastName",
        email: "email@example.com",
      })
      .expect(404);
    expect(response.body.error.name).toEqual("member_club_not_found_error");
    expect(response.body.error.message).toEqual("the club not found");
  });

  it("[ERROR] return an error when the user is not a club administrator", async () => {
    const response = await request()
      .post(clubMembersEndpoint)
      .set("Authorization", `Bearer ${nonAdminToken}`)
      .send({
        name: "name",
        lastName: "lastName",
        email: "email@example.com",
      })
      .expect(403);
    expect(response.body.error.name).toEqual(
      "club_user_is_not_the_admin_error"
    );
    expect(response.body.error.message).toEqual(
      "this users is not the admin of this club"
    );
  });

  // TODO delete inserted data after test
  it("[SUCCESS] add a member successfully", async () => {
    const name = faker.name.firstName();
    const lastName = faker.name.lastName();
    const email = faker.internet.email();
    const response = await request()
      .post(clubMembersEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: name,
        lastName: lastName,
        email: email,
      })
      .expect(201);
    expect(response.body.member).not.toBeNull();
    expect(response.body.member.name).toEqual(name);
    expect(response.body.member.lastName).toEqual(lastName);
    expect(response.body.member.email).toEqual(email);
  });
});
