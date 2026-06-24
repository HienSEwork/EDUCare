import json
import pymysql

def escape_sql_string(val):
    if val is None:
        return 'NULL'
    if isinstance(val, str):
        val = val.replace('\\', '\\\\').replace("'", "''")
        return f"'{val}'"
    return str(val)

def main():
    json_path = 'd:/FPT_Saving/8/EXE2/EDUCare/data/CourseSQL/educare.json'
    out_sql_path = 'd:/FPT_Saving/8/EXE2/EDUCare/data/educare_new.sql'
    insert_game_path = 'd:/FPT_Saving/8/EXE2/insert_game.sql'

    print("Connecting to DB to fetch schemas...")
    conn = pymysql.connect(host='127.0.0.1', user='root', password='', database='educare')
    cur = conn.cursor()
    
    cur.execute("SHOW TABLES")
    existing_tables = [r[0] for r in cur.fetchall()]
    
    table_schemas = {}
    for t in existing_tables:
        cur.execute(f"SHOW COLUMNS FROM `{t}`")
        table_schemas[t] = [r[0] for r in cur.fetchall()]

    print(f"Reading {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    sql_statements = [
        "SET NAMES utf8mb4;",
        "SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';",
        "SET FOREIGN_KEY_CHECKS=0;",
        ""
    ]

    for item in data:
        if item.get('type') == 'table':
            table_name = item.get('name')
            if table_name not in table_schemas:
                print(f"Skipping table {table_name} because it doesn't exist in local DB.")
                continue
                
            valid_cols = table_schemas[table_name]
            rows = item.get('data', [])
            
            sql_statements.append(f"TRUNCATE TABLE `{table_name}`;")
            # Disable foreign key checks for local truncate
            cur.execute("SET FOREIGN_KEY_CHECKS=0")
            cur.execute(f"TRUNCATE TABLE `{table_name}`")
            
            if not rows:
                sql_statements.append(f"-- No data for table {table_name}\n")
                continue
            
            chunk_size = 50
            for i in range(0, len(rows), chunk_size):
                chunk = rows[i:i+chunk_size]
                all_keys = list(chunk[0].keys())
                cols = [c for c in all_keys if c in valid_cols]
                
                if not cols:
                    break
                    
                col_str = ", ".join([f"`{c}`" for c in cols])
                
                val_lines = []
                for row in chunk:
                    vals = [escape_sql_string(row.get(c)) for c in cols]
                    val_lines.append(f"({', '.join(vals)})")
                
                sql_stmt = f"INSERT INTO `{table_name}` ({col_str}) VALUES " + ",\n".join(val_lines)
                sql_statements.append(sql_stmt + ";\n")
                # Execute locally
                cur.execute(sql_stmt)

    # Enable foreign key checks
    cur.execute("SET FOREIGN_KEY_CHECKS=1")
    conn.commit()

    sql_statements.append("SET FOREIGN_KEY_CHECKS=1;\n")

    print(f"Writing to {out_sql_path}...")
    with open(out_sql_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(sql_statements))

    # Append insert_game.sql to the output file and also execute it locally
    print(f"Appending {insert_game_path} to {out_sql_path} and executing locally...")
    with open(insert_game_path, 'r', encoding='utf-8') as f:
        insert_game_sql = f.read()

    with open(out_sql_path, 'a', encoding='utf-8') as f:
        f.write("\n\n-- Append new games --\n")
        f.write(insert_game_sql)

    # Execute insert_game locally
    # We can split insert_game by ';' safely if it doesn't contain ';' inside strings.
    # Actually, we know insert_game.sql doesn't have ';' inside strings.
    for stmt in insert_game_sql.split(';'):
        if stmt.strip():
            cur.execute(stmt)
    
    conn.commit()
    conn.close()

    print("Success! Data has been imported to local DB and written to educare_new.sql")

if __name__ == '__main__':
    main()
