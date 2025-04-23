-- CreateEnum
CREATE TYPE "ContributionPeriod" AS ENUM ('DAILY', 'WEEKLY', 'BI_WEEKLY', 'MONTHLY');
-- CreateEnum
CREATE TYPE "DrawMode" AS ENUM ('ADMIN_SHUFFLE', 'SELF_DRAW');
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE');
-- CreateTable
CREATE TABLE "draws" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "membershipId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "draws_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "draws_position_check" CHECK ("position" >= 1)
);
-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "invitationCode" TEXT NOT NULL,
    "adminCode" TEXT NOT NULL,
    "contributionPeriod" "ContributionPeriod" NOT NULL DEFAULT 'MONTHLY',
    "contributionAmount" DOUBLE PRECISION NOT NULL,
    "contributionCurrency" TEXT NOT NULL,
    "drawMode" "DrawMode" NOT NULL DEFAULT 'SELF_DRAW',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "nextPaymentDate" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "totalMembers" INTEGER NOT NULL DEFAULT 2,
    CONSTRAINT "groups_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "groups_totalMembers_check" CHECK ("totalMembers" >= 2),
    CONSTRAINT "groups_contributionAmount_check" CHECK ("contributionAmount" > 0),
    CONSTRAINT "groups_nextPaymentDate_check" CHECK (
        "nextPaymentDate" IS NULL
        OR "nextPaymentDate" > CURRENT_TIMESTAMP
    )
);
-- CreateTable
CREATE TABLE "group_memberships" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "group_memberships_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "membershipId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "payments_amount_check" CHECK ("amount" > 0)
);
-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT DEFAULT NULL,
    "password" TEXT DEFAULT NULL,
    "phoneNumber" TEXT DEFAULT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE INDEX "draws_groupId_idx" ON "draws"("groupId");
-- CreateIndex
CREATE INDEX "draws_membershipId_idx" ON "draws"("membershipId");
-- CreateIndex
CREATE UNIQUE INDEX "groups_invitationCode_key" ON "groups"("invitationCode");
-- CreateIndex
CREATE INDEX "groups_createdBy_idx" ON "groups"("createdBy");
-- CreateIndex
CREATE INDEX "groups_invitationCode_idx" ON "groups"("invitationCode");
-- CreateIndex
CREATE INDEX "groups_adminCode_idx" ON "groups"("adminCode");
-- CreateIndex
CREATE INDEX "groups_isLocked_idx" ON "groups"("isLocked");
-- CreateIndex
CREATE INDEX "groups_nextPaymentDate_idx" ON "groups"("nextPaymentDate");
-- CreateIndex
CREATE INDEX "group_memberships_groupId_idx" ON "group_memberships"("groupId");
-- CreateIndex
CREATE INDEX "group_memberships_userId_idx" ON "group_memberships"("userId");
-- CreateIndex
CREATE UNIQUE INDEX "group_memberships_groupId_userId_key" ON "group_memberships"("groupId", "userId");
-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");
-- CreateIndex
CREATE INDEX "messages_groupId_idx" ON "messages"("groupId");
-- CreateIndex
CREATE INDEX "payments_dueDate_idx" ON "payments"("dueDate");
-- CreateIndex
CREATE INDEX "payments_membershipId_idx" ON "payments"("membershipId");
-- CreateIndex
CREATE INDEX "payments_groupId_idx" ON "payments"("groupId");
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
-- AddForeignKey
ALTER TABLE "draws"
ADD CONSTRAINT "draws_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "draws"
ADD CONSTRAINT "draws_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "group_memberships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "groups"
ADD CONSTRAINT "groups_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "group_memberships"
ADD CONSTRAINT "group_memberships_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "group_memberships"
ADD CONSTRAINT "group_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "messages"
ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "messages"
ADD CONSTRAINT "messages_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "payments"
ADD CONSTRAINT "payments_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "group_memberships"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "payments"
ADD CONSTRAINT "payments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "payments"
ADD CONSTRAINT "payments_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE CASCADE;