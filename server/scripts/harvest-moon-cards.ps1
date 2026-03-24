$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.IO.Compression.FileSystem

$base = 'E:\Lex Universalis'
$moonRoot = Join-Path $base 'docs\game-design\moon'
$cardsRoot = Join-Path $moonRoot 'cards'
$rulesDoc = Join-Path $moonRoot 'rules\临时约法2.0.docx'
$rulesMd = Join-Path $moonRoot 'rules\临时约法2.0.md'
$settingDoc = Join-Path $moonRoot 'lore\setting\校准钟表.docx'
$settingMd = Join-Path $moonRoot 'lore\setting\校准钟表.md'
$generatedTs = Join-Path $base 'server\src\data\moon-cards.generated.ts'

function Get-DocParagraphs {
  param([string]$Path)

  $zip = [System.IO.Compression.ZipFile]::OpenRead($Path)
  try {
    $entry = $zip.GetEntry('word/document.xml')
    if (-not $entry) { return @() }

    $sr = New-Object System.IO.StreamReader($entry.Open())
    try {
      $xml = $sr.ReadToEnd()
    } finally {
      $sr.Dispose()
    }

    $doc = New-Object System.Xml.XmlDocument
    $doc.LoadXml($xml)
    $ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
    $ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')

    $lines = New-Object System.Collections.Generic.List[string]
    foreach ($para in $doc.SelectNodes('//w:p', $ns)) {
      $parts = @($para.SelectNodes('.//w:t', $ns) | ForEach-Object { $_.'#text' })
      $line = ($parts -join '').Replace([char]0xA0, ' ').Trim()
      $line = ($line -replace '\s+', ' ').Trim()
      if ($line) { $lines.Add($line) }
    }

    return $lines.ToArray()
  } finally {
    $zip.Dispose()
  }
}

function Normalize-Name {
  param([string]$Name)

  $name = ($Name -replace '\s+', ' ').Trim()
  $name = $name -replace '\s*x\d+\s*$', ''
  $name = $name -replace '\s*\*\d+\s*$', ''
  $name = $name -replace '\s*【(短|中|长|反制|增益|减益)】\s*$', ''
  return $name.Trim()
}

function Extract-Count {
  param([string]$Text)
  if ($Text -match 'x(\d+)') { return [int]$Matches[1] }
  if ($Text -match '\*(\d+)') { return [int]$Matches[1] }
  return $null
}

function Cost-FromTag {
  param([string]$Text)
  if ($Text -match '【短】') { return 1 }
  if ($Text -match '【中】') { return 2 }
  if ($Text -match '【长】') { return 3 }
  if ($Text -match '【反制】') { return 1 }
  $count = Extract-Count $Text
  if ($null -ne $count) { return $count }
  return 1
}

function Rarity-FromTag {
  param([string]$Text, [string]$Name)
  if ($Text -match '【长】') { return 'EPIC' }
  if ($Text -match '【中】') { return 'RARE' }
  if ($Text -match '【反制】') { return 'RARE' }
  if ($Text -match '【短】') { return 'COMMON' }
  if ($Name -match '国王|王冠|绝望|天基工程|光明王') { return 'LEGENDARY' }
  return 'COMMON'
}

function Faction-FromElement {
  param([string]$Element)
  switch ($Element) {
    '火' { 'BYZANTIUM' }
    '林' { 'VIKING' }
    '山' { 'HRE' }
    '风' { 'FRANCE' }
    default { 'BYZANTIUM' }
  }
}

function Is-TitleLine {
  param([string]$Line)
  $s = $Line.Trim()
  if (-not $s) { return $false }
  if ($s.Length -gt 40) { return $false }
  if ($s -match '^\d+血\d+蓝') { return $false }
  if ($s -match '^[“"（(\[]') { return $false }
  if ($s -match '背景故事') { return $false }
  return $true
}

function Compact-Text {
  param([string[]]$Lines)
  $clean = @($Lines | Where-Object { $_ -and $_.Trim() } | ForEach-Object { $_.Trim() })
  if ($clean.Count -eq 0) { return $null }
  return ($clean -join ' ')
}

function Compact-Newlines {
  param([string[]]$Lines)
  $clean = @($Lines | Where-Object { $_ -and $_.Trim() } | ForEach-Object { $_.Trim() })
  if ($clean.Count -eq 0) { return $null }
  return ($clean -join "`n")
}

