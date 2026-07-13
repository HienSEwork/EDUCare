#!/bin/bash
# setup-ssl.sh — Cấp SSL Let's Encrypt cho educareteen.com trên VPS
# Chạy LẦN ĐẦU sau khi deploy.sh đã chạy thành công (app đang chạy ở port 80)
#
# Cách dùng:
#   chmod +x deploy/setup-ssl.sh
#   ./deploy/setup-ssl.sh
set -e

DOMAIN="educareteen.com"
WWW_DOMAIN="www.educareteen.com"
EMAIL="admin@educare.vn"          # Email nhận cảnh báo hết hạn cert
APP_DIR="/opt/educare/EDUCare"

echo "======================================================"
echo "  EDUCare SSL Setup — Let's Encrypt (Certbot)"
echo "  Domain: $DOMAIN"
echo "======================================================"

# ── 1. Cài Certbot nếu chưa có ─────────────────────────────────────────────
if ! command -v certbot &> /dev/null; then
  echo ""
  echo "--- Cài đặt Certbot ---"
  apt-get update -y
  apt-get install -y certbot
fi

# ── 2. Tạo thư mục webroot để nginx phục vụ challenge ──────────────────────
mkdir -p /var/www/certbot

# ── 3. Đảm bảo container nginx đang chạy (cần port 80) ─────────────────────
echo ""
echo "--- Kiểm tra container nginx ---"
cd "$APP_DIR"

# Nếu container chưa chạy, khởi động với nginx.conf tạm (HTTP only)
if ! docker ps --format '{{.Names}}' | grep -q "educare_frontend"; then
  echo "Container chưa chạy. Đang khởi động..."
  docker compose --env-file .env.production up -d frontend || true
  sleep 5
fi

# ── 4. Cấp certificate (webroot method — nginx tiếp tục chạy) ───────────────
echo ""
echo "--- Cấp SSL certificate ---"
certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  --non-interactive \
  -d "$DOMAIN" \
  -d "$WWW_DOMAIN"

echo "✓ Certificate đã được cấp tại /etc/letsencrypt/live/$DOMAIN/"

# ── 5. Kiểm tra file options-ssl-nginx.conf (Certbot thường tự tạo) ─────────
if [ ! -f /etc/letsencrypt/options-ssl-nginx.conf ]; then
  echo ""
  echo "--- Tải options-ssl-nginx.conf ---"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    -o /etc/letsencrypt/options-ssl-nginx.conf
fi

if [ ! -f /etc/letsencrypt/ssl-dhparams.pem ]; then
  echo ""
  echo "--- Tạo DH params (có thể mất 1-2 phút) ---"
  openssl dhparam -out /etc/letsencrypt/ssl-dhparams.pem 2048
fi

# ── 6. Rebuild và restart toàn bộ app với HTTPS enabled ─────────────────────
echo ""
echo "--- Rebuild và khởi động lại với HTTPS ---"
docker compose --env-file .env.production down
docker compose --env-file .env.production up --build -d

sleep 10
echo ""
docker compose ps

# ── 7. Thiết lập auto-renewal (cron) ────────────────────────────────────────
echo ""
echo "--- Thiết lập auto-renewal ---"
CRON_JOB="0 3 * * * certbot renew --quiet --webroot --webroot-path /var/www/certbot && docker exec educare_frontend nginx -s reload"

# Thêm cron nếu chưa tồn tại
if ! crontab -l 2>/dev/null | grep -q "certbot renew"; then
  (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  echo "✓ Cron auto-renewal đã được thêm (mỗi ngày 03:00)"
else
  echo "✓ Cron auto-renewal đã tồn tại"
fi

echo ""
echo "======================================================"
echo "  ✅ SSL Setup hoàn tất!"
echo "  🌐 https://$DOMAIN"
echo "  🌐 https://$WWW_DOMAIN"
echo "  🔁 Cert tự gia hạn mỗi ngày lúc 03:00"
echo "======================================================"
