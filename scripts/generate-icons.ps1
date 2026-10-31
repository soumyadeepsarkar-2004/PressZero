Add-Type -AssemblyName System.Drawing

function Draw-PressZeroIcon([int]$size) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $scale = $size / 120.0

    # Background rounded rect
    $bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#09090b"))
    $rect = New-Object System.Drawing.RectangleF 0, 0, $size, $size
    # Draw dark fill
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $r = 28 * $scale
    $d = $r * 2
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($size - $d, 0, $d, $d, 270, 90)
    $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
    $path.AddArc(0, $size - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.FillPath($bgBrush, $path)

    # Border
    $borderPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#27272a"), (2.0 * $scale))
    $g.DrawPath($borderPen, $path)

    # Outer Ellipse
    $outerPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#ffffff"), [Math]::Max(1.0, 3.5 * $scale))
    $outerPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
    $g.DrawEllipse($outerPen, (60 - 34) * $scale, (60 - 42) * $scale, (68 * $scale), (84 * $scale))

    # Inner Ellipse
    $innerPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#71717a"), [Math]::Max(1.0, 2.0 * $scale))
    $innerPen.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dot
    $g.DrawEllipse($innerPen, (60 - 20) * $scale, (60 - 28) * $scale, (40 * $scale), (56 * $scale))

    # Left caliper
    $caliperPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#ffffff"), [Math]::Max(1.5, 3.5 * $scale))
    $g.DrawLine($caliperPen, (22 * $scale), (60 * $scale), (48 * $scale), (60 * $scale))
    $g.DrawLine($caliperPen, (42 * $scale), (52 * $scale), (48 * $scale), (60 * $scale))
    $g.DrawLine($caliperPen, (42 * $scale), (68 * $scale), (48 * $scale), (60 * $scale))

    # Right caliper
    $g.DrawLine($caliperPen, (98 * $scale), (60 * $scale), (72 * $scale), (60 * $scale))
    $g.DrawLine($caliperPen, (78 * $scale), (52 * $scale), (72 * $scale), (60 * $scale))
    $g.DrawLine($caliperPen, (78 * $scale), (68 * $scale), (72 * $scale), (60 * $scale))

    # Center dot
    $whiteBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml("#ffffff"))
    $dotR = 5 * $scale
    $g.FillEllipse($whiteBrush, (60 - $dotR) * $scale, (60 - $dotR) * $scale, ($dotR * 2 * $scale), ($dotR * 2 * $scale))

    $g.Dispose()
    return $bmp
}

# 1. Generate PNGs
$png180 = Draw-PressZeroIcon 180
$png180.Save("public\apple-touch-icon.png", [System.Drawing.Imaging.ImageFormat]::Png)

$png192 = Draw-PressZeroIcon 192
$png192.Save("public\icon-192.png", [System.Drawing.Imaging.ImageFormat]::Png)

$png512 = Draw-PressZeroIcon 512
$png512.Save("public\icon-512.png", [System.Drawing.Imaging.ImageFormat]::Png)

# 2. Generate Favicon .ICO
$icoBmp = Draw-PressZeroIcon 32
$iconHandle = $icoBmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$fs = New-Object System.IO.FileStream "public\favicon.ico", ([System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()

Copy-Item "public\favicon.ico" "src\app\favicon.ico" -Force
Copy-Item "public\icon.svg" "src\app\icon.svg" -Force

"Icons generated successfully."
