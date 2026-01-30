$ErrorActionPreference = "Stop"

# Define paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path $ScriptDir ".env"

if (-not (Test-Path $EnvFile)) {
    Write-Error ".env file not found at $EnvFile"
    exit 1
}

# Parse .env file
$EnvVars = @{}
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+?)\s*=\s*(.*)\s*$') {
        $Key = $matches[1]
        $Value = $matches[2]
        if ($Value -match '^"(.*)"$' -or $Value -match "^'(.*)'$") {
            $Value = $matches[1]
        }
        $EnvVars[$Key] = $Value
    }
}

$ProdUrl = $EnvVars["DATABASE_URL_PROD"]

if (-not $ProdUrl) {
    Write-Error "DATABASE_URL_PROD not found in .env"
    exit 1
}

Write-Host "Targeting Production DB..."

# Remove schema parameter if present, just in case, though usually fine for psql connection string if mapped to dbname
# But previously psql complained about schema param.
$ProdUrl = $ProdUrl -replace 'schema=[^&]*&?', ''
if ($ProdUrl -match '\?$') { $ProdUrl = $ProdUrl.Substring(0, $ProdUrl.Length - 1) }


$SQL = @"
BEGIN;
ALTER TABLE "Quest" ADD COLUMN IF NOT EXISTS "category" TEXT DEFAULT 'Side';
UPDATE "Quest" SET "category" = 'Main' WHERE "isMainQuest" = true;
ALTER TABLE "Quest" DROP COLUMN IF EXISTS "isMainQuest";
COMMIT;
"@

Write-Host "Executing SQL Migration..."
$Env:PGPASSWORD = ($ProdUrl -replace '.*:(.*)@.*', '$1')

# We need to parse user/host/port/db from URL for psql or just pass the URL string as argument to psql 
# psql accepts URI as first argument.
# Note: Password in URI might work depending on psql version/config, but standard approach is safer.
# Using command pipe.

echo $SQL | psql "$ProdUrl"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Migration applied successfully!" -ForegroundColor Green
} else {
    Write-Error "Migration failed with exit code $LASTEXITCODE"
}
