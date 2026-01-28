/* ============================================================================
   テトリスゲーム - キーバインド修正パッチ
   
   このファイルには、game.jsに適用すべき3つの重要な修正が含まれています。
   ============================================================================ */

// ========================================
// 修正1: コンストラクタ（206行目付近）
// ========================================
// 現在のコード:
//     this.initializeNextQueue();
//     this.setupEventListeners();
// }
//
// 以下に置き換え:
        this.initializeNextQueue();
        
        // T-spin追跡
        this.lastMoveWasRotation = false;
        
        // キーバインド管理
        this.keyBindings = new KeyBindings();
        
        this.setupEventListeners();
        this.setupSettingsUI();
    }


// ========================================
// 修正2: rotate関数（312-333行目付近）
// ========================================
// rotate関数内の2箇所に `this.lastMoveWasRotation = true;` を追加

// 1箇所目: 通常の回転成功時（316行目付近）
        if (!this.checkCollision(this.currentX, this.currentY, newRotation)) {
            this.currentRotation = newRotation;
            this.lastMoveWasRotation = true;  // この行を追加
            return;
        }

// 2箇所目: ウォールキック成功時（329行目付近）
            if (!this.checkCollision(this.currentX + dx, this.currentY + dy, newRotation)) {
                this.currentX += dx;
                this.currentY += dy;
                this.currentRotation = newRotation;
                this.lastMoveWasRotation = true;  // この行を追加
                return;
            }


// ========================================
// 修正3: setupEventListeners関数（654-708行目付近）
// ========================================
// 現在のswitch文ベースのコードを以下のキーバインド対応コードに置き換え:

    setupEventListeners() {
        // キーボード入力（キーバインド対応）
        document.addEventListener('keydown', (e) => {
            // ポーズ中でもポーズキーは受け付ける
            if (this.isRunning && this.isPaused && e.code === this.keyBindings.getBinding('pause')) {
                e.preventDefault();
                this.pause();
                return;
            }
            
            if (!this.isRunning || this.gameOver || this.isPaused) return;
            
            const action = this.keyBindings.getAction(e.code);
            
            if (action) {
                e.preventDefault();
                
                switch(action) {
                    case 'moveLeft':
                        this.moveLeft();
                        break;
                    case 'moveRight':
                        this.moveRight();
                        break;
                    case 'softDrop':
                        this.moveDown();
                        this.dropCounter = 0;
                        break;
                    case 'hardDrop':
                        this.hardDrop();
                        this.dropCounter = 0;
                        break;
                    case 'rotateRight':
                        this.rotate(1);
                        break;
                    case 'rotateLeft':
                        this.rotate(-1);
                        break;
                    case 'hold':
                        this.hold();
                        break;
                    case 'pause':
                        this.pause();
                        break;
                }
                
                this.draw();
            }
        });

        // 以下のボタンイベントはそのまま維持
        document.getElementById('start-btn').addEventListener('click', () => {
            this.start();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.start();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            if (this.isRunning && !this.gameOver) {
                this.pause();
            }
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });
    }


// ========================================
// 修正4: clearLines関数にT-spin検出を統合（オプション、393-421行目付近）
// ========================================
// T-spinボーナススコアを有効にするには、clearLines関数を以下に置き換え:

    clearLines() {
        let linesCleared = 0;
        
       // T-spin検出（ライン削除前）
        const tSpinType = this.currentPiece ? this.checkTSpin(0) : null;
        
        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                this.board.splice(row, 1);
                this.board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                row++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            
            // T-spinボーナススコア
            const actualTSpin = tSpinType ? this.checkTSpin(linesCleared) : null;
            
            if (actualTSpin) {
                // T-spinボーナス
                const tSpinScores = {
                    'T-SPIN-MINI': linesCleared === 0 ? 100 : 200,
                    'T-SPIN-SINGLE': 800,
                    'T-SPIN-DOUBLE': 1200,
                    'T-SPIN-TRIPLE': 1600
                };
                this.score += (tSpinScores[actualTSpin] || 0) * this.level;
                this.showTSpinNotification(actualTSpin);
            } else {
                // 通常スコア
                const lineScores = [0, 100, 300, 500, 800];
                this.score += lineScores[linesCleared] * this.level;
            }
            
            // レベルアップ (10ラインごと)
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.dropInterval = Math.max(100, INITIAL_SPEED - (this.level - 1) * SPEED_DECREASE);
            }
            
            this.updateScore();
        }
    }
