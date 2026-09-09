-- Seed data for exercises

INSERT INTO "Exercise" (id, name, "muscleGroup", difficulty, instructions, "equipmentRequired") VALUES
-- Chest
('ex-1', 'Push-ups', 'chest', 'beginner', '1. Start in plank position. 2. Lower body until chest nearly touches floor. 3. Push back up to starting position. 4. Keep body straight throughout.', '{"bodyweight"}'),
('ex-2', 'Bench Press', 'chest', 'intermediate', '1. Lie on flat bench. 2. Grip barbell at shoulder width. 3. Lower bar to chest. 4. Push bar up to starting position.', '{"barbell", "bench"}'),
('ex-3', 'Dumbbell Flyes', 'chest', 'intermediate', '1. Lie on bench with dumbbells above chest. 2. Lower dumbbells in arc motion. 3. Return to starting position with a squeeze.', '{"dumbbells", "bench"}'),

-- Back
('ex-4', 'Pull-ups', 'back', 'intermediate', '1. Hang from pull-up bar. 2. Pull body up until chin over bar. 3. Lower back to starting position.', '{"pull_up_bar"}'),
('ex-5', 'Barbell Rows', 'back', 'intermediate', '1. Bend at hips and knees. 2. Grip barbell with hands shoulder-width apart. 3. Pull barbell to chest. 4. Lower back to starting position.', '{"barbell"}'),
('ex-6', 'Dumbbell Rows', 'back', 'beginner', '1. Bend at hips with one knee on bench. 2. Row dumbbell to hip. 3. Lower back to starting position. 4. Repeat on other side.', '{"dumbbell", "bench"}'),

-- Shoulders
('ex-7', 'Shoulder Press', 'shoulders', 'intermediate', '1. Stand with dumbbells at shoulder height. 2. Press dumbbells overhead. 3. Lower back to shoulder height.', '{"dumbbells"}'),
('ex-8', 'Lateral Raises', 'shoulders', 'beginner', '1. Stand with dumbbells at sides. 2. Raise dumbbells to shoulder height. 3. Lower back down.', '{"dumbbells"}'),
('ex-9', 'Upright Rows', 'shoulders', 'intermediate', '1. Stand holding dumbbells in front of thighs. 2. Raise dumbbells to shoulder height. 3. Lower back down.', '{"dumbbells"}'),

-- Arms
('ex-10', 'Bicep Curls', 'arms', 'beginner', '1. Stand with dumbbells at sides. 2. Curl dumbbells up to shoulder height. 3. Lower back down.', '{"dumbbells"}'),
('ex-11', 'Tricep Dips', 'arms', 'beginner', '1. Use bench or chair behind you. 2. Lower body by bending elbows. 3. Push back up to starting position.', '{"bench"}'),
('ex-12', 'Hammer Curls', 'arms', 'beginner', '1. Stand with dumbbells at sides, palms facing each other. 2. Curl dumbbells up. 3. Lower back down.', '{"dumbbells"}'),

-- Legs
('ex-13', 'Squats', 'legs', 'beginner', '1. Stand with feet shoulder-width apart. 2. Lower body by bending knees. 3. Keep chest up and core tight. 4. Push back up to starting position.', '{"bodyweight"}'),
('ex-14', 'Lunges', 'legs', 'beginner', '1. Step forward with one leg. 2. Lower hips until both knees bent at 90 degrees. 3. Push back to starting position. 4. Alternate legs.', '{"bodyweight"}'),
('ex-15', 'Leg Press', 'legs', 'intermediate', '1. Sit with feet on platform. 2. Push platform away by extending legs. 3. Lower back down under control.', '{"leg_press_machine"}'),

-- Core
('ex-16', 'Plank', 'core', 'beginner', '1. Get in push-up position. 2. Hold straight body position. 3. Keep core tight. 4. Hold for time.', '{"bodyweight"}'),
('ex-17', 'Crunches', 'core', 'beginner', '1. Lie on back with knees bent. 2. Curl upper body towards knees. 3. Lower back down.', '{"bodyweight"}'),
('ex-18', 'Dead Bugs', 'core', 'beginner', '1. Lie on back with arms extended up. 2. Raise knees to 90 degrees. 3. Lower opposite arm and leg. 4. Return and repeat on other side.', '{"bodyweight"}');
