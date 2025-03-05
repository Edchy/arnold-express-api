interface Exercise {
  name: string;
  reps: number;
  sets: number;
  weight: number;
}

interface Workout {
  name: string;
  exercises: Exercise[];
}

const workouts: Workout[] = [
  {
    name: "Workout A",
    exercises: [
      { name: "Squats", reps: 5, sets: 5, weight: 225 },
      { name: "Bench Press", reps: 5, sets: 5, weight: 185 },
      { name: "Shoulder Press", reps: 12, sets: 3, weight: 95 },
    ],
  },
  {
    name: "Workout B",
    exercises: [
      { name: "Squats", reps: 12, sets: 3, weight: 135 },
      { name: "Deadlifts", reps: 8, sets: 3, weight: 225 },
      { name: "Lunges", reps: 10, sets: 3, weight: 95 },
    ],
  },
];

export { Workout, Exercise };
export default workouts;
