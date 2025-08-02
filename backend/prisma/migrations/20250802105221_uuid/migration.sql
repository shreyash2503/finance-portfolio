/*
  Warnings:

  - The primary key for the `Portfolio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PortfolioItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PortfolioPerformance` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Portfolio` DROP FOREIGN KEY `Portfolio_userId_fkey`;

-- DropForeignKey
ALTER TABLE `PortfolioItem` DROP FOREIGN KEY `PortfolioItem_portfolioId_fkey`;

-- DropForeignKey
ALTER TABLE `PortfolioPerformance` DROP FOREIGN KEY `PortfolioPerformance_portfolioId_fkey`;

-- DropIndex
DROP INDEX `Portfolio_userId_fkey` ON `Portfolio`;

-- DropIndex
DROP INDEX `PortfolioItem_portfolioId_fkey` ON `PortfolioItem`;

-- DropIndex
DROP INDEX `PortfolioPerformance_portfolioId_fkey` ON `PortfolioPerformance`;

-- AlterTable
ALTER TABLE `Portfolio` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `PortfolioItem` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `portfolioId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `PortfolioPerformance` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `portfolioId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Portfolio` ADD CONSTRAINT `Portfolio_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PortfolioItem` ADD CONSTRAINT `PortfolioItem_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `Portfolio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PortfolioPerformance` ADD CONSTRAINT `PortfolioPerformance_portfolioId_fkey` FOREIGN KEY (`portfolioId`) REFERENCES `Portfolio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
