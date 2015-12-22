Param(
[string]$filePath
)

(Get-Content $filePath).replace("./jaydata.d.ts", "../../../crmtypescript/scripts/typings/jaydata/jaydata.d.ts") | Set-Content $filePath
(Get-Content $filePath).replace("$data.IPromise", "$data.IPromise<any>") | Set-Content $filePath
