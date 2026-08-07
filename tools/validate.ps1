[CmdletBinding()]
param(
    [string]$DataPath
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($DataPath)) {
    $scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
    $DataPath = Join-Path $scriptDirectory '..\questions.js'
}

function Fail([string]$Message) {
    Write-Error $Message
    exit 1
}

if (-not (Test-Path -LiteralPath $DataPath -PathType Leaf)) {
    Fail "Data file not found: $DataPath"
}

$source = Get-Content -Raw -Encoding UTF8 -LiteralPath $DataPath
$match = [regex]::Match($source, '(?s)^\s*window\.CPP_INTERVIEW_QUESTIONS\s*=\s*(\[.*\])\s*;?\s*$')
if (-not $match.Success) {
    Fail 'questions.js must contain one strict JSON assignment to window.CPP_INTERVIEW_QUESTIONS'
}

try {
    $questions = $match.Groups[1].Value | ConvertFrom-Json
} catch {
    Fail "JSON parse failed: $($_.Exception.Message)"
}

if ($null -eq $questions -or $questions.Count -ne 500) {
    $actual = if ($null -eq $questions) { 0 } else { $questions.Count }
    Fail "Question count must be 500, got $actual"
}

$expectedGroups = [ordered]@{
    cpp = 280
    gof = 80
    ue5 = 80
    windows = 60
}
$expectedCategories = [ordered]@{
    'cpp/core-language' = 22
    'cpp/types-expressions-initialization' = 18
    'cpp/classes-object-model' = 22
    'cpp/lifetime-raii' = 23
    'cpp/smart-pointers-allocators' = 18
    'cpp/value-categories-move-forwarding' = 22
    'cpp/templates-sfinae-traits-constexpr' = 35
    'cpp/containers-iterators' = 35
    'cpp/lambdas-utility-types' = 18
    'cpp/exceptions-rtti' = 14
    'cpp/standard-concurrency' = 35
    'cpp/strings-time-files-streams' = 18
    'gof/creation' = 18
    'gof/structural' = 24
    'gof/behavioral' = 38
    'ue5/uobject-reflection-gc' = 22
    'ue5/actor-component-subsystem' = 18
    'ue5/delegate-interface-async' = 14
    'ue5/replication-rpc-serialization' = 18
    'ue5/modules-plugins-buildcs' = 8
    'windows/process-thread-sync' = 22
    'windows/winsock-protocol-iocp' = 22
    'windows/dll-files-mmap-unicode-handles' = 16
}

$allowedProperties = @('id', 'group', 'category', 'title', 'scopes', 'refs', 'pattern', 'answer', 'source')
$forbiddenProperties = @('solution', 'explanation', 'hint', '解析', '答案')
$allowedHosts = @(
    'zh.cppreference.com',
    'www.informit.com',
    'www.pearson.com',
    'isocpp.github.io',
    'dev.epicgames.com',
    'learn.microsoft.com',
    'www.rfc-editor.org'
)
$coarseCppUrls = @(
    'https://zh.cppreference.com/cpp/language',
    'https://zh.cppreference.com/cpp/container',
    'https://zh.cppreference.com/cpp/thread',
    'https://zh.cppreference.com/cpp/string',
    'https://zh.cppreference.com/cpp/error',
    'https://zh.cppreference.com/cpp/memory'
)
$algorithmWords = @(
    '排序', '二分', '动态规划', '图算法',
    '手写算法', '算法题', '最短路径', '最小生成树',
    '背包问题', '贪心算法', '拓扑排序', '深度优先搜索',
    '广度优先搜索', '哈希表实现', '手写快排'
)
$algorithmRegex = ($algorithmWords -join '|')
$boilerplatePhrases = @(
    '在企业代码中如何界定其语义边界',
    '在稳定 ABI 的库中应如何设计',
    '在用户态服务中如何界定其生命周期',
    '在高并发网络服务中如何建立契约',
    '在桌面程序中如何设计稳定边界'
)

$seenIds = @{}
$seenTitles = @{}
$groupCounts = @{}
$categoryCounts = @{}
$patternCounts = @{}

