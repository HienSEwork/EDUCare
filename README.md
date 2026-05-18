# EDUcare VN

EDUcare VN la ung dung fullstack gom frontend React/Vite va backend Spring Boot. Du an su dung MySQL lam database chinh, du lieu schema/seed duoc quan ly trong thu muc `data/`.

## Cau truc

```text
educare-vn/
  backend/   # Spring Boot API
  frontend/  # React + Vite + Tailwind
  data/      # SQL schema va seed data cho MySQL
```

## Yeu cau moi truong

- Node.js 20+
- Java 17+
- Maven 3.9+
- MySQL 8+ hoac MariaDB tuong thich

## Cau hinh env

Tao file local tu cac file mau:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Gia tri local mac dinh:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8081`
- API URL: `http://localhost:8081/api`
- Database: `jdbc:mysql://127.0.0.1:3306/educare`

Cap nhat `SPRING_DATASOURCE_USERNAME` va `SPRING_DATASOURCE_PASSWORD` trong `backend/.env` theo MySQL local cua ban.

## Khoi tao database

Backend dang chay voi `spring.jpa.hibernate.ddl-auto=validate`, vi vay can tao schema truoc khi start backend:

```powershell
mysql -u root -p < data/init.sql
mysql -u root -p educare < data/seed.sql
```

Neu can seed them bo quiz:

```powershell
mysql -u root -p educare < data/quizbank.sql
```

## Chay local

Chay ca backend va frontend:

```powershell
npm install
npm run dev
```

Hoac chay rieng:

```powershell
npm --prefix frontend run dev
mvn -f backend/pom.xml spring-boot:run
```

## Build va test

```powershell
npm run build
npm run test
```

## Tai khoan seed

Admin:

- email: `admin@educare.vn`
- username: `educare_admin`
- password: `Admin@123`

User:

- email: `minhanh@educare.vn`
- username: `minhanh`
- password: `Admin@123`
