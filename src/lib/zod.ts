import { array, coerce, object, string } from "zod";

export const RoomSchema = object({
  name: string().min(1),
  description: string().min(10).max(100),
  capacity: coerce.number().gt(0),
  price: coerce.number().gt(0),
  amenities: array(string()).nonempty(),
});

export const ContactShecma = object({
  name: string().min(6, "Name at least 6 characters"),
  email: string()
    .min(6, "Email at leats 6 characters")
    .email("Please enter a valid email"),
  subject: string().min(6, "Name at least 6 characters"),
  message: string()
    .min(20, "Message at least 20 characters")
    .max(200, "Message maximum 200 characters"),
});
