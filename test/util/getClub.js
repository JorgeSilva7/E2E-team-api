import request from "../request";

/**
 * This function retrieves a club based on the admin's email.
 *
 * @param {string} token - The authorization token. (could be any user's token)
 * @param {string} email - The email of the club's admin.
 *
 * @returns {Object} The club object that has an admin with the given email. If no club is found, it returns undefined.
 */
async function getClub(token, email) {
  const response = await request()
    .get("/clubs")
    .set("Authorization", `Bearer ${token}`);
  const clubs = response.body.clubs;
  const club = clubs.find((club) => club.admin.email === email);
  return club;
}

export default getClub;
