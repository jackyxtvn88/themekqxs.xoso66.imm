$files = Get-ChildItem -Path . -Recurse -Include '*.js' -File
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $content = $content -replace "'../../component/", "'../../components/"
    $content = $content -replace "'../../../component/", "'../../../components/"
    $content = $content -replace "'../../component/", "'../../components/"
    $content = $content -replace '"../../component/', '"../../components/'
    $content = $content -replace '"../../../component/', '"../../../components/'
    Set-Content $file.FullName $content
}
Write-Host "Done fixing imports"