function Parse-CharacterDoc {
  param([string]$Path)

  $paras = Get-DocParagraphs $Path
  if ($paras.Count -lt 2) { return $null }

  $name = Normalize-Name $paras[0]
  $stats = $paras[1]
  $element = '火'
  $blood = 1
  $blue = 1

  if ($stats -match '^(火|林|山|风)\s*(\d+)血(\d+)蓝') {
    $element = $Matches[1]
    $blood = [int]$Matches[2]
    $blue = [int]$Matches[3]
  } elseif ($stats -match '^(\d+)血(\d+)蓝\s*(火|林|山|风)?') {
    $blood = [int]$Matches[1]
    $blue = [int]$Matches[2]
    if ($Matches[3]) { $element = $Matches[3] }
  }

  $abilityLines = New-Object System.Collections.Generic.List[string]
  $storyLines = New-Object System.Collections.Generic.List[string]
  $inStory = $false
  for ($i = 2; $i -lt $paras.Count; $i++) {
    $line = $paras[$i].Trim()
    if (-not $line) { continue }
    if ($line -eq '背景故事：') { $inStory = $true; continue }
    if ($inStory) { $storyLines.Add($line) } else { $abilityLines.Add($line) }
  }

  $abilityText = Compact-Newlines $abilityLines.ToArray()
  $storyText = Compact-Text $storyLines.ToArray()
  if (-not $abilityText) { $abilityText = $name }

  $card = [ordered]@{
    name = $name
    cost = $blue
    faction = (Faction-FromElement $element)
    type = 'UNIT'
    rarity = (Rarity-FromTag -Text $abilityText -Name $name)
    description = if ($abilityLines.Count -gt 0) { $abilityLines[0] } else { $name }
    flavorText = $storyText
    attack = [Math]::Max(1, [int][Math]::Round($blue / 2.0))
    health = $blood
    movement = 1
    durability = $null
    ability = $abilityText
    sourceCategory = 'character'
    sourceFile = (Split-Path $Path -Leaf)
  }

  return $card
}

function Parse-MultiCardDoc {
  param(
    [string]$Path,
    [string]$Faction,
    [string]$SourceCategory,
    [string]$DefaultType = 'TACTIC'
  )

  $paras = Get-DocParagraphs $Path
  $cards = New-Object System.Collections.Generic.List[object]

  if ($SourceCategory -eq 'support') {
    foreach ($line in $paras) {
      $text = $line.Trim()
      if (-not $text) { continue }
      $name = Normalize-Name $text
      $cards.Add([ordered]@{
        name = $name
        cost = Cost-FromTag $text
        faction = $Faction
        type = 'TACTIC'
        rarity = (Rarity-FromTag -Text $text -Name $name)
        description = '辅助标记'
        flavorText = $text
        attack = $null
        health = $null
        movement = $null
        durability = $null
        ability = $text
        sourceCategory = $SourceCategory
        sourceFile = (Split-Path $Path -Leaf)
      })
    }
    return $cards
  }

  $current = $null
  $body = New-Object System.Collections.Generic.List[string]
  $quotes = New-Object System.Collections.Generic.List[string]
  $sawBody = $false

  function Flush-Current {
    if (-not $current) { return }

    $bodyText = Compact-Text $body.ToArray()
    $quoteText = Compact-Text $quotes.ToArray()
    $rawText = Compact-Text (@($body.ToArray()) + @($quotes.ToArray()))

    $title = $current.title
    $name = $current.name
    $type = $current.type
    $rarity = Rarity-FromTag -Text $title -Name $name
    $cost = Cost-FromTag $title

    if ($title -match '塔|城墙|兵营|市场|工程|沙漏|冠冕|钟表|钟楼') {
      $type = 'BUILDING'
    }

    $cards.Add([ordered]@{
      name = $name
      cost = $cost
      faction = $current.faction
      type = $type
      rarity = $rarity
      description = if ($body.Count -gt 0) { $body[0] } else { $name }
      flavorText = $quoteText
      attack = $null
      health = $null
      movement = $null
      durability = if ($type -eq 'BUILDING') { 3 } else { $null }
      ability = $rawText
      sourceCategory = $SourceCategory
      sourceFile = (Split-Path $Path -Leaf)
    })

    $body.Clear()
    $quotes.Clear()
    $script:current = $null
    $script:sawBody = $false
  }

  foreach ($line in $paras) {
    $text = $line.Trim()
    if (-not $text) { continue }

    if (-not $current) {
      $current = [ordered]@{
        title = $text
        name = (Normalize-Name $text)
        faction = $Faction
        type = $DefaultType
      }
      continue
    }

    if ($text -eq '背景故事：' -or $text -eq '背景故事') {
      $sawBody = $true
      continue
    }

    if (-not $sawBody -and (Is-TitleLine $text) -and $body.Count -gt 0) {
      Flush-Current
      $current = [ordered]@{
        title = $text
        name = (Normalize-Name $text)
        faction = $Faction
        type = $DefaultType
      }
      continue
    }

    if (-not $sawBody -and ($text.StartsWith('“') -or $text.StartsWith('"') -or $text.StartsWith('(') -or $text.StartsWith('[') -or $text.StartsWith('【'))) {
      $sawBody = $true
    }

    if ($sawBody) { $quotes.Add($text) } else { $body.Add($text) }
  }

  Flush-Current
  return $cards
}

