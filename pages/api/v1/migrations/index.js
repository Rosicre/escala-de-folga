import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOptions = {
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      // Captura nomes das migrations pendentes via logger
      const pendingMigrations = [];
      await migrationsRunner({
        ...defaultMigrationsOptions,
        logger: (msg) => {
          const match = msg.match(/would run migration (.+?)$/);
          if (match) {
            pendingMigrations.push(match[1]);
          }
        },
      });

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migrateMigrations = await migrationsRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });

      if (migrateMigrations.length > 0) {
        return response.status(201).json(migrateMigrations);
      }

      return response.status(200).json(migrateMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
