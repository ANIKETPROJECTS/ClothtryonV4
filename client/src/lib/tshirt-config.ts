// Define the configuration for the virtual try-on assets
// In a real app, these would come from the database or API
// Using high-quality placeholders for the luxury aesthetic

export const TSHIRT_CONFIG = {
  id: "luxury-tee-001",
  name: "Essential Luxury Tee",
  price: 12000, // $120.00
  images: {
    front: "https://placehold.co/600x800/0f0f0f/D4AF37/png?text=Front+View",
    back: "https://placehold.co/600x800/0f0f0f/D4AF37/png?text=Back+View",
    left: "https://placehold.co/600x800/0f0f0f/D4AF37/png?text=Left+Side",
    right: "https://placehold.co/600x800/0f0f0f/D4AF37/png?text=Right+Side",
  },
  calibration: {
    scaleFactor: 1.8, // Adjust based on how the image should fit relative to shoulder width
    verticalOffset: 0, // Adjust to move shirt up/down relative to shoulders
  }
};
