$env:SPRING_PROFILES_ACTIVE = 'mailtrap'
$env:SPRING_DATASOURCE_PASSWORD = ''
$env:SPRING_MAIL_HOST = 'sandbox.smtp.mailtrap.io'
$env:SPRING_MAIL_PORT = '2525'
$env:SPRING_MAIL_USERNAME = '1b615dc90d1364'
$env:SPRING_MAIL_PASSWORD = 'd7b2cc52e4e830'

Write-Host "Starting EDUcare backend with Mailtrap profile..."
Set-Location $PSScriptRoot
java -jar target/educare-backend-1.0.0.jar
