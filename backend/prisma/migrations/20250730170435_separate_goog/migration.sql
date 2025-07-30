/*
  Warnings:

  - You are about to drop the `GoogleUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GoogleUser";
PRAGMA foreign_keys=on;
