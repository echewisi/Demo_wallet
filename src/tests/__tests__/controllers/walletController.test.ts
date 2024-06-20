import request from "supertest";
import app from "../../../app";
import {
  fundAccountService,
  withdrawFundsService,
  transferFundsService,
} from "../../../../src/services/walletService";

jest.mock("../../src/services/walletService");

describe("Wallet Controller", () => {
  it("should fund account successfully", async () => {
    (fundAccountService as jest.Mock).mockResolvedValue({
      success: true,
      message: "Account funded successfully!",
    });

    const response = await request(app).post("/api/wallets/fund-wallet").send({
      userId: "user-123",
      amount: 100,
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Account funded successfully!",
    });
  });

  it("should transfer funds successfully", async () => {
    (transferFundsService as jest.Mock).mockResolvedValue({
      success: true,
      message: "Transfer successful.",
    });

    const response = await request(app)
      .post("/api/wallets/transfer-funds")
      .send({
        userId: "user-123",
        recipientId: "wallet-456",
        amount: 50,
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Transfer successful.",
    });
  });

  it("should withdraw funds successfully", async () => {
    (withdrawFundsService as jest.Mock).mockResolvedValue({
      success: true,
      message: "Withdrawal successful.",
    });

    const response = await request(app)
      .post("/api/wallets/withdraw-funds")
      .send({
        userId: "user-123",
        amount: 50,
        password: "password123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Withdrawal successful.",
    });
  });
});
