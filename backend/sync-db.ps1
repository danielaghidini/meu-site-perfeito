$ErrorActionPreference = "Stop"

# Define paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile = Join-Path $ScriptDir ".env"

if (-not (Test-Path $EnvFile)) {
    Write-Error ".env file not found at $EnvFile"
    exit 1
}

# Parse .env file
Write-Host "Reading .env file..."
$EnvVars = @{}
Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*([^#=]+?)\s*=\s*(.*)\s*$') {
        $Key = $matches[1]
        $Value = $matches[2]
        # Remove quotes if present
        if ($Value -match '^"(.*)"$' -or $Value -match "^'(.*)'$") {
            $Value = $matches[1]
        }
        $EnvVars[$Key] = $Value
    }
}

$ProdUrl = $EnvVars["DATABASE_URL_PROD"]
$LocalUrl = $EnvVars["DATABASE_URL"]

if (-not $ProdUrl) {
    Write-Error "DATABASE_URL_PROD not found in .env"
    exit 1
}
if (-not $LocalUrl) {
    Write-Error "DATABASE_URL not found in .env"
    exit 1
}

# Remove schema parameter as psql doesn't support it
$LocalUrl = $LocalUrl -replace 'schema=[^&]*&?', ''
# Clean up trailing ? or & if any (simple approach)
if ($LocalUrl -match '\?$') { $LocalUrl = $LocalUrl.Substring(0, $LocalUrl.Length - 1) }

Write-Host "Production DB: $ProdUrl"
Write-Host "Local DB:      $LocalUrl"
Write-Warning "This will OVERWRITE the local database with production data."
Write-Host "Starting backup and restore process..."

# Use cmd /c to handle piping robustly in all PowerShell versions
# --clean: commands to DROP databases/tables before creating them
# --if-exists: used with --clean to prevent errors if they don't exist
# --no-owner --no-privileges: skip ownership/privilege commands which often cause issues across different users/hosts
$Command = "pg_dump `"$ProdUrl`" --clean --if-exists --no-owner --no-privileges | psql `"$LocalUrl`""

# Execute
cmd /c $Command

if ($LASTEXITCODE -eq 0) {
    Write-Host "Synchronization completed successfully!" -ForegroundColor Green
} else {
    Write-Error "Synchronization failed with exit code $LASTEXITCODE"
}
