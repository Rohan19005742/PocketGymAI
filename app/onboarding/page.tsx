"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [fitnessLevel, setFitnessLevel] = useState("0-1");
  const [goal, setGoal] = useState("Build Muscle");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [trainingExperience, setTrainingExperience] = useState("0-1");
  const [trainingDays, setTrainingDays] = useState("4");
  const [exercisePreferences, setExercisePreferences] = useState<string[]>([
    "strength",
  ]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([
    "balanced",
  ]);
  const [equipment, setEquipment] = useState("gym");

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  const toggleArrayItem = (
    array: string[],
    item: string
  ): string[] => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fitnessLevel,
          goal,
          age: age ? parseInt(age) : null,
          weight: weight ? parseFloat(weight) : null,
          height: height ? parseFloat(height) : null,
          trainingExperience,
          preferredTrainingDays: parseInt(trainingDays),
          exercisePreferences: JSON.stringify(exercisePreferences),
          dietaryPreferences: JSON.stringify(dietaryPreferences),
          availableEquipment: equipment,
        }),
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to save onboarding data. Please try again.");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Let's Personalize Your Experience
          </h1>
          <p className="text-neutral-400 text-lg mb-8">
            Answer a few questions to help our AI coaches understand your fitness journey
          </p>

          {/* Progress Bar */}
          <div className="flex space-x-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-neutral-800"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-neutral-500">
            Step {step} of 4
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-3xl p-8 fade-in">
          {/* Step 1: Fitness Goals */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Fitness Goals</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Years of Training Experience
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[{ id: "0-1", label: "0-1 year" }, { id: "1-3", label: "1-3 years" }, { id: "3+", label: "3+ years" }].map(({ id, label }) => (
                      <button
                        key={id}
                        onClick={() => setFitnessLevel(id)}
                        className={`p-3 rounded-lg font-semibold transition-all ${
                          fitnessLevel === id
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                            : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">
                    Primary Goal
                  </label>
                  <div className="space-y-2">
                    {[
                      "Build Muscle",
                      "Lose Weight",
                      "Improve Strength",
                      "Boost Endurance",
                      "Improve Flexibility",
                    ].map((g) => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`w-full p-3 rounded-lg font-medium transition-all text-left ${
                          goal === g
                            ? "bg-blue-500/30 border border-blue-500/50 text-blue-200"
                            : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-neutral-600"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Body Stats */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Stats</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 25"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 75"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 180"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Training Experience
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "beginner", label: "0-1 years" },
                    { id: "intermediate", label: "1-3 years" },
                    { id: "advanced", label: "3+ years" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setTrainingExperience(id)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        trainingExperience === id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Training Preferences */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Training Preferences</h2>

              <div>
                <label className="block text-sm font-medium mb-3">
                  How many days per week can you train?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {["2", "3", "4", "5", "6"].map((day) => (
                    <button
                      key={day}
                      onClick={() => setTrainingDays(day)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        trainingDays === day
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      }`}
                    >
                      {day}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Exercise Preferences (select all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    { id: "strength", label: "Strength Training" },
                    { id: "cardio", label: "Cardio" },
                    { id: "flexibility", label: "Flexibility/Yoga" },
                    { id: "hiit", label: "HIIT" },
                    { id: "sports", label: "Sports" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() =>
                        setExercisePreferences(
                          toggleArrayItem(exercisePreferences, id)
                        )
                      }
                      className={`w-full p-3 rounded-lg font-medium transition-all text-left ${
                        exercisePreferences.includes(id)
                          ? "bg-blue-500/30 border border-blue-500/50 text-blue-200"
                          : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-neutral-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Available Equipment
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "home", label: "Home" },
                    { id: "gym", label: "Gym" },
                    { id: "both", label: "Both" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => setEquipment(id)}
                      className={`p-3 rounded-lg font-semibold transition-all ${
                        equipment === id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                          : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Nutrition Preferences */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Nutrition Preferences</h2>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Dietary Preferences (select all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    { id: "balanced", label: "Balanced Diet" },
                    { id: "highprotein", label: "High Protein" },
                    { id: "lowcarb", label: "Low Carb" },
                    { id: "keto", label: "Keto" },
                    { id: "vegan", label: "Vegan" },
                    { id: "vegetarian", label: "Vegetarian" },
                    { id: "glutenfree", label: "Gluten Free" },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() =>
                        setDietaryPreferences(
                          toggleArrayItem(dietaryPreferences, id)
                        )
                      }
                      className={`w-full p-3 rounded-lg font-medium transition-all text-left ${
                        dietaryPreferences.includes(id)
                          ? "bg-green-500/30 border border-green-500/50 text-green-200"
                          : "bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-neutral-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">
                  ✨ These preferences will help our AI Nutritionist create personalized meal recommendations for you!
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-700">
            <Button
              onClick={handlePrevious}
              disabled={step === 1 || isLoading}
              variant="outline"
              className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 disabled:opacity-50"
            >
              ← Previous
            </Button>

            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Onboarding →"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
