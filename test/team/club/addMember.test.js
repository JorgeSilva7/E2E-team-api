import request from "../../request";
import login from "../../login";

const addMemberEndpoint = "/clubs/:clubId/members";
const idClubTest = "655ad3c25f8c007af888ddbb";

describe("Team: Club: addMember - POST /clubs/:clubId/members", () => {
  
let token;
let club;

  beforeAll(async () => {
    token = await login();
    const usersResponse = await request()
    .get("/users/").set("Authorization", `Bearer ${token}`);
    const { users } = usersResponse.body;
    const response = await request()
      .post("/clubs").set("Authorization", `Bearer ${token}`).send({
        name: "club name",
        adminId: users[0]._id,
        description: "club description",
      }).expect(201);
    club = response.body;
  });

  it("Return an error when the authorization token is not provided", async () => {
    const response = await request()
    .post(addMemberEndpoint)
    .expect(401);
    expect(response.body.error.name).toEqual("auhtorization_token_is_required");
    expect(response.body.error.message).toEqual("the authorization header is needed and the token");
  });

  it("Return an error when the name is undefined", async () => {
    const response = await request()
      .post(addMemberEndpoint).set("Authorization", `Bearer ${token}`).send({
        lastName: "lastName",
        email: "email@example.com",
        dni: "dni",
        nickname: "nickname",
      }).expect(400);
    expect(response.body.error.name).toEqual("member_validation_error");
    expect(response.body.error.message).toEqual("name is required");
  });

  it("Return an error when the last name is undefined", async () => {
    const response = await request()
      .post(addMemberEndpoint).set("Authorization", `Bearer ${token}`).send({
        name: "name",
        email: "email@example.com",
        dni: "dni",
        nickname: "nickname",
      }).expect(400);
    expect(response.body.error.name).toEqual("member_validation_error");
    expect(response.body.error.message).toEqual("lastName is required");
  });

  it("Return an error when the club does not exist", async () => {
    const badClubId= "5f982c6e39ca4c6516f7f7a3";
    const response = await request()
      .post(`/clubs/${badClubId}/members`).set("Authorization", `Bearer ${token}`).send({
        name: "name",
        lastName: "lastName",
        email: "email@example.com",
        dni: "dni",
        nickname: "nickname",
      }).expect(404);
    expect(response.body.error.name).toEqual("member_club_not_found_error");
    expect(response.body.error.message).toEqual("the club not found");
  });

  it("Returns an error when the user is not an administrator of the selected club.", async () => {
    const member = {
      name: "name",
      lastName: "lastName",
      email: "email@example.com",
      dni: "dni",
      nickname: "nickname",
    }
    const response = await request()
      .post(`/clubs/${idClubTest}/members`).set("Authorization", `Bearer ${token}`).send(member)
      .expect(403);
    expect(response.body.error.name).toEqual("club_user_is_not_the_admin_error");
    expect(response.body.error.message).toEqual("this users is not the admin of this club");
  });

  it("Add a member to the club successfully", async () => {
    const member = {
      name: "name",
      lastName: "lastName",
      email: "email@example.com",
      dni: "dni",
      nickname: "nickname",
    };
    const response = await request()
      .post(`/clubs/${club.club._id}/members`).set("Authorization", `Bearer ${token}`).send(member)
      .expect(201);
    expect(response.body.member).not.toBeNull();
    expect(response.body.member.name).toEqual(member.name);
    expect(response.body.member.lastName).toEqual(member.lastName);
    expect(response.body.member.email).toEqual(member.email);
  });
});