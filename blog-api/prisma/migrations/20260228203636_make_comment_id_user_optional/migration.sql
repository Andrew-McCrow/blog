-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_idUser_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "idUser" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES "User"("idUser") ON DELETE SET NULL ON UPDATE CASCADE;
