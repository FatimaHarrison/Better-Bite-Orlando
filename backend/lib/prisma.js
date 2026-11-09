import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaMariaDb({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT || 3306),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,

	allowPublicKeyRetrieval: true,
});

const prisma = new PrismaClient({
	adapter,
});

export default prisma;
