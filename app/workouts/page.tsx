'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Zap, Search, X } from 'lucide-react';
import { exercisesData, type ExerciseData } from '@/data/exercises';
import { InfoTooltip } from '@/components/info-tooltip';

export default function WorkoutsPage() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique muscle groups for filtering
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    exercisesData.forEach((ex) => {
      if (ex.metadata.primaryMuscle) {
        cats.add(ex.metadata.primaryMuscle);
      }
    });
    return Array.from(cats).sort();
  }, []);

  // Filter exercises based on search and category
  const filteredExercises = useMemo(() => {
    return exercisesData.filter((exercise) => {
      const matchesSearch =
        exercise.metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.metadata.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.metadata.movementPattern.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || exercise.metadata.primaryMuscle === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Exercise Library
          </h1>
          <p className="text-neutral-400">Explore, learn, and add exercises to your workouts</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800/50 border border-neutral-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <Card
                key={exercise.metadata.id}
                className="bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/[0.08] hover:border-white/[0.15] hover:shadow-xl hover:shadow-black/20 flex flex-col group"
              >
                <div className="p-6 flex flex-col flex-grow space-y-5">
                  {/* Title Section */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors duration-200 leading-snug">
                      {exercise.metadata.name}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-amber-300 transition-colors" />
                      <p className="text-sm text-neutral-300 capitalize font-medium">
                        {exercise.metadata.primaryMuscle}
                      </p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Key Metrics</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.03] backdrop-blur rounded-xl p-3 border border-white/[0.05] transition-all duration-200 hover:bg-white/[0.06] min-h-16 flex flex-col justify-center">
                        <p className="text-xs text-neutral-400 font-medium mb-1">Level</p>
                        <p className={`text-base font-bold ${
                          exercise.programmingProfile.difficultyLevel <= 2
                            ? 'text-emerald-400'
                            : exercise.programmingProfile.difficultyLevel <= 3
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}>
                          {exercise.programmingProfile.difficultyLevel}
                        </p>
                      </div>
                      <div className="bg-white/[0.03] backdrop-blur rounded-xl p-3 border border-white/[0.05] transition-all duration-200 hover:bg-white/[0.06] min-h-16 flex flex-col justify-center">
                        <p className="text-xs text-neutral-400 font-medium mb-1">Fatigue</p>
                        <p className="text-base font-bold text-orange-300">{exercise.programmingProfile.fatigueScore}</p>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Muscles */}
                  {exercise.metadata.secondaryMuscles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Also Works</p>
                      <div className="flex flex-wrap gap-1.5">
                        {exercise.metadata.secondaryMuscles.slice(0, 3).map((muscle) => (
                          <span
                            key={muscle}
                            className="text-xs px-3 py-1.5 bg-white/[0.04] text-neutral-200 rounded-lg border border-white/[0.05] capitalize font-medium"
                          >
                            {muscle}
                          </span>
                        ))}
                        {exercise.metadata.secondaryMuscles.length > 3 && (
                          <span className="text-xs px-3 py-1.5 text-neutral-400 font-medium">+{exercise.metadata.secondaryMuscles.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Spacer to push button down */}
                  <div className="flex-grow" />

                  {/* View Details Button */}
                  <Button
                    onClick={() => setSelectedExercise(exercise)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/40"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-white/[0.05] backdrop-blur flex items-center justify-center mb-6 border border-white/[0.08]">
                  <Dumbbell className="w-10 h-10 text-neutral-500" />
                </div>
                <p className="text-neutral-300 text-lg font-semibold mb-2">No exercises found</p>
                <p className="text-neutral-500 text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="bg-neutral-900 border-neutral-700 max-w-2xl max-h-[90vh] overflow-y-auto w-full">
            {/* Modal Header */}
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{selectedExercise.metadata.name}</h2>
                <p className="text-neutral-400 capitalize mt-1">{selectedExercise.metadata.primaryMuscle}</p>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Core Metadata Section */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5" />
                  Exercise Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Primary Muscle
                      <InfoTooltip text="The main muscle group this exercise targets" />
                    </p>
                    <p className="text-white font-semibold capitalize mt-1">
                      {selectedExercise.metadata.primaryMuscle}
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Movement Pattern
                      <InfoTooltip text="The type of movement (e.g., horizontal push, vertical pull)" />
                    </p>
                    <p className="text-white font-semibold capitalize mt-1">
                      {selectedExercise.metadata.movementPattern.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Mechanics
                      <InfoTooltip text="The type of equipment or setup required" />
                    </p>
                    <p className="text-white font-semibold capitalize mt-1">
                      {selectedExercise.metadata.mechanics}
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Unilateral
                      <InfoTooltip text="Whether the exercise works one side at a time (unilateral) or both sides together (bilateral)" />
                    </p>
                    <p className="text-white font-semibold mt-1">
                      {selectedExercise.metadata.isUnilateral ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>

                {/* Secondary Muscles */}
                {selectedExercise.metadata.secondaryMuscles.length > 0 && (
                  <div className="mt-4 bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Secondary Muscles
                      <InfoTooltip text="Additional muscles that are significantly engaged during this exercise" />
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedExercise.metadata.secondaryMuscles.map((muscle) => (
                        <span
                          key={muscle}
                          className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full text-sm capitalize"
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equipment */}
                <div className="mt-4">
                  <p className="text-neutral-400 text-sm mb-2 flex items-center gap-2">
                    Required Equipment
                    <InfoTooltip text="Equipment needed to safely and effectively perform this exercise" />
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.metadata.requiredEquipment.map((equip) => (
                      <span
                        key={equip}
                        className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm capitalize"
                      >
                        {equip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Programming Section */}
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Programming Profile
                </h3>

                {/* Difficulty Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Difficulty Level
                      <InfoTooltip text="Coach assessment of exercise difficulty on a 1-5 scale (1=easy, 5=very hard)" />
                    </p>
                    <p className="text-white font-semibold text-xl mt-1">
                      {selectedExercise.programmingProfile.difficultyLevel}/5
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Force Type
                      <InfoTooltip text="Compound exercises use multiple joints; isolation uses one joint" />
                    </p>
                    <p className="text-white font-semibold capitalize mt-1">
                      {selectedExercise.programmingProfile.forceType}
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Stability Demand
                      <InfoTooltip text="How much stabilizer muscle engagement is required (1=minimal, 5=maximum)" />
                    </p>
                    <p className="text-white font-semibold text-xl mt-1">
                      {selectedExercise.programmingProfile.stabilityDemand}/5
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Skill Demand
                      <InfoTooltip text="Technical difficulty and learning curve (1=beginner-friendly, 5=highly technical)" />
                    </p>
                    <p className="text-white font-semibold text-xl mt-1">
                      {selectedExercise.programmingProfile.skillDemand}/5
                    </p>
                  </div>
                </div>

                {/* Rep Ranges */}
                <div className="mt-4 bg-neutral-800/50 rounded-lg p-4">
                  <p className="text-neutral-400 text-sm mb-3 flex items-center gap-2">
                    Recommended Rep Ranges
                    <InfoTooltip text="Number of repetitions recommended for each training goal" />
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-white">
                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        Strength
                        <InfoTooltip text="Heavy weight, low reps for maximum strength" size="sm" />
                      </p>
                      <p className="font-semibold">
                        {selectedExercise.programmingProfile.recommendedRepRanges.strength[0]}-
                        {selectedExercise.programmingProfile.recommendedRepRanges.strength[1]}
                      </p>
                    </div>
                    <div className="text-white">
                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        Hypertrophy
                        <InfoTooltip text="Moderate weight and reps for muscle growth" size="sm" />
                      </p>
                      <p className="font-semibold">
                        {selectedExercise.programmingProfile.recommendedRepRanges.hypertrophy[0]}-
                        {selectedExercise.programmingProfile.recommendedRepRanges.hypertrophy[1]}
                      </p>
                    </div>
                    <div className="text-white">
                      <p className="text-xs text-neutral-400 flex items-center gap-1">
                        Endurance
                        <InfoTooltip text="Light weight, high reps for muscular endurance" size="sm" />
                      </p>
                      <p className="font-semibold">
                        {selectedExercise.programmingProfile.recommendedRepRanges.endurance[0]}-
                        {selectedExercise.programmingProfile.recommendedRepRanges.endurance[1]}
                      </p>
                    </div>
                    {selectedExercise.programmingProfile.recommendedRepRanges.power && (
                      <div className="text-white">
                        <p className="text-xs text-neutral-400 flex items-center gap-1">
                          Power
                          <InfoTooltip text="Very heavy weight with explosive movement for power development" size="sm" />
                        </p>
                        <p className="font-semibold">
                          {selectedExercise.programmingProfile.recommendedRepRanges.power[0]}-
                          {selectedExercise.programmingProfile.recommendedRepRanges.power[1]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fatigue & Recovery */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Fatigue Score
                      <InfoTooltip text="Overall fatigue impact on the nervous system (1-10, higher = more draining)" />
                    </p>
                    <p className="text-white font-semibold text-xl mt-1">
                      {selectedExercise.programmingProfile.fatigueScore}/10
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Muscle Damage
                      <InfoTooltip text="Risk of muscle soreness (DOMS) and tissue damage (1-10)" />
                    </p>
                    <p className="text-white font-semibold text-xl mt-1">
                      {selectedExercise.programmingProfile.muscularDamagePotential}/10
                    </p>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <p className="text-neutral-400 text-sm flex items-center gap-2">
                      Min Recovery
                      <InfoTooltip text="Minimum hours needed before training the same muscle group intensely again" />
                    </p>
                    <p className="text-white font-semibold text-xl mt-1">
                      {selectedExercise.programmingProfile.minimumRecovery}h
                    </p>
                  </div>
                </div>

                {/* Default Tempo */}
                <div className="mt-4 bg-neutral-800/50 rounded-lg p-4">
                  <p className="text-neutral-400 text-sm flex items-center gap-2">
                    Default Tempo
                    <InfoTooltip text="Format: eccentric(lowering)-pause-concentric(lifting)-pause in seconds (e.g., 3-1-1-0)" />
                  </p>
                  <p className="text-white font-semibold mt-2">
                    {selectedExercise.programmingProfile.defaultTempo}
                  </p>
                </div>

                {/* Notes */}
                {selectedExercise.programmingProfile.notes && (
                  <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <p className="text-amber-400 text-sm font-semibold mb-2 flex items-center gap-2">
                      Coach Notes
                      <InfoTooltip text="Key coaching insights and technical considerations for optimal execution" />
                    </p>
                    <p className="text-white text-sm">
                      {selectedExercise.programmingProfile.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-neutral-700">
                <Button
                  onClick={() => setSelectedExercise(null)}
                  className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white"
                >
                  Close
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold">
                  Add to Workout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

