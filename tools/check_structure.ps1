$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
foreach ($file in @('index.html', 'styles.css', 'app.js', 'questions.js', 'README.md', '.nojekyll', '.github/workflows/pages.yml')) {
  if (-not (Test-Path -LiteralPath (Join-Path $root $file))) { Write-Error "structure check failed: missing $file." }
}
$html = Get-Content -Raw -LiteralPath (Join-Path $root 'index.html')
$app = Get-Content -Raw -LiteralPath (Join-Path $root 'app.js')
$css = Get-Content -Raw -LiteralPath (Join-Path $root 'styles.css')
foreach ($id in @('question-list', 'search-input', 'scope-filter', 'category-drawer', 'menu-button')) {
  if ($html -notmatch [regex]::Escape($id)) { Write-Error "structure check failed: missing $id." }
}
if ($html -notmatch '综合公开面经归纳') { Write-Error 'structure check failed: footer notice is missing.' }
if ($app -match 'innerHTML') { Write-Error 'structure check failed: app.js uses innerHTML.' }
if ($app -notmatch 'question\.answer|answer-source') { Write-Error 'structure check failed: answer rendering is missing.' }
if ($app -notmatch 'parseHash|writeHash|revealTarget') { Write-Error 'structure check failed: hash handling is incomplete.' }
if ($app -notmatch 'anchor === ''filters''') { Write-Error 'structure check failed: empty filters hash is not restorable.' }
if ($app -notmatch 'groupNames|categoryLabels|category-group') { Write-Error 'structure check failed: first-level group navigation is missing.' }
if ($app -notmatch 'aria-pressed') { Write-Error 'structure check failed: category button state is not exposed accessibly.' }
if ($app -notmatch 'matchMedia') { Write-Error 'structure check failed: mobile menu guard is missing.' }
if ($css -match 'clamp\(|letter-spacing\s*:') { Write-Error 'structure check failed: forbidden responsive type rule found.' }
if ($css -match 'background\s*:\s*#f0fff4') { Write-Error 'structure check failed: answer cards must not use a tinted background.' }
if ($css -notmatch '#menu-button\{display:none\}' -or $css -notmatch '@media\(max-width:760px\).*#menu-button') { Write-Error 'structure check failed: desktop/mobile menu constraints are missing.' }
if ($css -notmatch '@supports not') { Write-Error 'structure check failed: color-mix fallback is missing.' }
$workflow = Get-Content -Raw -LiteralPath (Join-Path $root '.github/workflows/pages.yml')
foreach ($action in @('actions/checkout@v4', 'actions/configure-pages@v5', 'actions/upload-pages-artifact@v3', 'actions/deploy-pages@v4')) {
  if ($workflow -notmatch [regex]::Escape($action)) { Write-Error "structure check failed: missing Pages action $action." }
}
$rawData = Get-Content -Raw -LiteralPath (Join-Path $root 'questions.js')
$idCount = ([regex]::Matches($rawData, '"id"\s*:')).Count
if ($idCount -ne 500) { Write-Error "data check failed: expected 500 ids, got $idCount." }
foreach ($field in @('id', 'group', 'category', 'title', 'scopes', 'refs')) {
  if ($rawData -notmatch ('"' + $field + '"\s*:')) { Write-Error "data check failed: missing $field." }
}
Write-Output 'structure and data checks passed.'
