// src/data/courses/python.js
// Fill in lessons when ready

const python = {
  id:          'python',
  lang:        'Python',
  color:       '#3A86FF',
  eyebrow:     'Python',
  title:       'Pythonla Kodlamanın Əsasları',
  description: 'Dəyişənlərdən funksiyalara — Python ilə proqramlaşdırmanı addım-addım öyrən.',

  modules: [
    {
      id:     'module-1',
      title:  'Dərs 1 — Python Əsasları',
      status: 'active',
      lessonCount: 6,
      lessons: [],   // ← fill when ready
    },
    {
      id:     'module-2',
      title:  'Dərs 2 — Funksiyalar',
      status: 'locked',
      lessonCount: 5,
      lessons: [],
    },
  ],
};

export default python;