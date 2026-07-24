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
- API URL in frontend dev: `/api` proxied to `http://localhost:8081/api`
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

Chay ca backend va frontend tu root:

```powershell
npm install
npm --prefix frontend install
npm run dev
```

Hoac chay rieng trong 2 terminal:

```powershell
# Terminal 1: backend
mvn -f backend/pom.xml spring-boot:run

# Terminal 2: frontend
npm --prefix frontend run dev
```

Kiem tra backend:

```powershell
Invoke-WebRequest http://localhost:8081/actuator/health
Invoke-WebRequest http://localhost:8081/api/lessons
```

## Build va test

```powershell
npm run build
npm run test
```

## Deploy VPS

Production nhan source local tai `/opt/educare` va doc bien moi truong tu
`/root/.env.production`. Script deploy build image moi truoc, khong chay `docker compose down`,
khong xoa/recreate database volume, va chi cap nhat frontend sau khi backend healthy.

```bash
cd /opt/educare
bash deploy/deploy.sh
curl -fsS https://educareteen.com/health
```

Kiem tra truc tiep tren VPS:

```bash
docker compose --env-file .env.production ps
docker inspect educare_backend --format='{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}'
docker logs --tail=200 educare_backend
```

Khong su dung `docker compose down -v`, `docker volume rm` hoac `docker system prune --volumes`
tren VPS vi cac lenh nay co the xoa database.


