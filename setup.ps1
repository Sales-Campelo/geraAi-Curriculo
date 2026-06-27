param(
    [switch]$Help
)

if ($Help) {
    Write-Host @"
Uso: .\setup.ps1

Configura o ambiente local para rodar o GeraAI Curriculo sem Docker.
Requisitos: Python 3.10+, PostgreSQL 16+, Node.js 20+

O que esse script faz:
  1. Instala dependências Python (pip install -r requirements.txt)
  2. Instala dependências Node (npm install)
  3. Configura acesso trust ao PostgreSQL local
  4. Cria banco de dados e usuário 'geraai'
  5. Cria/atualiza backend/.env com host=localhost
  6. Executa makemigrations e migrate
"@
    exit
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Setup GeraAI Curriculo" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# 1. Python dependencies
Write-Host "[1/6] Instalando dependencias Python..." -ForegroundColor Yellow
pip install -r backend\requirements.txt
if ($LASTEXITCODE -ne 0) { Write-Host "Falhou!" -ForegroundColor Red; exit 1 }

# 2. Node dependencies
Write-Host "[2/6] Instalando dependencias Node..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "Falhou!" -ForegroundColor Red; exit 1 }
Set-Location ..

# 3. PostgreSQL - add trust auth for local connections
Write-Host "[3/6] Configurando acesso ao PostgreSQL..." -ForegroundColor Yellow

$pgData = "C:\Program Files\PostgreSQL\18\data"
$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$pgHba = Join-Path $pgData "pg_hba.conf"

if (-not (Test-Path $pgHba)) {
    Write-Host "PostgreSQL 18 não encontrado em C:\Program Files\PostgreSQL\18" -ForegroundColor Red
    Write-Host "Verifique a versão instalada e ajuste o caminho no script." -ForegroundColor Yellow
    exit 1
}

# Backup original
Copy-Item $pgHba "$pgHba.bak" -Force

# Add trust line BEFORE the existing auth lines
$content = Get-Content $pgHba
$trustLines = @(
    "# --- GeraAI setup - trust local ---",
    "local   all             all                                     trust",
    "host    all             all             127.0.0.1/32            trust",
    "host    all             all             ::1/128                 trust",
    "# --- fim trust ---"
)
$newContent = $trustLines + $content
$newContent | Set-Content $pgHba -Force

Write-Host "  pg_hba.conf atualizado com trust auth" -ForegroundColor Green

# Restart PostgreSQL service
Write-Host "  Reiniciando servico PostgreSQL..." -ForegroundColor Yellow
Restart-Service postgresql-x64-18 -ErrorAction SilentlyContinue
if ($?) { Write-Host "  PostgreSQL reiniciado" -ForegroundColor Green }
else {
    Write-Host "  Tentando iniciar servico..." -ForegroundColor Yellow
    Start-Service postgresql-x64-18 -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 3

# 4. Create database and user
Write-Host "[4/6] Criando banco de dados e usuario..." -ForegroundColor Yellow
$psql = Join-Path $pgBin "psql.exe"

& $psql -U postgres -c "SELECT 1 FROM pg_database WHERE datname='geraai'" -t | Out-Null
$dbExists = $LASTEXITCODE -eq 0

if (-not $dbExists) {
    & $psql -U postgres -c "CREATE DATABASE geraai OWNER postgres;"
    Write-Host "  Banco 'geraai' criado" -ForegroundColor Green
} else {
    Write-Host "  Banco 'geraai' ja existe" -ForegroundColor Green
}

& $psql -U postgres -c "SELECT 1 FROM pg_roles WHERE rolname='geraai'" -t | Out-Null
$userExists = $LASTEXITCODE -eq 0

if (-not $userExists) {
    & $psql -U postgres -c "CREATE USER geraai WITH PASSWORD 'geraai';"
    & $psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE geraai TO geraai;"
    & $psql -U postgres -c "GRANT ALL ON SCHEMA public TO geraai;"
    Write-Host "  Usuario 'geraai' criado" -ForegroundColor Green
} else {
    Write-Host "  Usuario 'geraai' ja existe" -ForegroundColor Green
}

# 5. Configure .env for local use
Write-Host "[5/6] Configurando .env..." -ForegroundColor Yellow
$envPath = "backend\.env"
if (-not (Test-Path $envPath)) {
    Copy-Item "backend\.env.example" $envPath
}

# Read current .env, replace POSTGRES_HOST=db -> localhost
$envContent = Get-Content $envPath -Raw
$envContent = $envContent -replace "POSTGRES_HOST=db", "POSTGRES_HOST=localhost"
$envContent = $envContent -replace "POSTGRES_PASSWORD=sua_senha", "POSTGRES_PASSWORD=geraai"
$envContent | Set-Content $envPath -Force

Write-Host "  .env atualizado com POSTGRES_HOST=localhost" -ForegroundColor Green

# 6. Run migrations
Write-Host "[6/6] Rodando migracoes..." -ForegroundColor Yellow
Set-Location backend
python manage.py collectstatic --noinput 2>$null
python manage.py makemigrations --noinput
python manage.py migrate --noinput
if ($LASTEXITCODE -ne 0) { Write-Host "Migracoes falharam!" -ForegroundColor Red; Set-Location ..; exit 1 }
Set-Location ..

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  Setup concluido!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para rodar o projeto, abra DOIS terminais:" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 1 - Backend:" -ForegroundColor Yellow
Write-Host "    cd backend" -ForegroundColor White
Write-Host "    python manage.py runserver" -ForegroundColor White
Write-Host ""
Write-Host "  Terminal 2 - Frontend:" -ForegroundColor Yellow
Write-Host "    cd frontend" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Acessar:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  API:      http://localhost:8000/api" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Red
Write-Host "  Configure sua GEMINI_API_KEY no arquivo backend\.env" -ForegroundColor Red
Write-Host "  (gere em https://aistudio.google.com/apikey)" -ForegroundColor Red
