import supertest from "supertest";
import app, { init } from "@/app";
import * as jwt from "jsonwebtoken";
import { cleanDb, generateValidToken } from "../helpers";
import { createBooking, createEnrollmentWithAddress, createHotel, createRoom, createTicket, createTicketType, createUser } from "../factories";
import httpStatus from "http-status";
import faker from "@faker-js/faker";
import bookingRepository from "@/repositories/booking-repository";

const server = supertest(app);

beforeAll(async () => {
  await init();
});
  
beforeEach(async () => {
  await cleanDb();
});

describe("GET: /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  describe("when token is valid", () => {
    it("should respond with status code 200 and booking data", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
        
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const booking = await createBooking(user.id, room.id);
    
      const response = await server.get("/booking/").set("Authorization", `Bearer ${token}`);
    
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          ...room,
          updatedAt: room.updatedAt.toISOString(),
          createdAt: room.createdAt.toISOString()
        }
      });
    });

    it("should respond with status code 404 if theres no booking for user", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
      
      const response = await server.get("/booking/").set("Authorization", `Bearer ${token}`);
      
      expect(response.status).toBe(404);
    });
  });
});

describe("POST: /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");
        
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
        
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
        
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
        
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
        
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status code 404 if there's no room for given roomId", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
                
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
        
      const booking = { "roomId": room.id + 1 };
            
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(booking);
            
      expect(response.status).toBe(404);
    });
    
    it("should respond with status code 403 if ticketType is remote", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(true, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
            
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const booking = { "roomId": room.id };
        
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(booking);
        
      expect(response.status).toBe(403);
    });
    
    it("should respond with status code 403 if ticketType doesn't include hotel", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, false);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
            
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const booking = { "roomId": room.id };
        
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(booking);
        
      expect(response.status).toBe(403);
    });
    
    it("should respond with status code 403 if ticket is not paid", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "RESERVED");
      const token = await generateValidToken(user);
            
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const booking = { "roomId": room.id };
        
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(booking);
        
      expect(response.status).toBe(403);
    });
    
    it("should respond with status code 403 if room is full", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
        
      const user2 = await createUser();
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticketType2 = await createTicketType(true, true);
      await createTicket(enrollment2.id, ticketType2.id, "PAID");
    
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      await createBooking(user2.id, room.id);
    
      const booking = { "roomId": room.id };
        
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(booking);
        
      expect(response.status).toBe(403);
    });
    
    it("should respond with status code 200 and booking id", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
    
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
    
      const booking = { "roomId": room.id };
        
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(booking);
      const bookingId = await bookingRepository.searchBooking(user.id);  
    
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ bookingId: bookingId.id });
    });
  });
});

describe("PUT: /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");
            
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
      
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
            
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
            
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
            
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
            
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
            
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status code 404 if there's no room for given new roomId", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
                  
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
          
      const newBooking = { "roomId": room.id + 1 };
              
      const response = await server.put("/booking/".concat(booking.id.toString())).set("Authorization", `Bearer ${token}`).send(newBooking);
              
      expect(response.status).toBe(404);
    });

    it("should respond with status 403 if theres no booking for user", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
      
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const newRoom = { "roomId": room.id };
          
      const response = await server.put("/booking/1").set("Authorization", `Bearer ${token}`).send(newRoom);
          
      expect(response.status).toBe(403);
    });
    
    it("should respond with status 403 if new room is full", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);

      const user2 = await createUser();
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticketType2 = await createTicketType(false, true);
      await createTicket(enrollment2.id, ticketType2.id, "PAID");
        
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const room2 = await createRoom(hotel.id);

      await createBooking(user2.id, room2.id);
      const booking = await createBooking(user.id, room.id);
      const newBooking = { "roomId": room2.id };
            
      const response = await server.put("/booking/".concat(booking.id.toString())).set("Authorization", `Bearer ${token}`).send(newBooking);
            
      expect(response.status).toBe(403);
    });

    it("should respond with status code 200 and bookingId", async () => {
      const user = await createUser();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, "PAID");
      const token = await generateValidToken(user);
      
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);
      const room2 = await createRoom(hotel.id);
      const newRoom = { "roomId": room2.id };
          
      const response = await server.put("/booking/".concat(booking.id.toString())).set("Authorization", `Bearer ${token}`).send(newRoom);
      const bookingId = await bookingRepository.searchBooking(user.id);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ bookingId: bookingId.id });
    });
  });
});
