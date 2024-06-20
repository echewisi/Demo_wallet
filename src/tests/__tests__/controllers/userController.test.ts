import request from "supertest";
import app from "../../../app";

jest.mock("../../src/services/userService");
import { createUserService } from "../../../../src/services/userService";

describe("User Controller", () => {
  it("should create a new user", async () => {
    (createUserService as jest.Mock).mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      wallet_id: "wallet123",
    });

    const response = await request(app).post("/api/users").send({
      name: "John Doe",
      email: "john@example.com",
      phone: "1234567890",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("wallet_id");
  });

  it("should return an error if user already exists", async () => {
    (createUserService as jest.Mock).mockRejectedValue(
      new Error("User already exists.")
    );

    const response = await request(app).post("/api/users").send({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "0987654321",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "unable to create user! Error: User already exists."
    );
  });
});
