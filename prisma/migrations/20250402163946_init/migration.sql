/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Film" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "released_date" DATE NOT NULL,
    "director" VARCHAR(255) NOT NULL,
    "genre" VARCHAR(100),
    "duration" INTEGER,
    "rating" DECIMAL(2,1),
    "language" VARCHAR(50),
    "country" VARCHAR(100),
    "synopsis" TEXT,
    "budget" BIGINT,
    "box_office" BIGINT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "films_pkey" PRIMARY KEY ("id")
);
