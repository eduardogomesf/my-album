import { User } from "@/domain/entity/user.entity";

describe("User Entity", () => {
  it("should create a new user", () => {
    const user = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@mail.com",
    });

    expect(user.id).toBeDefined();
    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.email).toBe("john.doe@mail.com");
    expect(user).toBeInstanceOf(User);
  });

  it("should not be able to create a new user without a first name", () => {
    expect(() => {
      new User({
        lastName: "Doe",
        email: "john.doe@mail.com",
      } as any);
    }).toThrow("First name should not be empty");
  });

  it("should not be able to create a new user without a last name", () => {
    expect(() => {
      new User({
        firstName: "John",
        email: "john.doe@mail.com",
      } as any);
    }).toThrow("Last name should not be empty");
  });

  it("should not be able to create a new user without a email", () => {
    expect(() => {
      new User({
        firstName: "John",
        lastName: "Doe",
      } as any);
    }).toThrow("E-mail should not be empty");
  });
});
