import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

console.log("Cloudinary Config Debug:", {
	cloud: process.env.CLOUDINARY_CLOUD_NAME,
	key_prefix: process.env.CLOUDINARY_API_KEY?.substring(0, 4) + "...",
	has_secret: !!process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "meu-site-perfeito",
		allowed_formats: ["jpg", "png", "jpeg", "webp", "gif"],
		public_id: (req: any, file: any) => {
			// Remove a extensão do nome original para o public_id
			const name = file.originalname.split(".")[0];
			return `${Date.now()}-${name}`;
		},
	} as any,
});

export const upload = multer({ storage: storage });
export { cloudinary };
