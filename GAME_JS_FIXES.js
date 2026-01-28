/**
 * game.js 修正ガイド
 * 
 * 以下の変更を game.js に適用してください。
 * バックアップは game.js.backup に作成済みです。
 */

// ============================================================================
// 修正1: コンストラクタ（203-207行目を以下に置き換え）
// ============================================================================

// 【現在のコード（203-207行目）】
//         this.lastTime = 0;
//         
//         this.initializeNextQueue();
//         this.setupEventListeners();
//     }

// 【置き換え後のコード】
this.lastTime = 0;

// T-spin追跡
this.lastMoveWasRotation = false;

// キーバインド管理
this.keyBindings = new KeyBindings();

this.initializeNextQueue();
this.setupEventListeners();
this.setupSettingsUI();
    }


// ============================================================================
// 修正2: rotate関数（312-333行目を以下に置き換え）
// ============================================================================

// 【現在のコード（312-333行目）】
//     rotate(direction = 1) {
//         const newRotation = (this.currentRotation + direction + 4) % 4;
//         
//         if (!this.checkCollision(this.currentX, this.currentY, newRotation)) {
//             this.currentRotation = newRotation;
//             return;
//         }
//         
//         // ウォールキック
//         const kicks = [
//             [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]
//         ];
//         
//         for (const [dx, dy] of kicks) {
//             if (!this.checkCollision(this.currentX + dx, this.currentY + dy, newRotation)) {
//                 this.currentX += dx;
//                 this.currentY += dy;
//                 this.currentRotation = newRotation;
//                 return;
//             }
//         }
//     }

// 【置き換え後のコード】
rotate(direction = 1) {
    const newRotation = (this.currentRotation + direction + 4) % 4;

    if (!this.checkCollision(this.currentX, this.currentY, newRotation)) {
        this.currentRotation = newRotation;
        this.lastMoveWasRotation = true;  // この行を追加
        return;
    }

    // ウォールキック
    const kicks = [
        [1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1]
    ];

    for (const [dx, dy] of kicks) {
        if (!this.checkCollision(this.currentX + dx, this.currentY + dy, newRotation)) {
            this.currentX += dx;
            this.currentY += dy;
            this.currentRotation = newRotation;
            this.lastMoveWasRotation = true;  // この行を追加
            return;
        }
    }
}


// ============================================================================
// 修正3: clearLines関数（388-421行目を以下に置き換え）
// ============================================================================

// 【置き換え後のコード】
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


// ============================================================================
// 修正4: setupEventListeners関数（654-728行目を以下に置き換え）
// ============================================================================

// 【置き換え後のコード】
setupEventListeners() {
    // キーボ�入力（キーバインド対応）
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

            switch (action) {
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

    //  ボタンイベント
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

// ============================================================================
// 修正完了後の確認
// ============================================================================
/*
1. ブラウザでindex.htmlを開く
2. コンソール（F12）でエラーがないか確認
3. ゲームを開始して動作確認
4. ⚙️設定ボタンをクリックして設定モーダルが開くか確認
5. キーバインドを変更して保存
6. カスタムキーでゲームをプレイして動作確認
7. T字ミノで回転させてT-spin通知が表示されるか確認
*/
