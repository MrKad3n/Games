param([string]$Path, [switch]$ScriptsOnly)
$raw = [System.IO.File]::ReadAllText($Path)
if ($ScriptsOnly) {
    $sb = New-Object System.Text.StringBuilder
    $rx = [regex]'(?s)<script(?![^>]*\ssrc=)[^>]*>(.*?)</script>'
    $pos = 0
    foreach ($m in $rx.Matches($raw)) {
        $g = $m.Groups[1]
        [void]$sb.Append(($raw.Substring($pos, $g.Index - $pos) -replace '[^\r\n]', ' '))
        [void]$sb.Append($g.Value)
        $pos = $g.Index + $g.Length
    }
    [void]$sb.Append(($raw.Substring($pos) -replace '[^\r\n]', ' '))
    $src = $sb.ToString()
} else { $src = $raw }

$n = $src.Length; $i = 0; $line = 1; $prevSig = ''
$stack = New-Object System.Collections.Generic.Stack[object]
$errs = New-Object System.Collections.ArrayList
while ($i -lt $n) {
    $c = $src[$i]
    if ($c -eq "`n") { $line++; $i++; continue }
    if ($c -eq '/' -and $i + 1 -lt $n) {
        $c2 = $src[$i + 1]
        if ($c2 -eq '/') { while ($i -lt $n -and $src[$i] -ne "`n") { $i++ }; continue }
        if ($c2 -eq '*') {
            $i += 2
            while ($i + 1 -lt $n -and -not ($src[$i] -eq '*' -and $src[$i + 1] -eq '/')) { if ($src[$i] -eq "`n") { $line++ }; $i++ }
            $i += 2; continue
        }
        if ($prevSig -eq '' -or '(,=:[!&|?{};+-*%~^<>'.Contains($prevSig)) {
            $sl = $line; $i++; $inCls = $false; $ok = $false
            while ($i -lt $n) {
                $rc = $src[$i]
                if ($rc -eq '\') { $i += 2; continue }
                if ($rc -eq "`n") { break }
                if ($rc -eq '[') { $inCls = $true } elseif ($rc -eq ']') { $inCls = $false }
                elseif ($rc -eq '/' -and -not $inCls) { $ok = $true; $i++; break }
                $i++
            }
            if (-not $ok) { [void]$errs.Add("line ${sl}: unterminated regex") }
            $prevSig = '/'; continue
        }
        $prevSig = '/'; $i++; continue
    }
    if ($c -eq '"' -or $c -eq "'") {
        $q = $c; $sl = $line; $i++; $ok = $false
        while ($i -lt $n) {
            $sc = $src[$i]
            if ($sc -eq '\') { $i += 2; continue }
            if ($sc -eq "`n") { break }
            if ($sc -eq $q) { $ok = $true; $i++; break }
            $i++
        }
        if (-not $ok) { [void]$errs.Add("line ${sl}: unterminated string") }
        $prevSig = 'x'; continue
    }
    if ($c -eq '`') {
        $sl = $line; $i++; $ok = $false
        while ($i -lt $n) {
            $tc = $src[$i]
            if ($tc -eq '\') { $i += 2; continue }
            if ($tc -eq "`n") { $line++; $i++; continue }
            if ($tc -eq '`') { $ok = $true; $i++; break }
            if ($tc -eq '$' -and $i + 1 -lt $n -and $src[$i + 1] -eq '{') {
                $d = 1; $i += 2
                while ($i -lt $n -and $d -gt 0) {
                    $ec = $src[$i]
                    if ($ec -eq "`n") { $line++ } elseif ($ec -eq '{') { $d++ } elseif ($ec -eq '}') { $d-- }
                    elseif ($ec -eq '"' -or $ec -eq "'") {
                        $q2 = $ec; $i++
                        while ($i -lt $n) { if ($src[$i] -eq '\') { $i += 2; continue }; if ($src[$i] -eq $q2 -or $src[$i] -eq "`n") { break }; $i++ }
                    }
                    $i++
                }
                continue
            }
            $i++
        }
        if (-not $ok) { [void]$errs.Add("line ${sl}: unterminated template") }
        $prevSig = 'x'; continue
    }
    if ($c -eq '{' -or $c -eq '(' -or $c -eq '[') { $stack.Push(@{ ch = $c; line = $line }); $prevSig = $c; $i++; continue }
    if ($c -eq '}' -or $c -eq ')' -or $c -eq ']') {
        $want = @{ '}' = '{'; ')' = '('; ']' = '[' }[[string]$c]
        if ($stack.Count -eq 0) { [void]$errs.Add("line ${line}: stray '$c'") }
        else { $t = $stack.Pop(); if ($t.ch -ne $want) { [void]$errs.Add("line ${line}: '$c' closes '$($t.ch)' from line $($t.line)") } }
        $prevSig = $c; $i++; continue
    }
    if (-not [char]::IsWhiteSpace($c)) { $prevSig = $c }
    $i++
}
while ($stack.Count -gt 0) { $t = $stack.Pop(); [void]$errs.Add("unclosed '$($t.ch)' from line $($t.line)") }
if ($errs.Count -eq 0) { "OK  $Path" } else { "FAIL $Path"; $errs | Select-Object -First 15 }
