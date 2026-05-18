# AI Agent Rules for EDUcare VN

File nay la rule bat buoc cho AI agent khi code trong repo `educare-vn`.

## Muc tieu

- Giu cau truc fullstack ro rang: `backend/` la Spring Boot API, `frontend/` la React/Vite app, `data/` la SQL schema/seed.
- Tang toc tien do nhung khong doi bang cach phat sinh bug, code trung lap, hoac rewrite lon khong can thiet.
- Moi thay doi phai uu tien cap nhat code hien co, giu backward compatibility khi co the.

## Nguyen tac lam viec

1. Doc code hien co truoc khi sua.
2. Khong xoa code cu de viet lai neu co the update/refactor nho.
3. Khong tao framework, folder, hoac pattern moi neu project da co pattern phu hop.
4. Khong commit artifact build hoac dependency local: `node_modules`, `dist`, `target`, `*.log`, `.env`.
5. Khong hard-code credential, URL production, secret, token, password.
6. Khi sua BE, chay toi thieu `mvn -f backend/pom.xml test`.
7. Khi sua FE, chay toi thieu `npm --prefix frontend test` hoac `npm --prefix frontend run build` theo muc do thay doi.
8. Khi sua full app, uu tien chay `npm run test` va `npm run build`.

## Rule ve Model Versioning

Moi khi code mot logic, feature, function moi ma can them hoac thay doi model/domain model, agent phai tao mot file model version moi.

Quy uoc ten file:

```text
backend/src/main/resources/model-versions/V1_<model-name>.md
backend/src/main/resources/model-versions/V2_<model-name>.md
backend/src/main/resources/model-versions/V3_<model-name>.md
```

Quy tac dat version:

- Tim version lon nhat hien co trong `backend/src/main/resources/model-versions/`.
- Tao file moi voi version tiep theo, khong sua/xoa version cu tru khi user yeu cau ro.
- `<model-name>` dung kebab-case hoac snake_case ngan gon, vi du `V1_user-profile.md`, `V2_quiz-attempt.md`.
- Neu thay doi lien quan nhieu model, tao 1 file version tong hop co ten feature, vi du `V3_learning-progress.md`.

Noi dung bat buoc trong moi file model version:

```md
# Vx <model or feature name>

## Purpose
- Ly do can model/change nay.

## Data Contract
- Field/type/nullability/default.
- Enum/value hop le neu co.

## Backend Integration
- Entity/model bi anh huong.
- Repository/service/controller/DTO can update.
- Auth/role/validation rule neu co.

## Database Integration
- Bang/cot/index/foreign key can them/sua.
- File SQL can update: `data/init.sql`, `data/seed.sql`, hoac file seed lien quan.
- Cach dam bao app run duoc voi MySQL.

## Frontend Integration
- Type/API client/page/component can update neu feature co FE.

## Compatibility
- Anh huong den data cu.
- Migration/seed/backfill neu can.

## Verification
- Lenh da chay.
- Test case can co hoac can update.
```

## Auto Integration khi Run App

Khi model version moi duoc tao, agent phai tich hop du vao app de khi run BE hoac full app khong bi lech contract:

- Backend:
  - Cap nhat Java entity trong `backend/src/main/java/vn/educare/backend/model`.
  - Cap nhat repository/service/controller/DTO neu model duoc expose qua API.
  - Cap nhat validation va exception handling neu input moi co rule.
  - Cap nhat `data/init.sql` cho schema MySQL.
  - Cap nhat `data/seed.sql` hoac `data/quizbank.sql` neu UI/API can data mau.
  - Giu `spring.jpa.hibernate.ddl-auto=validate`; khong doi sang `update` de che loi schema.
- Frontend:
  - Cap nhat `frontend/src/types/api.ts` neu API contract doi.
  - Cap nhat API client usage, page/component/test lien quan.
  - Khong de mock data va backend contract lech nhau.
- Full app:
  - Root scripts phai van chay duoc: `npm run dev`, `npm run build`, `npm run test`.

## Backend Coding Rules

- Controller chi xu ly HTTP mapping, auth/current user, request/response DTO.
- Business logic nam trong `service/`.
- Database access nam trong `repository/`.
- Entity chi map database va lifecycle hook don gian.
- Loi nghiep vu dung `ApiException`, khong throw raw runtime exception neu co message cho client.
- Khong dung `printStackTrace`; dung SLF4J logger.
- Public endpoint phai duoc khai bao ro trong `SecurityConfig`.
- Moi endpoint ghi data can validation input va auth neu khong phai public flow.

## Frontend Coding Rules

- API call dung `frontend/src/lib/api/client.ts`.
- Type response/request dung `frontend/src/types/api.ts`.
- UI copy dung cac file trong `frontend/src/content/` neu da co.
- Khong duplicate data lon trong page neu da co source tu API hoac content module.
- Component moi can giai quyet workflow that, khong chi them UI trang tri.

## Database Rules

- `data/init.sql` la schema chinh cho MySQL.
- `data/seed.sql` la seed chinh cho app.
- Them cot/bang moi phai co charset/collation phu hop voi utf8mb4 neu tao bang.
- Foreign key, unique key, index phai ro khi co relation/query thuong dung.
- Khong xoa cot/bang cu neu chua co plan migrate/backfill va user chap thuan.

## Git Rules

- Truoc khi commit: `git status --short --branch`.
- Khong revert thay doi khong phai cua minh neu user khong yeu cau.
- Commit message ngan, ro intent.
- Chi push `main` sau khi test/build lien quan pass hoac da bao ro ly do khong chay duoc.

## Definition of Done

Mot task chi duoc xem la xong khi:

- Code compile.
- Test/build lien quan da chay.
- Model version file duoc tao neu co model/domain change.
- Schema/API/FE types khong lech nhau.
- Khong co artifact local trong git.
- Worktree sach hoac chi con file local ignored hop ly.
