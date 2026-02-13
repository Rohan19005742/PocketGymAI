-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "password" TEXT,
    "image" TEXT,
    "fitnessLevel" TEXT NOT NULL DEFAULT 'Beginner',
    "goal" TEXT NOT NULL DEFAULT 'Build Muscle',
    "age" INTEGER,
    "weight" REAL,
    "height" REAL,
    "trainingExperience" TEXT,
    "onboardingComplete" BOOLEAN NOT NULL DEFAULT false,
    "preferredTrainingDays" INTEGER,
    "exercisePreferences" TEXT,
    "dietaryPreferences" TEXT,
    "availableEquipment" TEXT,
    "completedWorkouts" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" DATETIME
);
INSERT INTO "new_User" ("age", "completedWorkouts", "createdAt", "email", "emailVerified", "fitnessLevel", "goal", "height", "id", "image", "name", "password", "resetToken", "resetTokenExpiry", "streakDays", "updatedAt", "weight") SELECT "age", "completedWorkouts", "createdAt", "email", "emailVerified", "fitnessLevel", "goal", "height", "id", "image", "name", "password", "resetToken", "resetTokenExpiry", "streakDays", "updatedAt", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_resetToken_key" ON "User"("resetToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
