# Serves tools/render-media.html on http://localhost:8765/ and saves what it posts into tools/out/
# (then tools/convert-media.sh makes the addon's files). Stops when the page posts /done.
#   powershell -ExecutionPolicy Bypass -File tools/render-media.ps1
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$out = Join-Path $here "out"
New-Item -ItemType Directory -Force $out | Out-Null
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:8765/")
$l.Start()
Write-Output "listening on http://localhost:8765/"
while ($l.IsListening) {
  $c = $l.GetContext()
  $p = $c.Request.Url.AbsolutePath
  if ($c.Request.HttpMethod -eq "GET") {
    $b = [System.IO.File]::ReadAllBytes((Join-Path $here "render-media.html"))
    $c.Response.ContentType = "text/html; charset=utf-8"
    $c.Response.OutputStream.Write($b, 0, $b.Length)
  } elseif ($p -like "/save/*") {
    $name = [System.IO.Path]::GetFileName($p.Substring(6))
    $ms = New-Object System.IO.MemoryStream
    $c.Request.InputStream.CopyTo($ms)
    [System.IO.File]::WriteAllBytes((Join-Path $out $name), $ms.ToArray())
  }
  $c.Response.Close()
  if ($p -eq "/done") { $l.Stop() }
}
Write-Output "done"
