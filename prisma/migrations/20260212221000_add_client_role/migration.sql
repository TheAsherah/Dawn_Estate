-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('user', 'client', 'admin') NOT NULL DEFAULT 'user';
