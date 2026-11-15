import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = new URL(
  `mysql://${process.env.DB_HOST || "localhost"}`
);

databaseUrl.port = process.env.DB_PORT || "3306";
databaseUrl.username = encodeURIComponent(process.env.DB_USER || "");
databaseUrl.password = encodeURIComponent(process.env.DB_PASSWORD || "");
databaseUrl.pathname = `/${process.env.DB_NAME || ""}`;

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    url: databaseUrl.toString(),
  },
});
