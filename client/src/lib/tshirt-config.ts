// Define the configuration for the virtual try-on assets
// In a real app, these would come from the database or API
// Using high-quality placeholders for the luxury aesthetic

import frontImg from "@assets/Front2_1767677434383.PNG";
import backImg from "@assets/Back2_1767677434383.PNG";
import leftImg from "@assets/left2_1767677434384.PNG";
import rightImg from "@assets/right2_1767677434384.PNG";

export const TSHIRT_CONFIG = {
  id: "luxury-tee-001",
  name: "Essential Luxury Tee",
  price: 12000, // $120.00
  images: {
    front: frontImg,
    back: backImg,
    left: leftImg,
    right: rightImg,
  },
  calibration: {
    scaleFactor: 1.8, // Adjust based on how the image should fit relative to shoulder width
    verticalOffset: 0, // Adjust to move shirt up/down relative to shoulders
  }
};
