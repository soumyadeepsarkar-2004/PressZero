# PressZero 1-Click Telegram Credentials & Cloud Sync Script
param(
    [string]$BotToken,
    [string]$ChatId
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🤖 PRESSZERO 1-CLICK TELEGRAM AGENT SETUP" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $BotToken) {
    Write-Host "`nOpening @BotFather in Telegram Desktop..." -ForegroundColor Yellow
    Start-Process "tg://resolve?domain=BotFather"
    $BotToken = Read-Host "Paste your Telegram Bot Token from @BotFather (e.g. 123456789:ABCdef...)"
}

if (-not $ChatId) {
    Write-Host "`nOpening @userinfobot in Telegram Desktop..." -ForegroundColor Yellow
    Start-Process "tg://resolve?domain=userinfobot"
    $ChatId = Read-Host "Paste your Telegram Chat ID from @userinfobot (e.g. 987654321)"
}

$BotToken = $BotToken.Trim()
$ChatId = $ChatId.Trim()

if (-not $BotToken -or -not $ChatId) {
    Write-Host "Error: Both BotToken and ChatId are required." -ForegroundColor Red
    exit 1
}

# 1. Update local .env file
$envFile = "$PSScriptRoot\..\.env"
$envLines = @()
if (Test-Path $envFile) {
    $envLines = Get-Content $envFile | Where-Object { 
        $_ -notmatch "^TELEGRAM_BOT_TOKEN=" -and $_ -notmatch "^TELEGRAM_CHAT_ID=" 
    }
}
$envLines += "TELEGRAM_BOT_TOKEN=$BotToken"
$envLines += "TELEGRAM_CHAT_ID=$ChatId"
$envLines | Set-Content $envFile -Encoding utf8
Write-Host "✓ Updated local .env file" -ForegroundColor Green

# 2. Sync to GitHub Repository Secrets for 24/7 Cloud Runner
Write-Host "`nSyncing secrets to GitHub Actions for 24/7 PC-independent execution..." -ForegroundColor Cyan
$BotToken | gh secret set TELEGRAM_BOT_TOKEN
$ChatId | gh secret set TELEGRAM_CHAT_ID
Write-Host "✓ Synced TELEGRAM_BOT_TOKEN to GitHub Secrets" -ForegroundColor Green
Write-Host "✓ Synced TELEGRAM_CHAT_ID to GitHub Secrets" -ForegroundColor Green

# 3. Activate Telegram Webhook on Live Serverless Deployment
Write-Host "`nActivating 24/7 Telegram Webhook..." -ForegroundColor Cyan
$webhookUrl = "https://presszero.antideploy.app/api/telegram/webhook"
$tgApi = "https://api.telegram.org/bot$BotToken/setWebhook?url=$webhookUrl"
try {
    $resp = Invoke-RestMethod -Uri $tgApi -Method Get
    if ($resp.ok) {
        Write-Host "✓ Telegram Webhook successfully connected to $webhookUrl" -ForegroundColor Green
    } else {
        Write-Host "! Webhook response: $($resp.description)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "! Could not auto-register webhook: $($_.Exception.Message)" -ForegroundColor Yellow
}

# 4. Dispatch a Live Test Push Notification to the phone!
Write-Host "`nSending live test push alert to your phone..." -ForegroundColor Cyan
$env:TELEGRAM_BOT_TOKEN = $BotToken
$env:TELEGRAM_CHAT_ID = $ChatId
python "$PSScriptRoot\autonomous_social_agent.py" --test-alert

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " 🎉 TELEGRAM 24/7 CLOUD AGENT FULLY OPERATIONAL!" -ForegroundColor Green
Write-Host " Check your Telegram app on your phone for the test alert." -ForegroundColor Green
Write-Host " You can now send /status, /metrics, or /reels to your bot anytime." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
