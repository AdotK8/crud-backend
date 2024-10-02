const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../index");
const fetch = require("node-fetch");
const { Development } = require("../models/developmentModels");
const nodemailer = require("nodemailer");
require("jest-fetch-mock").enableMocks();

require("dotenv").config();

jest.mock("node-fetch", () => require("jest-fetch-mock"));

jest.mock("nodemailer");

let mongoServer;

jest.mock("nodemailer", () => {
  return {
    createTransport: jest.fn(() => {
      return {
        sendMail: jest.fn().mockResolvedValue({}),
      };
    }),
  };
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.disconnect();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Development.deleteMany();
});

describe("POST /api/developments/add", () => {
  it("should create a new development", async () => {
    const developmentData = {
      name: `Test Development 1`,
      landingPage: true,
      nearestStation: "Test Station",
      nearestStationDistance: 1.2,
      brochures: ["test-brochure.pdf"],
      zone: 2,
      parking: true,
      availability: {
        zeroBed: { available: true, priceFrom: 300000 },
        oneBed: { available: true, priceFrom: 400000 },
        twoBed: { available: true, priceFrom: 500000 },
        threeBed: { available: true, priceFrom: 600000 },
        fourPlusBed: { available: true, priceFrom: 700000 },
        lastUpdated: new Date(),
      },
      postcode: "E1 1AA",
      coords: [51.509865, -0.118092],
      developer: "Test Developer",
      cardinalLocation: "North",
      fee: 2.5,
      contactEmail: "test@example.com",
      completionYear: "2025",
    };

    const response = await request(app)
      .post("/api/developments/add")
      .send(developmentData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("name", developmentData.name);

    const savedDevelopment = await Development.findOne({
      name: developmentData.name,
    });
    expect(savedDevelopment).toBeTruthy();
    expect(savedDevelopment.name).toBe(developmentData.name);
  });
});

describe("GET /api/developments/get", () => {
  it("should fetch all developments", async () => {
    const response = await request(app).get("/api/developments/get");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

describe("GET /developments/get/:id", () => {
  let developmentId;

  beforeEach(async () => {
    const development = new Development({
      name: `Test Development 2`,
      landingPage: true,
      nearestStation: "Test Station",
      nearestStationDistance: 1.2,
      brochures: ["brochure1.pdf"],
      zone: 1,
      parking: true,
      availability: {
        zeroBed: { available: true, priceFrom: 200000 },
        oneBed: { available: true, priceFrom: 300000 },
        twoBed: { available: false, priceFrom: 0 },
        threeBed: { available: true, priceFrom: 500000 },
        fourPlusBed: { available: false, priceFrom: 0 },
        lastUpdated: new Date(),
      },
      postcode: "TEST123",
      coords: [51.5074, -0.1278],
      developer: "Test Developer",
      cardinalLocation: "North",
      fee: 500,
      contactEmail: "test@example.com",
      completionYear: "2024",
    });

    const savedDevelopment = await development.save();
    developmentId = savedDevelopment._id;
  });

  it("should return the development with the specified ID", async () => {
    const response = await request(app).get(
      `/api/developments/get/${developmentId}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", developmentId.toString());
    expect(response.body).toHaveProperty("name", "Test Development 2");
    expect(response.body).toHaveProperty("nearestStation", "Test Station");
  });

  it("should return a 404 error if the development is not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app).get(
      `/api/developments/get/${nonExistentId}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Development not found");
  });
});

describe("POST /api/developments/mod", () => {
  let developmentId;

  beforeEach(async () => {
    const development = new Development({
      name: `Test Development 3`,
      landingPage: true,
      nearestStation: "Test Station",
      nearestStationDistance: 1.2,
      brochures: ["brochure2.pdf"],
      zone: 1,
      parking: true,
      availability: {
        zeroBed: { available: true, priceFrom: 200000 },
        oneBed: { available: true, priceFrom: 300000 },
        twoBed: { available: false, priceFrom: 0 },
        threeBed: { available: true, priceFrom: 500000 },
        fourPlusBed: { available: false, priceFrom: 0 },
        lastUpdated: new Date(),
      },
      postcode: "TEST456",
      coords: [51.5074, -0.1278],
      developer: "Test Developer",
      cardinalLocation: "North",
      fee: 500,
      contactEmail: "test@example.com",
      completionYear: "2024",
    });

    const savedDevelopment = await development.save();
    developmentId = savedDevelopment._id;
  });

  it("should update an existing development", async () => {
    const updateData = {
      _id: developmentId,
      name: "Updated Development",
      zone: 3,
      fee: 600,
    };

    const response = await request(app)
      .post("/api/developments/mod")
      .send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name", "Updated Development");
    expect(response.body).toHaveProperty("zone", 3);
    expect(response.body).toHaveProperty("fee", 600);
  });

  it("should return a 400 error if the ID format is invalid", async () => {
    const invalidIdData = {
      _id: "invalid_id_format",
      name: "Updated Development",
    };

    const response = await request(app)
      .post("/api/developments/mod")
      .send(invalidIdData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid ID format");
  });

  it("should return a 404 error if the development is not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const updateData = {
      _id: nonExistentId.toString(),
      name: "Non-Existent Development",
    };

    const response = await request(app)
      .post("/api/developments/mod")
      .send(updateData);

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("message", "Development not found");
  });
});

describe("DELETE /api/developments/:id", () => {
  let developmentId;

  beforeEach(async () => {
    const development = new Development({
      name: `Test Development for Deletion`,
      landingPage: true,
      nearestStation: "Test Station",
      nearestStationDistance: 1.2,
      brochures: ["brochure-to-delete.pdf"],
      zone: 1,
      parking: true,
      availability: {
        zeroBed: { available: true, priceFrom: 200000 },
        oneBed: { available: true, priceFrom: 300000 },
        twoBed: { available: false, priceFrom: 0 },
        threeBed: { available: true, priceFrom: 500000 },
        fourPlusBed: { available: false, priceFrom: 0 },
        lastUpdated: new Date(),
      },
      postcode: "TESTDELETE",
      coords: [51.5074, -0.1278],
      developer: "Test Developer",
      cardinalLocation: "North",
      fee: 500,
      contactEmail: "test@example.com",
      completionYear: "2024",
    });

    const savedDevelopment = await development.save();
    developmentId = savedDevelopment._id;
  });

  it("should delete an existing development", async () => {
    const response = await request(app)
      .delete(`/api/developments/${developmentId}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Development deleted and archived successfully."
    );

    const deletedDevelopment = await Development.findById(developmentId);
    expect(deletedDevelopment).toBeFalsy();
  });

  it("should return a 400 error if the ID format is invalid", async () => {
    const response = await request(app)
      .delete(`/api/developments/invalid_id_format`)
      .send();

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "Invalid ID format.");
  });

  it("should return a 404 error if the development is not found", async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/developments/${nonExistentId}`)
      .send();

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty("error", "Development not found.");
  });
});

describe("GET /api/developments/mapping/get", () => {
  beforeEach(async () => {
    await Development.create([
      {
        name: `Mapping Test Development 1`,
        landingPage: true,
        nearestStation: "Test Station",
        nearestStationDistance: 1.2,
        brochures: ["test-brochure.pdf"],
        zone: 2,
        parking: true,
        availability: {
          zeroBed: { available: true, priceFrom: 300000 },
          oneBed: { available: true, priceFrom: 400000 },
          twoBed: { available: true, priceFrom: 500000 },
          threeBed: { available: true, priceFrom: 600000 },
          fourPlusBed: { available: true, priceFrom: 700000 },
          lastUpdated: new Date(),
        },
        postcode: "E1 1AA",
        coords: [51.509865, -0.118092],
        developer: "Test Developer",
        cardinalLocation: "North",
        fee: 2.5,
        contactEmail: "test@example.com",
        completionYear: "2025",
      },
      {
        name: `Mapping Test Development 2`,
        landingPage: true,
        nearestStation: "Test Station",
        nearestStationDistance: 1.2,
        brochures: ["test-brochure.pdf"],
        zone: 2,
        parking: true,
        availability: {
          zeroBed: { available: true, priceFrom: 300000 },
          oneBed: { available: true, priceFrom: 400000 },
          twoBed: { available: true, priceFrom: 500000 },
          threeBed: { available: true, priceFrom: 600000 },
          fourPlusBed: { available: true, priceFrom: 700000 },
          lastUpdated: new Date(),
        },
        postcode: "E1 1AA",
        coords: [51.509865, -0.118092],
        developer: "Test Developer",
        cardinalLocation: "North",
        fee: 2.5,
        contactEmail: "test@example.com",
        completionYear: "2025",
      },
    ]);
  });

  it("should return mapping information for all developments", async () => {
    const response = await request(app).get("/api/developments/mapping/get");

    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    response.body.forEach((development) => {
      expect(development).toHaveProperty("coords");
    });

    expect(response.body.length).toBe(2);
  });

  it("should return an empty array if there are no developments", async () => {
    await Development.deleteMany();
    const response = await request(app).get("/api/developments/mapping/get");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe("POST /api/developments/send-match-email", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should send a match email successfully", async () => {
    const requestBody = {
      selection: [
        {
          name: `Test Development 1`,
          landingPage: true,
          nearestStation: "Test Station",
          nearestStationDistance: 1.2,
          brochures: ["test-brochure.pdf"],
          zone: 2,
          parking: true,
          availability: {
            zeroBed: { available: true, priceFrom: 300000 },
            oneBed: { available: true, priceFrom: 400000 },
            twoBed: { available: true, priceFrom: 500000 },
            threeBed: { available: true, priceFrom: 600000 },
            fourPlusBed: { available: true, priceFrom: 700000 },
            lastUpdated: new Date(),
          },
          postcode: "E1 1AA",
          coords: [51.509865, -0.118092],
          developer: "Test Developer",
          cardinalLocation: "North",
          fee: 2.5,
          contactEmail: "test@example.com",
          completionYear: "2025",
        },
      ],
      email: "test@example.com",
      name: "John Doe",
    };

    const response = await request(app)
      .post("/api/developments/send-match-email")
      .send(requestBody);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Email sent successfully!");
    expect(nodemailer.createTransport).toHaveBeenCalled();
  });
});
