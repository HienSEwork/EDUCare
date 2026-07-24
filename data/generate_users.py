import uuid
import random
import datetime

# Valid BCrypt hash for '123456'
password_hash = "$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGTRSyvxzDZWclXU6"

first_names = ["An", "Binh", "Cuong", "Dung", "Hoa", "Hung", "Khoa", "Linh", "Minh", "Nam", "Phong", "Quan", "Sang", "Trang", "Tuan", "Vinh", "Xuan", "Yen", "Anh", "Bao"]
last_names = ["Nguyen", "Tran", "Le", "Pham", "Hoang", "Huynh", "Phan", "Vu", "Vo", "Dang", "Bui", "Do", "Ho", "Ngo", "Duong"]

start_date = datetime.datetime(2026, 6, 1)
end_date = datetime.datetime(2026, 7, 21)

def random_date():
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_seconds = random.randrange(86400)
    rand_date = start_date + datetime.timedelta(days=random_number_of_days, seconds=random_seconds)
    return rand_date.strftime('%Y-%m-%d %H:%M:%S')

sql_statements = ["INSERT INTO `users` (`id`, `full_name`, `email`, `username`, `password_hash`, `age`, `plan`, `xp`, `streak`, `quiz_score_total`, `avatar_url`, `role`, `created_at`, `updated_at`) VALUES"]
values = []

for _ in range(55):
    user_id = str(uuid.uuid4())
    fn = random.choice(first_names)
    ln = random.choice(last_names)
    full_name = f"{ln} {fn}"
    username = f"{fn.lower()}{random.randint(100, 999)}"
    email = f"{username}@gmail.com"
    age = random.randint(12, 18)
    xp = random.randint(0, 1000)
    streak = random.randint(0, 30)
    created_at = random_date()
    
    val = f"('{user_id}', '{full_name}', '{email}', '{username}', '{password_hash}', {age}, 'FREE', {xp}, {streak}, 0, NULL, 'STUDENT', '{created_at}', '{created_at}')"
    values.append(val)

sql_content = sql_statements[0] + "\n" + ",\n".join(values) + ";\n"

with open("d:/FPT_Saving/8/EXE2/EDUCare/data/seed_users.sql", "w", encoding="utf-8") as f:
    f.write(sql_content)

print("Created seed_users.sql with 55 mock users.")
