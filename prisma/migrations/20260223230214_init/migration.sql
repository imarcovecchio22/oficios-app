/*
  Warnings:

  - The primary key for the `_CategoryToWorkerProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_CategoryToWorkerProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_CategoryToWorkerProfile" DROP CONSTRAINT "_CategoryToWorkerProfile_AB_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToWorkerProfile_AB_unique" ON "_CategoryToWorkerProfile"("A", "B");
