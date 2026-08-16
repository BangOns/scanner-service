' run.vbs
Set WshShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")

' 1. Dapatkan lokasi folder tempat run.vbs ini diinstal (misal: C:\Program Files\SelarasScanner)
strFolder = objFSO.GetParentFolderName(WScript.ScriptFullName)

' 2. Paksa sistem untuk menjadikan folder tersebut sebagai direktori aktif
WshShell.CurrentDirectory = strFolder

' 3. Jalankan SelarasScanner.exe dari folder yang tepat secara tersembunyi (0 = hidden)
WshShell.Run chr(34) & strFolder & "\SelarasScanner.exe" & Chr(34), 0, False

Set WshShell = Nothing
Set objFSO = Nothing