$allCards = New-Object System.Collections.Generic.List[object]

Get-ChildItem -Path (Join-Path $cardsRoot 'characters') -Filter *.docx -File | Sort-Object Name | ForEach-Object {
  $file = $_
  try {
    $card = Parse-CharacterDoc $file.FullName
    if ($card) {
      $allCards.Add($card)
    } else {
      $allCards.Add([ordered]@{
        name = (Normalize-Name $file.BaseName)
        cost = 1
        faction = 'BYZANTIUM'
        type = 'UNIT'
        rarity = 'COMMON'
        description = '原始文档损坏，待后续补全。'
        flavorText = $null
        attack = 1
        health = 1
        movement = 1
        durability = $null
        ability = '原始文档损坏，待后续补全。'
        sourceCategory = 'character'
        sourceFile = $file.Name
      })
    }
  } catch {
    $allCards.Add([ordered]@{
      name = (Normalize-Name $file.BaseName)
      cost = 1
      faction = 'BYZANTIUM'
      type = 'UNIT'
      rarity = 'COMMON'
      description = '原始文档损坏，待后续补全。'
      flavorText = $null
      attack = 1
      health = 1
        movement = 1
        durability = $null
        ability = '原始文档损坏，待后续补全。'
        sourceCategory = 'character'
      sourceFile = $file.Name
    })
  }
}

$folderConfigs = @(
  @{ Name = 'common'; Faction = 'BYZANTIUM'; Category = 'common'; Type = 'TACTIC' },
  @{ Name = 'spells'; Faction = $null; Category = 'spell'; Type = 'TACTIC' },
  @{ Name = 'support'; Faction = 'ENGLAND'; Category = 'support'; Type = 'TACTIC' }
)

foreach ($config in $folderConfigs) {
  $folder = Join-Path $cardsRoot $config.Name
  Get-ChildItem -Path $folder -Filter *.docx -File | Sort-Object Name | ForEach-Object {
    $faction = $config.Faction
    if ($config.Name -eq 'spells') {
      if ($_.Name -match '山') { $faction = 'HRE' }
      elseif ($_.Name -match '林') { $faction = 'VIKING' }
      elseif ($_.Name -match '火') { $faction = 'BYZANTIUM' }
      elseif ($_.Name -match '风') { $faction = 'FRANCE' }
      else { $faction = 'BYZANTIUM' }
    }

    $cards = Parse-MultiCardDoc -Path $_.FullName -Faction $faction -SourceCategory $config.Category -DefaultType $config.Type
    foreach ($card in $cards) { $allCards.Add($card) }
  }
}

$seen = New-Object 'System.Collections.Generic.HashSet[string]'
$deduped = New-Object System.Collections.Generic.List[object]
foreach ($card in $allCards) {
  $key = ('{0}|{1}|{2}' -f $card.name, $card.type, $card.faction).ToLowerInvariant()
  if ($seen.Add($key)) {
    $deduped.Add($card)
  }
}

$payload = $deduped | ConvertTo-Json -Depth 10
$ts = @"
import type {
  AnyCard,
} from '../types/game';

export const MOON_CARDS: AnyCard[] = $payload as unknown as AnyCard[];
"@

Set-Content -Path $generatedTs -Value $ts -Encoding utf8

if (Test-Path $rulesDoc) {
  $rulesText = (Get-DocParagraphs $rulesDoc) -join "`n`n"
  Set-Content -Path $rulesMd -Value ("# 临时约法2.0`n`n" + $rulesText + "`n") -Encoding utf8
}

if (Test-Path $settingDoc) {
  $settingText = (Get-DocParagraphs $settingDoc) -join "`n`n"
  Set-Content -Path $settingMd -Value ("# 校准钟表`n`n" + $settingText + "`n") -Encoding utf8
}

Write-Host ("Generated {0} moon cards" -f $deduped.Count)
Write-Host ("Generated {0}" -f $generatedTs)
