import request from "supertest";
import app from "../../testApp";
import {
  fundAccountService,
  withdrawFundsService,
  transferFundsService,
} from "../../../../src/services/walletService";

jest.mock("../../../../src/services/walletService");

describe("Wallet Controller", () => {
  it("should fund account successfully", async () => {
    (fundAccountService as jest.Mock).mockResolvedValue({
      success: true,
      message: "Account funded successfully!",
      newBalance: 150,
    });

    const response = await request(app).post("/api/wallets/fund-wallet").send({
      userId: "550e8400-e29b-41d4-a716-446655440000",
      amount: 100,
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Account funded successfully!",
      data: {
        newBalance: 150,
      },
    });
  });

  it("should return an error if funding amount is invalid", async () => {
    const response = await request(app).post("/api/wallets/fund-wallet").send({
      userId: "550e8400-e29b-41d4-a716-446655440000",
      amount: -100,
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should transfer funds successfully", async () => {
    (transferFundsService as jest.Mock).mockResolvedValue({
      success: true,
      message: "Transfer successful.",
      transactionId: "123",
    });

    const response = await request(app)
      .post("/api/wallets/transfer-funds")
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440000",
        recipientWalletId: "550e8400-e29b-41d4-a716-446655440002",
        amount: 50,
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Transfer successful.",
      data: {
        transactionId: "123",
      },
    });
  });

  it("should return an error if transfer amount is insufficient", async () => {
    (transferFundsService as jest.Mock).mockRejectedValue(
      new Error("Insufficient funds")
    );

    const response = await request(app)
      .post("/api/wallets/transfer-funds")
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440000",
        recipientWalletId: "550e8400-e29b-41d4-a716-446655440002",
        amount: 150,
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should withdraw funds successfully", async () => {
    (withdrawFundsService as jest.Mock).mockResolvedValue({
      success: true,
      message: "Withdrawal successful.",
      newBalance: 50,
    });

    const response = await request(app)
      .post("/api/wallets/withdraw-funds")
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440000",
        amount: 50,
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Withdrawal successful.",
      data: {
        newBalance: 50,
      },
    });
  });

  it("should return an error if withdrawal amount is invalid", async () => {
    const response = await request(app)
      .post("/api/wallets/withdraw-funds")
      .send({
        userId: "550e8400-e29b-41d4-a716-446655440000",
        amount: -50,
        password: "password123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
