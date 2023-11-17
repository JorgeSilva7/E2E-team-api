import supertest from "supertest";

export const teamService = {
  BASE_URL: "http://localhost:3000",
  loginAdmin: {
    email: "jorgeandres.silva@ufrontera.cl",
    password: "123asd",
  },
  loginUser: {
    email: "johndoe@gmail.com",
    password: "123asd",
  },
};

const request = () => {
  return supertest.agent(teamService.BASE_URL);
};

export default request;
