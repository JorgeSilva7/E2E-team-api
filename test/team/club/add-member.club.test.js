import { expect } from "@jest/globals";
import request from "../../request";
import login from "../../login";

const clubEndpoint = "/clubs/:clubId/members";

describe("POST /clubs/:clubId/members", () => {
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
            clubId : 1 ,
            userId : 1,
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

    it.skip("[ERROR] return an error when the user is not an admin", async () => {
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
      }

    );

  it ("[SUCCESS] add a member successful", async () => {
    const member = {
        name: "nicolas",
        lastName: "rivas",
        email: "nicols@email.com",
        dni: "",
        nickname: "",
        //clubId : "655a34949b032619eafd6bb4" 
        //userId : "655a34701baa62917cae3aa9",
    }
    const response = await request()
      .post("/clubs/655a34949b032619eafd6bb4/members")
      .set("Authorization", `Bearer ${token}`)
      .send(member)
      .expect(201);
    expect(response.body.member).not.toBeNull();
    expect(response.body.member.name).toEqual(member.name);
    expect(response.body.member.lastName).toEqual(member.lastName);
    expect(response.body.member.email).toEqual(member.email);
    }
    );

});
