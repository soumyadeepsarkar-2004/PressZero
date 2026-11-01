# Deploy script for PressZero to Antideploy
$ErrorActionPreference = "Stop"
Write-Host "Creating deployment archive..."
$deployTar = "$env:TEMP\presszero-deploy.tar.gz"
if (Test-Path $deployTar) { Remove-Item $deployTar -Force }

# Package workspace excluding heavy dev / video binaries and Dockerfile to use Antideploy native Next.js runner
tar -czf $deployTar --exclude=.git --exclude=node_modules --exclude=.next --exclude=dist --exclude=promo-video --exclude="marketing" --exclude="docs/screenshots" --exclude="public/videos" --exclude="public/marketing" --exclude="*.mp4" --exclude="*.exe" --exclude="*.dmg" --exclude="*.zip" --exclude="*.gif" --exclude="Dockerfile" .

$size = (Get-Item $deployTar).Length / 1MB
Write-Host ("Archive created: {0:N2} MB" -f $size)

$cfg = Get-Content "$env:USERPROFILE\.antideploy\config.json" | ConvertFrom-Json
$token = $cfg.token
$appId = "71272d83-280d-405b-99ba-3844c0ca7116"

Write-Host "Uploading to Antideploy API..."
$response = curl.exe -s -X POST "https://antideploy.com/api/v1/deploy?applicationId=$appId" -H "Authorization: Bearer $token" -F "archive=@$deployTar"
Write-Host "Deploy response: $response"

Start-Sleep -Seconds 3
Write-Host "Pinging production domain..."
$head = curl.exe -s -I "https://presszero.antideploy.app" | Select-String "HTTP"
Write-Host "Health Check: $head"