for ($index = 0; $index -lt $questions.Count; $index++) {
    $question = $questions[$index]
    if ($null -eq $question) { Fail "Question $($index + 1) is null" }

    $properties = @($question.PSObject.Properties.Name)
    foreach ($property in $properties) {
        if ($allowedProperties -notcontains $property) {
            Fail "Question $($index + 1) has unexpected field: $property"
        }
    }
    foreach ($property in $forbiddenProperties) {
        if ($properties -contains $property) {
            Fail "Question $($index + 1) has forbidden answer field: $property"
        }
    }

    $expectedId = '{0:D3}' -f ($index + 1)
    if ([string]$question.id -ne $expectedId) {
        Fail "Expected id $expectedId, got '$($question.id)'"
    }
    if ($seenIds.ContainsKey([string]$question.id)) {
        Fail "Duplicate id: $($question.id)"
    }
    $seenIds[[string]$question.id] = $true

    $title = [string]$question.title
    if ([string]::IsNullOrWhiteSpace($title)) { Fail "Question $($index + 1) has empty title" }
    if ($seenTitles.ContainsKey($title)) { Fail "Duplicate title: $title" }
    $seenTitles[$title] = $true
    if ($title -notmatch '[？?]$') { Fail "Question $($index + 1) must end with a question mark: $title" }
    if ($title -match $algorithmRegex) {
        Fail "Question $($index + 1) appears to be an algorithm question"
    }
    foreach ($phrase in $boilerplatePhrases) {
        if ($title.Contains($phrase)) { Fail "Question $($index + 1) contains boilerplate phrasing: $phrase" }
    }

    $group = [string]$question.group
    if ($expectedGroups.Keys -notcontains $group) { Fail "Invalid group at question $($index + 1): $group" }
    if (-not $groupCounts.ContainsKey($group)) { $groupCounts[$group] = 0 }
    $groupCounts[$group]++

    $category = [string]$question.category
    if ($expectedCategories.Keys -notcontains $category) { Fail "Invalid category at question $($index + 1): $category" }
    if (-not $categoryCounts.ContainsKey($category)) { $categoryCounts[$category] = 0 }
    $categoryCounts[$category]++
    if (-not $category.StartsWith("$group/")) { Fail "Category/group mismatch at question $($index + 1)" }

    if ($group -ne 'cpp') {
        if ($properties -contains 'refs') {
            Fail "Non-C++ question $($index + 1) must not contain link refs"
        }
        if ([string]::IsNullOrWhiteSpace([string]$question.answer)) {
            Fail "Non-C++ question $($index + 1) must contain a concise answer"
        }
        if ([string]::IsNullOrWhiteSpace([string]$question.source)) {
            Fail "Non-C++ question $($index + 1) must name an authoritative source"
        }
    }

    if ($null -eq $question.scopes -or @($question.scopes).Count -lt 1) {
        Fail "Question $($index + 1) has no scopes"
    }
    if ($group -eq 'cpp') {
        if ($properties -contains 'answer' -or $properties -contains 'source') {
            Fail "Standard C++ question $($index + 1) must keep references instead of pasted answers"
        }
        if ($null -eq $question.refs -or @($question.refs).Count -lt 1) {
            Fail "C++ question $($index + 1) has no refs"
        }

        $hasCppRef = $false
        foreach ($reference in @($question.refs)) {
            if ($null -eq $reference) { Fail "Question $($index + 1) has a null ref" }
            $referenceProperties = @($reference.PSObject.Properties.Name)
            foreach ($property in $referenceProperties) {
                if (@('kind', 'label', 'url') -notcontains $property) {
                    Fail "Question $($index + 1) ref has unexpected field: $property"
                }
            }
            $urlText = [string]$reference.url
            if ([string]::IsNullOrWhiteSpace([string]$reference.label)) {
                Fail "Question $($index + 1) ref has an empty label"
            }
            $uri = $null
            if (-not [Uri]::TryCreate($urlText, [UriKind]::Absolute, [ref]$uri)) {
                Fail "Question $($index + 1) ref is not an absolute URL: $urlText"
            }
            if ($uri.Scheme -ne 'https') { Fail "Question $($index + 1) ref must use HTTPS: $urlText" }
            if ($allowedHosts -notcontains $uri.Host.ToLowerInvariant()) {
                Fail "Question $($index + 1) ref host is not allowed: $($uri.Host)"
            }
            if ($coarseCppUrls -contains $urlText) {
                Fail "C++ question $($index + 1) uses a section index instead of a topic page: $urlText"
            }
            if ($urlText.StartsWith('https://zh.cppreference.com/cpp', [StringComparison]::Ordinal)) {
                $hasCppRef = $true
            }
        }
        if (-not $hasCppRef) {
            Fail "C++ question $($index + 1) must include a cppreference /cpp URL"
        }
    }

    if ($group -eq 'gof') {
        $pattern = [string]$question.pattern
        if ([string]::IsNullOrWhiteSpace($pattern)) { Fail "GoF question $($index + 1) has no pattern" }
        if (-not $patternCounts.ContainsKey($pattern)) { $patternCounts[$pattern] = 0 }
        $patternCounts[$pattern]++
    }
}

foreach ($name in $expectedGroups.Keys) {
    $actual = if ($groupCounts.ContainsKey($name)) { $groupCounts[$name] } else { 0 }
    if ($actual -ne $expectedGroups[$name]) { Fail "Group $name should be $($expectedGroups[$name]), got $actual" }
}
foreach ($name in $expectedCategories.Keys) {
    $actual = if ($categoryCounts.ContainsKey($name)) { $categoryCounts[$name] } else { 0 }
    if ($actual -ne $expectedCategories[$name]) { Fail "Category $name should be $($expectedCategories[$name]), got $actual" }
}

$requiredPatterns = @(
    'Abstract Factory', 'Builder', 'Factory Method', 'Prototype', 'Singleton',
    'Adapter', 'Bridge', 'Composite', 'Decorator', 'Facade', 'Flyweight', 'Proxy',
    'Chain of Responsibility', 'Command', 'Interpreter', 'Iterator', 'Mediator',
    'Memento', 'Observer', 'State', 'Strategy', 'Template Method', 'Visitor'
)
foreach ($pattern in $requiredPatterns) {
    $actual = if ($patternCounts.ContainsKey($pattern)) { $patternCounts[$pattern] } else { 0 }
    if ($actual -lt 3) { Fail "GoF pattern '$pattern' needs at least 3 questions, got $actual" }
}

Write-Output "PASS: $($questions.Count) questions"
Write-Output ("GROUPS: " + (($expectedGroups.Keys | ForEach-Object { "$_=$($groupCounts[$_])" }) -join ', '))
Write-Output ("CATEGORIES: " + (($expectedCategories.Keys | ForEach-Object { "$_=$($categoryCounts[$_])" }) -join ', '))
Write-Output ("GOF_PATTERNS: " + (($requiredPatterns | ForEach-Object { "$_=$($patternCounts[$_])" }) -join ', '))
exit 0
