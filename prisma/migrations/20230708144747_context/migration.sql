-- CreateTable
CREATE TABLE "contexts" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "contexts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contexts" ADD CONSTRAINT "contexts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
