import { expect } from "@jest/globals";
import request from "../../request";

const clubEndpoint = "/clubs/";

describe("POST /clubs/:clubId/members", () => {
  let clubId;
  let clubMembersEndpoint;

  beforeAll(async () => {
    clubMembersEndpoint = `${clubEndpoint}${clubId}/members`;
  });

  it("[ERROR] return an error when the authorization token is not provided", async () => {
    const response = await request()
      .post(clubMembersEndpoint) // Validado por middleware, no necesita realmente clubId
      .expect(401);
    expect(response.body.error.name).toEqual("auhtorization_token_is_required");
    expect(response.body.error.message).toEqual(
      "the authorization header is needed and the token"
    );
  });
});
