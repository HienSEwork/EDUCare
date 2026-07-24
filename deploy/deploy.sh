#!/usr/bin/env bash
# Chạy trên VPS. Deploy không xóa/recreate database volume.
set -Eeuo pipefail

APP_DIR="${APP_DIR:-/opt/educare}"
REPO_URL="${REPO_URL:-https://github.com/HienSEwork/EDUCare.git}"
BRANCH="${1:-${DEPLOY_BRANCH:-main}}"
SOURCE_MODE="${DEPLOY_SOURCE:-local}"
ENV_SOURCE="${ENV_SOURCE:-/root/.env.production}"
COMPOSE=(docker compose --env-file .env.production)

echo "=== Deploy EDUcare: source=$SOURCE_MODE, dir=$APP_DIR ==="

if [[ "$SOURCE_MODE" == "git" ]]; then
  if [[ ! -d "$APP_DIR/.git" ]]; then
    git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
  fi
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git pull --ff-only origin "$BRANCH"
else
  cd "$APP_DIR"
  if [[ ! -f docker-compose.yml ]]; then
    echo "ERROR: Không tìm thấy $APP_DIR/docker-compose.yml trong gói source local." >&2
    exit 1
  fi
fi

if [[ ! -f "$ENV_SOURCE" ]]; then
  echo "ERROR: Không tìm thấy $ENV_SOURCE" >&2
  exit 1
fi
install -m 600 "$ENV_SOURCE" .env.production

# The uploaded env file is the production source of truth. Remove stale/empty
# values inherited from the SSH shell because shell variables override --env-file.
while IFS='=' read -r env_key _; do
  env_key="${env_key%$'\r'}"
  if [[ "$env_key" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
    unset "$env_key"
  fi
done < .env.production

"${COMPOSE[@]}" config --quiet

# Validate the value resolved by Compose, not only the source env file. Shell
# variables can override --env-file and previously allowed an empty JWT secret.
resolved_jwt="$("${COMPOSE[@]}" config | awk '
  /^[[:space:]]+APP_JWT_SECRET:/ {
    sub(/^[^:]+:[[:space:]]*/, "");
    gsub(/^['\"']|['\"']$/, "");
    print;
    exit
  }')"
if [[ "$(printf '%s' "$resolved_jwt" | wc -c)" -lt 32 ]]; then
  echo "ERROR: APP_JWT_SECRET resolved by Docker Compose is missing or shorter than 32 bytes." >&2
  exit 1
fi
unset resolved_jwt

echo "--- Build image mới trong khi container cũ vẫn phục vụ ---"
"${COMPOSE[@]}" build backend frontend

# Chỉ khởi tạo DB nếu container chưa chạy. Tuyệt đối không down và không xóa volume.
if [[ "$(docker inspect -f '{{.State.Running}}' educare_db 2>/dev/null || true)" != "true" ]]; then
  echo "--- Database chưa chạy, khởi động với volume hiện có ---"
  "${COMPOSE[@]}" up -d db
fi

echo "--- Chờ database healthy ---"
for _ in $(seq 1 60); do
  db_health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}' educare_db 2>/dev/null || true)"
  [[ "$db_health" == "healthy" ]] && break
  sleep 2
done
if [[ "${db_health:-}" != "healthy" ]]; then
  docker logs --tail=120 educare_db >&2
  echo "ERROR: Database không healthy; dừng deploy, không thay backend cũ." >&2
  exit 1
fi

echo "--- Chạy migration append-only ---"
"${COMPOSE[@]}" exec -T db sh -lc \
  'exec mysql --default-character-set=utf8mb4 -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE"' \
  < deploy/migrations/V21__password_reset_otps.sql

echo "--- Recreate riêng backend, không restart DB ---"
"${COMPOSE[@]}" up -d --no-deps --force-recreate backend

echo "--- Chờ backend healthy ---"
backend_health="starting"
for _ in $(seq 1 60); do
  backend_state="$(docker inspect -f '{{.State.Status}}' educare_backend 2>/dev/null || true)"
  backend_health="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}unknown{{end}}' educare_backend 2>/dev/null || true)"
  [[ "$backend_health" == "healthy" ]] && break
  if [[ "$backend_state" == "exited" || "$backend_state" == "dead" ]]; then
    break
  fi
  sleep 2
done

if [[ "$backend_health" != "healthy" ]]; then
  docker logs --tail=200 educare_backend >&2
  echo "ERROR: Backend không healthy." >&2
  exit 1
fi

echo "--- Cập nhật frontend sau khi backend đã UP ---"
"${COMPOSE[@]}" up -d --no-deps --force-recreate frontend

"${COMPOSE[@]}" ps
echo "=== Deploy thành công: https://educareteen.com/health ==="
