param(
  [int]$Port = 5500
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$listener = New-Object System.Net.HttpListener
$prefix = "http://localhost:$Port/"
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $root at $prefix (Ctrl+C to stop)"

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".ico"  = "image/x-icon"
  ".json" = "application/json; charset=utf-8"
  ".webmanifest" = "application/manifest+json"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
  } catch {
    break
  }
  $request = $context.Request
  $response = $context.Response

  $localPath = $request.Url.LocalPath
  if ($localPath -eq "/") { $localPath = "/index.html" }
  $filePath = Join-Path $root ($localPath.TrimStart("/") -replace "/", [IO.Path]::DirectorySeparatorChar)

  if (Test-Path $filePath -PathType Leaf) {
    $ext = [IO.Path]::GetExtension($filePath).ToLower()
    $contentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
    $bytes = [IO.File]::ReadAllBytes($filePath)
    $response.ContentType = $contentType
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $response.StatusCode = 404
    $notFound = [Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
    $response.OutputStream.Write($notFound, 0, $notFound.Length)
  }
  $response.OutputStream.Close()
}

$listener.Stop()
