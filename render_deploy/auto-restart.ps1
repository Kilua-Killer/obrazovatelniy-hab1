# Автоматический перезапуск сервера
while ($true) {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Запускаем сервер..." -ForegroundColor Green
    
    # Запускаем сервер и ждем завершения
    $process = Start-Process -FilePath "node" -ArgumentList "server.js" -Wait -PassThru
    
    if ($process.ExitCode -ne 0) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Сервер упал с кодом $($process.ExitCode). Перезапуск через 5 секунд..." -ForegroundColor Red
        Start-Sleep -Seconds 5
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Сервер остановлен. Перезапуск через 2 секунды..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}
