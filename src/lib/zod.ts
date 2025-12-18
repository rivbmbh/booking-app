import { array, coerce, object, string } from "zod";

export const RoomSchema = object({
  name: string()
    .min(6, "Name must be at least 6 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .nonempty("Name is required"),

  description: string()
    .min(30, "Description must be at least 30 characters long")
    .max(600, "Description cannot exceed 600 characters")
    .nonempty("Description is required"),

  capacity: coerce
    .number()
    .int("Capacity must be an integer")
    .gt(0, "Capacity must be greater than zero"),

  price: coerce.number().gt(0, "Price must be greater than zero"),

  amenities: array(string().min(1, "Amenity cannot be empty")).nonempty(
    "Amenities are required"
  ),
});

export const ReserveSchema = object({
  name: string()
    .trim()
    .nonempty("Name is required")
    .min(6, "Name must be at least 6 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .regex(/^[A-Za-z\s]+$/, "Name must contain letters only"),

  phone: string()
    .nonempty("Phone number is required")
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => val.length >= 10, {
      message: "Phone number must be at least 10 digits long",
    })
    .refine((val) => val.length <= 20, {
      message: "Phone number cannot exceed 20 digits",
    }),
});

export const ContactShecma = object({
  name: string()
    .min(6, "Name must be at least 6 characters long")
    .max(60, "Name cannot exceed 60 characters"),
  email: string()
    .min(6, "Email at leats 6 characters")
    .email("Please enter a valid email"),
  subject: string()
    .min(6, "Subject must be at least 6 characters long")
    .max(60, "Subject cannot exceed 60 characters"),
  message: string()
    .min(20, "Message at least 20 characters")
    .max(300, "Message maximum 300 characters"),
});
