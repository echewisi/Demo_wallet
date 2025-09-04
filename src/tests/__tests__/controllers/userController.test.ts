import request from "supertest";
import app from "../../testApp";

jest.mock("../../../../src/services/userService");
import { createUserService } from "../../../../src/services/userService";

describe("User Controller", () => {
  it("should create a new user", async () => {
    (createUserService as jest.Mock).mockResolvedValue({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      wallet_id: "550e8400-e29b-41d4-a716-446655440001",
    });

    const response = await request(app).post("/api/users/create-account").send({
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      password: "SecurePass123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("wallet_id");
  });

  it("should return an error if user already exists", async () => {
    (createUserService as jest.Mock).mockRejectedValue(
      new Error("User already exists.")
    );

    const response = await request(app).post("/api/users/create-account").send({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+0987654321",
      password: "SecurePass123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("unable to create user!");
  });

  it("should return an error if required fields are missing", async () => {
    const response = await request(app).post("/api/users/create-account").send({
      name: "Jane Doe",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
