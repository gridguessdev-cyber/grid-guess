import { db } from "./database";

export const migrate = () => {
  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        map TEXT NOT NULL,
        country TEXT NOT NULL,
        squareSize INTEGER NOT NULL,
        horizontalShift INTEGER NOT NULL,
        verticalShift INTEGER NOT NULL
      );
    `,
      (err: Error) => {
        if (err) {
          console.error(err.message);
        }
        console.log("levels table created successfully.");
      }
    );
  });
};
