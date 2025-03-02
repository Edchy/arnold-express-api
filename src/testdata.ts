interface Exercise {
  name: string;
  reps: number;
  sets: number;
}

interface Workout {
  name: string;
  exercises: Exercise[];
}

const workouts: Workout[] = [
  {
    name: "5x5 Stronglifts",
    exercises: [
      { name: "Bench Press", reps: 10, sets: 3 },
      { name: "Pull-Ups", reps: 8, sets: 3 },
      { name: "Shoulder Press", reps: 12, sets: 3 },
    ],
  },
  {
    name: "Lower Body Power",
    exercises: [
      { name: "Squats", reps: 12, sets: 3 },
      { name: "Deadlifts", reps: 8, sets: 3 },
      { name: "Lunges", reps: 10, sets: 3 },
    ],
  },
];

export { Workout, Exercise };
export default workouts;
