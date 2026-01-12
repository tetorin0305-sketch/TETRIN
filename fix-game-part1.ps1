# PowerShellスクリプトでgame.jsを修正

$gamePath = "c:\Users\airin\Desktop\antigravity\テトリス\game.js"
$content = Get-Content $gamePath -Raw

# 修正1: コンストラクタにlastMoveWasRotationとkeyBindingsを追加
$content = $content -replace `
    "(\s+this\.initializeNextQueue\(\);[\r\n]+\s+this\.setupEventListeners\(\);[\r\n]+\s+\})", `
    "`$1`n`n        // T-spin追跡`n        this.lastMoveWasRotation = false;`n`n        // キーバインド管理`n        this.keyBindings = new KeyBindings();`n`n        this.setupSettingsUI();`n    }"

# 修正2a: rotate関数の1箇所目にlastMoveWasRotationを追加
$content = $content -replace `
    "(if \(!this\.checkCollision\(this\.currentX, this\.currentY, newRotation\)\) \{[\r\n]+\s+this\.currentRotation = newRotation;)([\r\n]+\s+return;[\r\n]+\s+\})", `
    "`$1`n            this.lastMoveWasRotation = true;`$2"

# 修正2b: rotate関数の2箇所目にlastMoveWasRotationを追加 
$content = $content -replace `
    "(if \(!this\.checkCollision\(this\.currentX \+ dx, this\.currentY \+ dy, newRotation\)\) \{[\r\n]+\s+this\.currentX \+= dx;[\r\n]+\s+this\.currentY \+= dy;[\r\n]+\s+this\.currentRotation = newRotation;)([\r\n]+\s+return;)", `
    "`$1`n                this.lastMoveWasRotation = true;`$2"

# ファイルを保存
$content | Set-Content $gamePath -NoNewline
Write-Host "game.jsを修正しました"
