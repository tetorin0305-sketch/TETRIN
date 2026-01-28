# キーバインド設定修正ガイド

## 問題の概要

キーバインド設定機能が正しく動作していません。以下の4つの修正が必要です：

1. **コンストラクタ**: `lastMoveWasRotation`と`keyBindings`の初期化が欠けている
2. **rotate関数**: T-spin検出用のフラグ設定が欠けている  
3. **setupEventListeners関数**: カスタムキーバインドを使用していない
4. **clearLines関数**: T-spinボーナススコアが実装されていない

## 修正手順

### 方法1: 手動でファイルを編集

1. `game.js`をテキストエディタで開きます
2. `game-patch.js`を参照して、以下の4箇所を修正します:

#### 修正箇所1: コンストラクタ（約206行目）

**変更前:**
```javascript
        this.initializeNextQueue();
        this.setupEventListeners();
    }
```

**変更後:**
```javascript
        this.initializeNextQueue();
        
        // T-spin追跡
        this.lastMoveWasRotation = false;
        
        // キーバインド管理
        this.keyBindings = new KeyBindings();
        
        this.setupEventListeners();
        this.setupSettingsUI();
    }
```

#### 修正箇所2a: rotate関数の1箇所目（約316行目）

**変更前:**
```javascript
        if (!this.checkCollision(this.currentX, this.currentY, newRotation)) {
            this.currentRotation = newRotation;
            return;
        }
```

**変更後:**
```javascript
        if (!this.checkCollision(this.currentX, this.currentY, newRotation)) {
            this.currentRotation = newRotation;
            this.lastMoveWasRotation = true;
            return;
        }
```

#### 修正箇所2b: rotate関数の2箇所目（約329行目）

**変更前:**
```javascript
            if (!this.check Collision(this.currentX + dx, this.currentY + dy, newRotation)) {
                this.currentX += dx;
                this.currentY += dy;
                this.currentRotation = newRotation;
                return;
            }
```

**変更後:**
```javascript
            if (!this.checkCollision(this.currentX + dx, this.currentY + dy, newRotation)) {
                this.currentX += dx;
                this.currentY += dy;
                this.currentRotation = newRotation;
                this.lastMoveWasRotation = true;
                return;
            }
```

#### 修正箇所3: setupEventListeners関数（約654-708行目）

現在のswitch文ベースのイベントリスナーを、`game-patch.js`の**修正3**セクションのコードに完全に置き換えます。

#### 修正箇所4: clearLines関数（約393-421行目）-  オプション

T-spinボーナススコアを有効にするには、`game-patch.js`の**修正4**セクションのコードで置き換えます。

### 方法2: 新しいgame.jsに置き換え（推奨）

すべての修正を適用した完全なgame.jsファイルを作成することもできます。これが必要な場合はお知らせください。

## 修正後の確認

修正後、以下を確認してください：

1. ブラウザで`index.html`を開く  
2. **⚙️ 設定**ボタンをクリック
3. キーバインド設定モーダルが開く
4. **変更**ボタンをクリックして新しいキーを割り当て
5. **保存**をクリック
6. ゲームを開始して、カスタムキーが動作することを確認

## トラブルシューティング

もし問題が続く場合は：
- ブラウザのコンソール（F12）でエラーメッセージを確認
- ページを完全にリロード（Ctrl+F5）
- LocalStorageをクリアして再試行

---

詳細な修正コードは`game-patch.js`を参照してください。
