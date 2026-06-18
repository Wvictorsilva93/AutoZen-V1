$src = 'C:\Users\Wander\.gemini\antigravity-ide\brain\574718bc-3f16-4203-849c-a5380a233db8\media__1781737150103.png'
$dest = 'c:\Users\Wander\Desktop\AutoZen\autozen-app\public\logo-autozen.png'

Write-Host "Source exists: $(Test-Path $src)"
if (Test-Path $src) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($src)
        [System.IO.File]::WriteAllBytes($dest, $bytes)
        Write-Host "Copied $( $bytes.Length ) bytes to $dest"
    } catch {
        Write-Host "Error during copy: $_"
    }
} else {
    Write-Host "Source file not found!"
}

$dest2 = 'c:\Users\Wander\Desktop\AutoZen\autozen-app\public\logo.png'
if (Test-Path $dest2) {
    Write-Host "Renaming logo.png to logo-autozen.png"
    Rename-Item -Path $dest2 -NewName 'logo-autozen.png' -Force
}
