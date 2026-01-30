# Script para sincronizar banco de produção para localhost
# Faz dump e restore dentro do Docker para evitar problemas de encoding

$ErrorActionPreference = "Stop"

Write-Host "=== Sincronizando banco de producao para localhost ===" -ForegroundColor Cyan

# Configurações
$LOCAL_CONTAINER = "bjorn-skyrim-wiki-db-1"
$LOCAL_USER = "bjorn_user"
$LOCAL_PASSWORD = "bjorn_password"
$LOCAL_DB = "bjorn_wiki"

$PROD_HOST = "switchyard.proxy.rlwy.net"
$PROD_PORT = "10822"
$PROD_USER = "postgres"
$PROD_PASSWORD = "lZDeaRuXlFjkXRMQMHBMYiDlXvXmJkmH"
$PROD_DB = "railway"

Write-Host "`n1. Limpando banco local..." -ForegroundColor Yellow
docker exec -e PGPASSWORD=$LOCAL_PASSWORD $LOCAL_CONTAINER psql -U $LOCAL_USER -d $LOCAL_DB -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

Write-Host "`n2. Copiando dados de producao para localhost (pg_dump | psql)..." -ForegroundColor Yellow
Write-Host "   Isso pode demorar alguns segundos..." -ForegroundColor Gray

# Pipe direto do dump para o banco local via Docker network
docker run --rm --network=host -e PGPASSWORD=$PROD_PASSWORD postgres:17-alpine sh -c "pg_dump -h $PROD_HOST -p $PROD_PORT -U $PROD_USER -d $PROD_DB --no-owner --no-acl | PGPASSWORD=$LOCAL_PASSWORD psql -h 127.0.0.1 -p 5435 -U $LOCAL_USER -d $LOCAL_DB"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro durante a sincronizacao!" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== Sincronizacao concluida! ===" -ForegroundColor Green
Write-Host "Banco local agora eh uma copia do banco de producao." -ForegroundColor Cyan
