import { expect } from "@jest/globals";
import request from "../../request";
import login from "../../login";
import * as jsonwebtoken from 'jsonwebtoken'

const clubEndpoint = "/clubs/:clubId/members";

describe("POST /clubs/:clubId/members", () => {
  let token;
  let club;
  let adminId;

  beforeAll(async () => {
    token = await login();
    adminId = jsonwebtoken.decode(token).userId;
    if (!adminId) throw new Error("adminId not found");
    club = await request()
      .post("/clubs")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "club olvidado por toda deidad",
        adminId: adminId,
        description: "club de prueba",
      })
      .expect(201);
  });

  it("[ERROR] return an error when the authorization token is not provided", async () => {
    const response = await request().post(clubEndpoint).expect(401);
    expect(response.body.error.name).toEqual("auhtorization_token_is_required");
    expect(response.body.error.message).toEqual(
      "the authorization header is needed and the token"
    );
  }
  );

  it("[ERROR] return an error when the name is undefined", async () => {
    const response = await request()
      .post(clubEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        lastName: "lastName",
        email: "",
        dni: "",
        nickname: "",
        clubId: 1,
        userId: 1,
      })
      .expect(400);
    expect(response.body.error.name).toEqual("member_validation_error");
    expect(response.body.error.message).toEqual("name is required");
  }
  );

  it("[ERROR] return an error when the last name is undefined", async () => {
    const response = await request()
      .post(clubEndpoint)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "name",
        email: "",
        dni: "",
        nickname: "",
      })
      .expect(400);
    expect(response.body.error.name).toEqual("member_validation_error");
    expect(response.body.error.message).toEqual(
      "lastName is required"
    );
  }
  );
  it("[ERROR] return an error when the club does not exist", async () => {
    // id que no existe = 5ca1abb6ce037511f000628e
    const response = await request()
      .post("/clubs/5ca1abb6ce037511f000628e/members")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "pedro",
        lastName: "perez",
        email: "pedro@gmail.com",
      })
      .expect(404);

    expect(response.body.error.name).toEqual("member_club_not_found_error");
    expect(response.body.error.message).toEqual("the club not found");
  });

  it("[ERROR] return an error when the user is not an admin", async () => {
    const idDifferentAdmin = '655a7d2d7f9e76a8970aef6b'; // Este dato se ha modificado manualmente en BD
    const member = {
      name: "nicolas",
      lastName: "rivas",
      email: "nicols@email.com",
      dni: "dni",
      nickname: "nickname",
    }
    const response = await request()
      .post(`/clubs/${idDifferentAdmin}/members`)
      .set("Authorization", `Bearer ${token}`)
      .send(member)
      .expect(403);
    expect(response.body.error.name).toEqual("club_user_is_not_the_admin_error")
    expect(response.body.error.message).toEqual("this users is not the admin of this club");
  }

  );

  it("[SUCCESS] add a member successful", async () => {
    const member = {
      name: "nicolas",
      lastName: "rivas",
      email: "nicols@email.com",
      dni: "dni",
      nickname: "nickname",
    }
    const response = await request()
      .post(`/clubs/${club.body.club._id}/members`)
      .set("Authorization", `Bearer ${token}`)
      .send(member)
      .expect(201);
    expect(response.body.member).not.toBeNull();
    expect(response.body.member.name).toEqual(member.name);
    expect(response.body.member.lastName).toEqual(member.lastName);
    expect(response.body.member.email).toEqual(member.email);
    expect(response.body.member.dni).toEqual(member.dni);
    expect(response.body.member.nickname).toEqual(member.nickname);
    expect(response.body.member.clubId).toEqual(club.body.club._id);
    expect(response.body.member._id).not.toBeNull();
    expect(response.body.member.createdAt).not.toBeNull();
    expect(response.body.member.updatedAt).not.toBeNull();
  }
  );

});
