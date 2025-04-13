# BrightMind💡– Empowering Rural Education with AI

**BrightMind** is an AI-powered educational platform designed to bridge the learning gap in rural and under-resourced areas. Leveraging cutting-edge language models like **Gemini 2.0 Flash**, the platform provides accessible, engaging, and personalized learning experiences to both students and teachers.

---

## 🚀 Features

- 🔍 **AI-Generated Content Summaries**  
  Quickly understand complex topics with concise summaries powered by Gemini 2.0 Flash.

- ❓ **Doubt-Solving Chat Assistant**  
  Real-time AI chat to help students and teachers clarify doubts instantly.

- 📝 **Quiz Generation**  
  Automatically generate quizzes from lesson content to reinforce learning.

- 📄 **Downloadable PDFs**  
  Export summaries, quizzes, and notes as PDFs for offline use—ideal for areas with limited connectivity.

- 🌐 **Multi-Platform Access**  
  Built with **Next.js** for web and **React Native** for mobile—ensuring access across devices.

- 🧠 **Teacher Toolkit**  
  Access teaching aids, translated materials, and lesson plans tailored for rural contexts.

- 🌍 **Multilingual Support**  
  BrightMind breaks language barriers by offering educational content in multiple **regional languages**, ensuring inclusivity and better understanding for learners in diverse linguistic backgrounds.

---

### 🧱 Tech Stack

**Frontend**  
- 🌐 [Next.js](https://nextjs.org/) – React-based framework for server-side rendering and static websites  
- 📱 [React Native](https://reactnative.dev/) – Cross-platform mobile app development  

**Backend**  
- 🐍 [Django REST Framework](https://www.django-rest-framework.org/) – Flexible and powerful framework for building Web APIs  
- 🗃️ [SQLite](https://sqlite.org/) – A lightweight database for embedded apps  

**AI Engine**  
- 🤖 [Gemini 2.0 Flash](https://google.com) – AI model used for content generation (summaries, quizzes, chat)  

**Other Tools**  
- 🔒 [JWT](https://jwt.io/) – Secure token-based authentication  


---

## 🛠️ Installation

### Backend – Django

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend - Next.js

```bash
cd frontend
npm install
npm run dev
```

### Mobile - React Native

```bash
cd Appdev
npm install
npx expo start  # or run-ios
```
