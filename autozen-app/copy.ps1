try {
    $src = 'C:\Users\Wander\.gemini\antigravity-ide\brain\574718bc-3f16-4203-849c-a5380a233db8\media__1781737150103.png'
    $dest = 'c:\Users\Wander\Desktop\AutoZen\autozen-app\public\logo-autozen.png'
    [System.IO.File]::Copy($src, $dest, $true)
    Write-Host "Copy successful"
} catch {
    Write-Host "Error: $_"
}
