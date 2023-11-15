import supertest from "supertest";

export const teamService = {
  BASE_URL: "http://localhost:3000",
  login: {
    email: "jorgeandres.silva@ufrontera.cl",
    password: "123asd",
  },
};

const request = () => {
  return supertest.agent(teamService.BASE_URL);
};

export default request;
