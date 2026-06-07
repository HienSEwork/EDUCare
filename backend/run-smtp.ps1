Set-Location $PSScriptRoot

Write-Host "Starting EDUcare backend with SMTP profile..."

# --- Configure these values before running ---
# You can either edit the values below or export the corresponding environment
# variables in your shell before running this script. Do NOT commit credentials.

# Activate the SMTP Spring profile
$env:SPRING_PROFILES_ACTIVE = 'smtp'

# SMTP settings (example shown for Gmail SMTP with App Password)
# Prefer storing the real values outside source control, for example in backend/.env
$env:SPRING_MAIL_HOST = 'smtp.gmail.com'
$env:SPRING_MAIL_PORT = '587'
$env:SPRING_MAIL_USERNAME = 'your-email@gmail.com'
$env:SPRING_MAIL_PASSWORD = 'YOUR_SMTP_PASSWORD_OR_APP_PASSWORD'
$env:SPRING_MAIL_PROTOCOL = 'smtp'

# Optional explicit JavaMail properties (environment names follow Spring Boot mapping):
# spring.mail.properties.mail.smtp.auth
$env:SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH = 'true'
# spring.mail.properties.mail.smtp.starttls.enable
$env:SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE = 'true'

# Datasource — adjust if needed for your local DB
$env:SPRING_DATASOURCE_URL = 'jdbc:mysql://127.0.0.1:3307/educare?useSSL=false'
$env:SPRING_DATASOURCE_USERNAME = 'root'
$env:SPRING_DATASOURCE_PASSWORD = ''

# Run the built jar
java -jar .\target\educare-backend-1.0.0.jar

Write-Host "Backend stopped." 
