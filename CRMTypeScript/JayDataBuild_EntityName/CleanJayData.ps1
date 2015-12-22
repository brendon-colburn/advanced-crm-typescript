Param([string]$filePath)

(Get-Content $filePath).replace("'required':true", "'required':false") | Set-Content $filePath