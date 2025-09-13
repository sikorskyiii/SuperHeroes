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
```bash
git clone <repo-url>
cd SuperHeroes
