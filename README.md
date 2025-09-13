# SuperHeroes - Test Work for JS Ninjas

A small CRUD web app for a superheroes database with an image gallery.

- Create / Edit / Delete a superhero  
- While creating or editing, **attach/remove images** (file uploads only – no URL fields in forms)  
- List superheroes with **pagination (5 per page)** showing **one image + nickname**  
- View a superhero’s **full details and all images**

---

## 1) Requirements → Features (what is implemented)

- **CRUD for superheroes** ✅  
- **Attach/remove images** during create/edit via **multipart file upload** (field `image`) ✅  
- **List view** with **pagination = 5 per page**, each card shows **one (latest) image** + nickname ✅  
- **Details view** shows **all fields and all images** ✅  
- **Backend:** Node.js (Express) ✅  
- **Frontend:** React (Vite) ✅  
- **Tests (backend):** Vitest + Supertest for main logic (CRUD, file upload, pagination) ✅  
- **README:** full run steps + assumptions ✅

---

## 2) Step-by-Step: Run the Solution

### 2.0 Prerequisites
- Node.js **≥ 18**
- npm
- macOS / Linux / Windows supported  
> Tip (macOS): avoid `sudo npm`. If your npm cache became root-owned:  
> `sudo chown -R "$USER":staff ~/.npm`

---

### 2.1 Clone the repository

git clone <repo-url>
cd SuperHeroes

---

### 2.2 Backend setup

cd backend
npm i

**Create backend/.env:**

DATABASE_URL="your/path"
PORT=your port

**Initialize DB, seed demo data (10 DC heroes), start API:**

npm run prisma:migrate      # or: npx prisma migrate dev
npm run seed                # adds 10 DC heroes with placeholder images
npm run dev                 # API → http://localhost:4000

What this does

- **Creates SQLite DB (dev.db)**
- **Applies Prisma schema**
- **Seeds 10 DC heroes (the list will show 5 on page 1, more on page 2)**
- **Serves static files at /uploads (maps to backend/uploads)**

---

### 2.3 Frontend setup

**Open a new terminal:**

cd frontend
npm i

**Create frontend/.env:**

VITE_API_ORIGIN=http://localhost:port

Run the UI:

npm run dev                 # UI → http://localhost:5173

What this does

- **Vite dev server on port 5173**
- **Frontend calls backend using VITE_API_ORIGIN**
- **Images resolve to http://localhost:4000/uploads/<filename>**

---

### 2.4 Verify

Open http://localhost:5173

1. You should see a paginated list (5 per page, one image per card)
2. Click a hero → details show all images and fields
3. Click Create to add a hero:
4. Fill fields
5. Select image files (multiple allowed)
6. Submit → redirect to details where your images appear

---

### 2.5 (Optional) Backend tests

Run tests covering main logic (CRUD, file upload, pagination):

cd backend
npm run test          # Vitest + Supertest
# or:
npm run test:watch

---

### 2.6 (Optional) Build frontend for production

cd frontend
npm run build
npm run preview       # preview the build locally
