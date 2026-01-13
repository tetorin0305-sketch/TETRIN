// ========================================
// テトロミノの定義
// ========================================
const TETROMINOS = {
    I: {
        shape: [
            [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
            [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]]
        ],
        color: '#00f0ff'
    },
    O: {
        shape: [
            [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        ],
        color: '#ffeb3b'
    },
    T: {
        shape: [
            [[0, 1, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
        ],
        color: '#b300ff'
    },
    S: {
        shape: [
            [[0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [0, 1, 1, 0], [1, 1, 0, 0], [0, 0, 0, 0]],
            [[1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
        ],
        color: '#00ff41'
    },
    Z: {
        shape: [
            [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 1, 0], [0, 1, 1, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0]]
        ],
        color: '#ff3d00'
    },
    J: {
        shape: [
            [[1, 0, 0, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 1, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [1, 1, 1, 0], [0, 0, 1, 0], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [0, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 0]]
        ],
        color: '#2962ff'
    },
    L: {
        shape: [
            [[0, 0, 1, 0], [1, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 1, 0], [0, 0, 0, 0]],
            [[0, 0, 0, 0], [1, 1, 1, 0], [1, 0, 0, 0], [0, 0, 0, 0]],
            [[1, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 0, 0, 0]]
        ],
        color: '#ff6d00'
    }
};

const TETROMINO_TYPES = Object.keys(TETROMINOS);

// ========================================
// ゲーム定数
// ========================================
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 40; // 20 -> 40 (上部20段はバッファゾーン)
const VISIBLE_HEIGHT = 20; // 画面に見える高さ
const BLOCK_SIZE = 30;
const INITIAL_SPEED = 1000; // 1秒
const SPEED_DECREASE_RATE = 0.7; // レベルアップごとの速度倍率 (指数関数的減衰)
const LOCK_DELAY_TIME = 500; // 接地猶予時間 (ms)
const MAX_LOCK_RESET = 15; // 設置回避を防止するための通算リセット制限回数 (ピース1個あたり)
const DAS_DELAY = 300;     // 長押しと認識するまでの時間 (ms)
const ARR_INTERVAL = 20;   // 連続移動の間隔 (ms)
const SOFT_DROP_INTERVAL = 20; // ソフトドロップ時の間隔 (ms)
const DISPLAY_OFFSET = 6; // 0.2段分 (30 * 0.2) のチラ見せオフセット

// ========================================
// SRS (Super Rotation System) キックデータ
// ========================================
// J, L, S, Z, T ミノ用
const SRS_KICKS = {
    '0-1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '1-0': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '1-2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '2-1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '2-3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    '3-2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '3-0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '0-3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
};

// I ミノ用
const I_KICKS = {
    '0-1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '1-0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '1-2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    '2-1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '2-3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '3-2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '3-0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '0-3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
};

// ========================================
// キーバインド管理
// ========================================
class KeyBindings {
    constructor() {
        this.defaultBindings = {
            moveLeft: 'ArrowLeft',
            moveRight: 'ArrowRight',
            softDrop: 'ArrowDown',
            hardDrop: 'Space',
            rotateRight: 'ArrowUp',
            rotateLeft: 'KeyZ',
            hold: 'KeyC',
            hold2: 'ShiftLeft',
            pause: 'KeyP',
            reset: 'KeyR'
        };
        this.defaultGamepadBindings = {
            moveLeft: 14,    // D-Pad Left
            moveRight: 15,   // D-Pad Right
            softDrop: 13,    // D-Pad Down (画像準拠)
            hardDrop: 12,    // D-Pad Up (画像準拠)
            rotateRight: 1,  // B Button (画像準拠)
            rotateLeft: 0,   // A Button (画像準拠)
            hold: 4,         // L1 Button (画像準拠)
            hold2: 5,        // R1 Button (画像準拠)
            pause: 7,        // R2 Button (画像準拠)
            reset: 9         // START (画像準拠)
        };
        this.loadBindings();
    }

    loadBindings() {
        try {
            const savedKeys = localStorage.getItem('tetrisKeyBindings');
            this.bindings = savedKeys ? { ...this.defaultBindings, ...JSON.parse(savedKeys) } : { ...this.defaultBindings };

            const savedGp = localStorage.getItem('tetrisGamepadBindings');
            this.gamepadBindings = savedGp ? { ...this.defaultGamepadBindings, ...JSON.parse(savedGp) } : { ...this.defaultGamepadBindings };
        } catch (e) {
            this.bindings = { ...this.defaultBindings };
            this.gamepadBindings = { ...this.defaultGamepadBindings };
        }
    }

    saveBindings() {
        try {
            localStorage.setItem('tetrisKeyBindings', JSON.stringify(this.bindings));
            localStorage.setItem('tetrisGamepadBindings', JSON.stringify(this.gamepadBindings));
        } catch (e) {
            console.error('Failed to save bindings:', e);
        }
    }

    resetToDefaults() {
        this.bindings = { ...this.defaultBindings };
        this.gamepadBindings = { ...this.defaultGamepadBindings };
        this.saveBindings();
    }

    setBinding(action, key) {
        this.bindings[action] = key;
    }

    getBinding(action) {
        return this.bindings[action];
    }

    setGamepadBinding(action, buttonIndex) {
        this.gamepadBindings[action] = buttonIndex;
    }

    getGamepadBinding(action) {
        return this.gamepadBindings[action];
    }

    getAction(key) {
        for (const [action, binding] of Object.entries(this.bindings)) {
            if (binding === key) {
                return action;
            }
        }
        return null;
    }

    getGamepadAction(buttonIndex) {
        for (const [action, binding] of Object.entries(this.gamepadBindings)) {
            if (binding === buttonIndex) {
                return action;
            }
        }
        return null;
    }

    isDuplicate(key, excludeAction = null) {
        for (const [action, binding] of Object.entries(this.bindings)) {
            if (action !== excludeAction && binding === key) {
                return action;
            }
        }
        return null;
    }

    isGamepadDuplicate(buttonIndex, excludeAction = null) {
        for (const [action, binding] of Object.entries(this.gamepadBindings)) {
            if (action !== excludeAction && binding === buttonIndex) {
                return action;
            }
        }
        return null;
    }

    getKeyDisplay(code) {
        if (!code) return 'NONE';
        const keyMap = {
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'Space': 'SPACE',
        };

        if (keyMap[code]) return keyMap[code];
        if (code.startsWith('Key')) return code.substring(3);
        if (code.startsWith('Digit')) return code.substring(5);
        return code;
    }

    getGamepadButtonDisplay(buttonIndex) {
        if (buttonIndex === null || buttonIndex === undefined) return 'NONE';
        const buttonMap = {
            0: 'A (0)',
            1: 'B (1)',
            2: 'X (2)',
            3: 'Y (3)',
            4: 'L1 (4)',
            5: 'R1 (5)',
            6: 'L2 (6)',
            7: 'R2 (7)',
            8: 'SELECT (8)',
            9: 'START (9)',
            10: 'L3 (10)',
            11: 'R3 (11)',
            12: '↑ (12)',
            13: '↓ (13)',
            14: '← (14)',
            15: '→ (15)'
        };
        return buttonMap[buttonIndex] || `BTN ${buttonIndex}`;
    }
}

// ========================================
// ゲーム設定管理 (DAS / ARR)
// ========================================
class GameSettings {
    constructor() {
        this.defaults = {
            dasDelay: 200,
            arrInterval: 20,
            bgType: 'preset',
            bgValue: 'default'
        };
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('tetrisGameSettings');
            this.settings = saved ? JSON.parse(saved) : { ...this.defaults };
        } catch (e) {
            this.settings = { ...this.defaults };
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('tetrisGameSettings', JSON.stringify(this.settings));
        } catch (e) {
            console.error('Failed to save game settings:', e);
        }
    }

    resetToDefaults() {
        this.settings = { ...this.defaults };
        this.saveSettings();
    }

    set(key, value) {
        this.settings[key] = value;
    }

    get(key) {
        return this.settings[key];
    }
}

// ========================================
// ゲーム状態
// ========================================
class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.holdCanvas = document.getElementById('hold-canvas');
        this.holdCtx = this.holdCanvas.getContext('2d');
        this.nextCanvases = [];
        this.nextCtxs = [];

        for (let i = 0; i < 5; i++) {
            const canvas = document.getElementById(`next-canvas-${i}`);
            this.nextCanvases.push(canvas);
            this.nextCtxs.push(canvas.getContext('2d'));
        }

        this.board = this.createBoard();
        this.currentPiece = null;
        this.currentX = 0;
        this.currentY = 0;
        this.currentRotation = 0;

        this.holdPiece = null;
        this.canHold = true;

        this.nextQueue = [];
        this.bag = [];

        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.renCount = 0;
        this.maxRen = 0;
        this.totalAttacks = 0;
        this.totalReceivedAttacks = 0;
        this.isBackToBack = false;

        this.gameOver = false;
        this.isPaused = false;
        this.isRunning = false;
        this.gameMode = 'marathon';

        this.bestScore = 0;
        this.bestTime = Infinity;
        this.bestRen = 0;
        this.bestSurvival = 0; // マラソンと同様に生存時間を管理
        this.bestSurvivalSerial = 0;
        this.survivalType = 'normal'; // 'normal' or 'serial'

        this.loadHighScores();
        this.dropInterval = INITIAL_SPEED;
        this.lastTime = 0;
        this.lockDelayCounter = 0;
        this.lockResetCount = 0;

        // T-spin追跡
        this.lastMoveWasRotation = false;

        // キーバインド管理
        this.keyBindings = new KeyBindings();

        // ゲーム設定管理
        this.settings = new GameSettings();

        // パーティクル管理
        this.particles = [];
        this.tspinTimeout = null;
        this.renTimeout = null;
        this.garbageTimer = 0;
        this.garbageInterval = 10000;
        this.isGarbageWarning = false;

        // 入力管理 (DAS/ARR)
        this.keysState = {};
        this.dasTimer = 0;
        this.arrTimer = 0;
        this.softDropTimer = 0;
        this.lastAction = null;
        this.lastGamepadButtons = {}; // 前フレームのボタン状態（エッジ検出用）

        this.initializeNextQueue();
        this.setupEventListeners();
        this.setupSettingsUI();
        this.applyBackground(); // 背景の初期適用
    }

    loadHighScores() {
        try {
            const saved = localStorage.getItem('tetrisHighScores');
            if (saved) {
                const highScores = JSON.parse(saved);
                this.bestScore = highScores.marathon || 0;
                this.bestTime = highScores.sprint || Infinity;
                this.bestRen = highScores.ren4 || 0;
                this.bestSurvival = highScores.survival || 0;
                this.bestSurvivalSerial = highScores.survivalSerial || 0;
            }
        } catch (e) {
            console.error('Failed to load high scores:', e);
        }
    }

    saveHighScores() {
        try {
            const highScores = {
                marathon: this.bestScore,
                sprint: this.bestTime,
                ren4: this.bestRen,
                survival: this.bestSurvival,
                survivalSerial: this.bestSurvivalSerial
            };
            localStorage.setItem('tetrisHighScores', JSON.stringify(highScores));
        } catch (e) {
            console.error('Failed to save high scores:', e);
        }
    }

    updateBestDisplay() {
        const label = document.getElementById('best-label');
        const value = document.getElementById('best-value');
        if (!label || !value) return;

        switch (this.gameMode) {
            case 'marathon':
                label.textContent = 'BEST SCORE';
                value.textContent = this.bestScore.toLocaleString();
                break;
            case '40lines':
                label.textContent = 'BEST TIME';
                value.textContent = (this.bestTime === Infinity) ? '--:--.--' : this.formatTimeShort(this.bestTime);
                break;
            case 'ren4':
                label.textContent = 'BEST REN';
                value.textContent = this.bestRen.toLocaleString();
                break;
            case 'survival':
                label.textContent = this.survivalType === 'serial' ? 'BEST KAKIN-ANA' : 'BEST SURVIVAL';
                const best = this.survivalType === 'serial' ? this.bestSurvivalSerial : this.bestSurvival;
                value.textContent = this.formatTimeShort(best);
                break;
        }
    }

    formatTimeShort(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const partSec = seconds % 60;
        const partMs = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${partSec.toString().padStart(2, '0')}.${partMs.toString().padStart(2, '0')}`;
    }


    createBoard() {
        return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));
    }

    setupRen4Board() {
        // 左右3列を壁で埋める
        for (let row = 0; row < BOARD_HEIGHT; row++) {
            for (let col = 0; col < 3; col++) this.board[row][col] = '#333';
            for (let col = 7; col < 10; col++) this.board[row][col] = '#333';
        }

        // 種3の配置（計3ブロックにする）
        // 種3の配置（可視範囲の最下段）
        const bottom = BOARD_HEIGHT - 1;
        this.board[bottom][3] = '#ff3d00';
        this.board[bottom][4] = '#ff3d00';
        this.board[bottom][5] = '#ff3d00';
        this.board[19][6] = 0;
    }

    // ========================================
    // ピース生成 (7-bag システム)
    // ========================================
    generateBag() {
        const bag = [...TETROMINO_TYPES];
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        return bag;
    }

    getNextPiece() {
        if (this.bag.length === 0) {
            this.bag = this.generateBag();
        }
        return this.bag.pop();
    }

    initializeNextQueue() {
        this.nextQueue = [];
        for (let i = 0; i < 5; i++) {
            this.nextQueue.push(this.getNextPiece());
        }
    }

    spawnPiece() {
        const type = this.nextQueue.shift();
        this.nextQueue.push(this.getNextPiece());

        this.currentPiece = type;
        this.currentRotation = 0;
        this.currentX = Math.floor(BOARD_WIDTH / 2) - 2;
        this.currentY = BOARD_HEIGHT - VISIBLE_HEIGHT; // 出現位置をバッファ分ずらす（40-20=20）
        this.canHold = true;

        this.lockDelayCounter = 0;
        this.lockResetCount = 0;
        this.lowestY = 0; // 最低到達高度を初期化

        if (this.checkCollision(this.currentX, this.currentY, this.currentRotation)) {
            this.gameOver = true;
            this.showGameOver();
        }
    }

    // ========================================
    // 衝突検出
    // ========================================
    checkCollision(x, y, rotation) {
        const shape = TETROMINOS[this.currentPiece].shape[rotation];

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (shape[row][col]) {
                    const newX = x + col;
                    const newY = y + row;

                    if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
                        return true;
                    }

                    if (newY >= 0 && this.board[newY][newX]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    // ========================================
    // ピース操作
    // ========================================
    moveLeft() {
        const wasOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
        if (!this.checkCollision(this.currentX - 1, this.currentY, this.currentRotation)) {
            this.currentX--;
            this.lastMoveWasRotation = false;
            // 移動前後のいずれかが接地状態であれば猶予をリセット（通算回数制限あり）
            const isOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
            if (wasOnGround || isOnGround) {
                if (this.lockResetCount < MAX_LOCK_RESET) {
                    this.lockDelayCounter = 0;
                    this.lockResetCount++;
                } else if (isOnGround) {
                    // 既に上限に達した状態で接地したなら即座に固定
                    this.mergePiece();
                    this.clearLines();
                    this.spawnPiece();
                    this.lockDelayCounter = 0;
                }
            }
            return true;
        }
        return false;
    }

    moveRight() {
        const wasOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
        if (!this.checkCollision(this.currentX + 1, this.currentY, this.currentRotation)) {
            this.currentX++;
            this.lastMoveWasRotation = false;
            // 移動前後のいずれかが接地状態であれば猶予をリセット（通算回数制限あり）
            const isOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
            if (wasOnGround || isOnGround) {
                if (this.lockResetCount < MAX_LOCK_RESET) {
                    this.lockDelayCounter = 0;
                    this.lockResetCount++;
                } else if (isOnGround) {
                    // 既に上限に達した状態で接地したなら即座に固定
                    this.mergePiece();
                    this.clearLines();
                    this.spawnPiece();
                    this.lockDelayCounter = 0;
                }
            }
            return true;
        }
        return false;
    }

    moveDown() {
        if (!this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation)) {
            this.currentY++;
            this.score += 1;
            this.updateScore();
            this.lastMoveWasRotation = false;

            // リセット回数に余裕がある場合のみ、落下による猶予リセットを許可
            if (this.lockResetCount < MAX_LOCK_RESET) {
                this.lockDelayCounter = 0;
            }

            // 下がった時に高度を記録（通算制限のため回復は行わない）
            if (this.currentY > this.lowestY) {
                this.lowestY = this.currentY;
            }
            return true;
        }
        return false; // 下に動けなかった
    }

    rotate(direction = 1) {
        if (this.currentPiece === 'O') return; // O ミノは回転しない

        const wasOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
        const oldRotation = this.currentRotation;
        const newRotation = (this.currentRotation + direction + 4) % 4;
        const key = `${oldRotation}-${newRotation}`;

        // SRSキックデータの選択
        const kicks = this.currentPiece === 'I' ? I_KICKS[key] : SRS_KICKS[key];

        for (const [dx, dy] of kicks) {
            // SRSの座標系は上が+yだが、このゲームは下が+yなのでdyを反転
            if (!this.checkCollision(this.currentX + dx, this.currentY - dy, newRotation)) {
                const isUpwardKick = dy > 0; // 上方向へのキックが発生したか

                this.currentX += dx;
                this.currentY -= dy;
                this.currentRotation = newRotation;
                this.lastMoveWasRotation = true;

                // 回転前後のいずれかが接地状態、あるいは上方へのキックが発生した場合は猶予をリセット（通算回数制限あり）
                const isOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
                if (wasOnGround || isOnGround || isUpwardKick) {
                    if (this.lockResetCount < MAX_LOCK_RESET) {
                        this.lockDelayCounter = 0;
                        this.lockResetCount++;
                    } else if (isOnGround) {
                        // 既に上限に達した状態で接地したなら即座に固定
                        this.mergePiece();
                        this.clearLines();
                        this.spawnPiece();
                        this.lockDelayCounter = 0;
                    }
                }
                return;
            }
        }
    }

    hardDrop() {
        let dropDistance = 0;
        while (!this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation)) {
            this.currentY++;
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.updateScore();
        this.mergePiece();
        this.clearLines();
        this.spawnPiece();
    }

    hold() {
        if (!this.canHold) return;

        this.canHold = false;

        if (this.holdPiece === null) {
            this.holdPiece = this.currentPiece;
            this.spawnPiece();
            // ホールド経由での出現時は1段高くする
            this.currentY--;
        } else {
            const temp = this.holdPiece;
            this.holdPiece = this.currentPiece;
            this.currentPiece = temp;
            this.currentRotation = 0;
            this.currentX = Math.floor(BOARD_WIDTH / 2) - 2;
            // 1段高い位置（バッファゾーン内）から出現
            this.currentY = BOARD_HEIGHT - VISIBLE_HEIGHT - 1;

            if (this.checkCollision(this.currentX, this.currentY, this.currentRotation)) {
                this.gameOver = true;
                this.showGameOver();
            }
        }

        this.drawHold();
    }

    // ========================================
    // ボード操作
    // ========================================
    mergePiece() {
        const shape = TETROMINOS[this.currentPiece].shape[this.currentRotation];
        const color = TETROMINOS[this.currentPiece].color;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (shape[row][col]) {
                    const y = this.currentY + row;
                    const x = this.currentX + col;
                    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                        this.board[y][x] = color;
                    }
                }
            }
        }
    }

    // ========================================
    // 演出エフェクト
    // ========================================
    shakeBoard() {
        const container = document.querySelector('.board-container');
        container.classList.remove('shake');
        void container.offsetWidth; // リフローを強制してアニメーションを再開可能にする
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 400);
    }

    createParticles(x, y, color, count = 20) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 2,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.03,
                color: color,
                size: 2 + Math.random() * 4
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // 重力
            p.life -= p.decay;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    drawParticles() {
        this.ctx.globalCompositeOperation = 'lighter';
        this.particles.forEach(p => {
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;
        this.ctx.globalCompositeOperation = 'source-over';
    }

    clearLines() {
        let linesCleared = 0;
        let clearedRows = [];

        // T-spin検出（ライン削除前、かつ現在の状態を保持）
        // 事前に「T-spinの条件を満たしているか」を確認し、基本タイプ（Miniかそれ以外か）を保持する
        const baseTSpinType = (this.currentPiece === 'T' && this.lastMoveWasRotation) ? this.getBaseTSpinType() : null;

        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                clearedRows.push(row);
                this.board.splice(row, 1);
                const newRow = Array(BOARD_WIDTH).fill(0);
                if (this.gameMode === 'ren4') {
                    for (let col = 0; col < 3; col++) newRow[col] = '#333';
                    for (let col = 7; col < 10; col++) newRow[col] = '#333';
                }
                this.board.unshift(newRow);
                linesCleared++;
                row++;
            }
        }

        // T-spinの最終判定（事前に取得した情報の基づく）
        let finalTSpin = null;
        if (baseTSpinType) {
            if (linesCleared === 3) finalTSpin = 'T-SPIN-TRIPLE';
            else if (linesCleared === 2) finalTSpin = 'T-SPIN-DOUBLE';
            else if (linesCleared === 1) {
                finalTSpin = (baseTSpinType === 'NORMAL') ? 'T-SPIN-SINGLE' : 'T-SPIN-MINI';
            } else if (linesCleared === 0) {
                finalTSpin = (baseTSpinType === 'NORMAL') ? 'T-SPIN' : 'T-SPIN-MINI';
            }
        }

        if (linesCleared > 0 || finalTSpin) {
            this.lines += linesCleared;

            // 40ラインモード判定
            if (this.gameMode === '40lines' && this.lines >= 40) {
                this.lines = 40; // 表示用
                this.updateScore();
                this.finish40Lines();
                return;
            }

            // REN管理
            let actualRen = 0;
            if (linesCleared > 0) {
                this.renCount++;
                actualRen = Math.max(0, this.renCount - 1);
                if (actualRen > this.maxRen) {
                    this.maxRen = actualRen;
                }
            }

            // 消去位置のパーティクル発生
            clearedRows.forEach(rowY => {
                this.createParticles(BOARD_WIDTH * BLOCK_SIZE / 2, rowY * BLOCK_SIZE, '#ffffff', 15);
            });

            let attack = 0;
            if (finalTSpin) {
                const tSpinScores = {
                    'T-SPIN-MINI': linesCleared === 0 ? 100 : 200,
                    'T-SPIN': 400, // 0ライン時のデフォルト
                    'T-SPIN-SINGLE': 800,
                    'T-SPIN-DOUBLE': 1200,
                    'T-SPIN-TRIPLE': 1600
                };
                this.score += (tSpinScores[finalTSpin] || 0) * this.level;
                this.showTSpinNotification(finalTSpin);

                // 攻撃値計算 (T-Spin)
                if (finalTSpin === 'T-SPIN-SINGLE') attack = 2;
                else if (finalTSpin === 'T-SPIN-DOUBLE') attack = 4;
                else if (finalTSpin === 'T-SPIN-TRIPLE') attack = 6;
                else if (finalTSpin === 'T-SPIN-MINI' && linesCleared > 0) attack = 1;

                // B2B 判定
                if (linesCleared > 0) {
                    if (this.isBackToBack) attack += 1;
                    this.isBackToBack = true;
                }
            } else if (linesCleared > 0) {
                const lineScores = [0, 100, 300, 500, 800];
                this.score += lineScores[linesCleared] * this.level;
                if (linesCleared === 4) {
                    this.showTSpinNotification('TETRIS'); // 特殊通知として利用
                    attack = 4;
                    if (this.isBackToBack) attack += 1;
                    this.isBackToBack = true;
                } else {
                    attack = [0, 0, 1, 2, 4][linesCleared];
                    this.isBackToBack = false;
                }
            }

            // REN (Combo) 攻撃値
            if (linesCleared > 0 && this.renCount > 1) {
                const comboAttack = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5];
                attack += comboAttack[Math.min(this.renCount, comboAttack.length - 1)];
            }

            this.totalAttacks += attack;

            // RENボーナス（ラインを消した場合のみ、2連続目から）
            if (linesCleared > 0 && actualRen > 0) {
                const renBonus = actualRen * 50 * this.level;
                this.score += renBonus;
            }

            // パーフェクトクリア判定（ボードが完全に空になったか）
            const isPerfectClear = this.board.every(row => row.every(cell => cell === 0));
            if (isPerfectClear) {
                const pcBonus = 1000 * this.level;
                this.score += pcBonus;
                this.totalAttacks += 10;
                this.showPerfectClearNotification();
            }

            // レベルアップ (マラソンモード等の場合、10ラインごと)
            if (this.gameMode !== 'survival') {
                const newLevel = Math.floor(this.lines / 10) + 1;
                if (newLevel > this.level) {
                    this.level = newLevel;
                    this.dropInterval = INITIAL_SPEED * Math.pow(SPEED_DECREASE_RATE, this.level - 1);
                    console.log(`Level Up! Level: ${this.level}, Speed: ${this.dropInterval}ms`);
                }
            }

            this.updateScore();

            // REN演出の呼び出し
            if (this.renCount > 1) {
                this.showRenNotification(Math.max(0, this.renCount - 1));
            }
        } else {
            if (this.gameMode === 'ren4') {
                this.isRunning = false;
                this.showGameOver();
            } else {
                // ラインが消えなかった場合はRENをリセット
                this.renCount = 0;
                this.updateScore();
            }
        }
    }


    // ========================================
    // 描画
    // ========================================
    draw() {
        // ボードをクリア
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 固定されたブロックを描画 (可視範囲 + チラ見せ分)
        for (let row = BOARD_HEIGHT - VISIBLE_HEIGHT - 1; row < BOARD_HEIGHT; row++) {
            for (let col = 0; col < BOARD_WIDTH; col++) {
                if (this.board[row][col]) {
                    const drawY = row - (BOARD_HEIGHT - VISIBLE_HEIGHT);
                    this.drawBlock(col, drawY + (DISPLAY_OFFSET / BLOCK_SIZE), this.board[row][col]);
                }
            }
        }

        // ゴーストピースを描画
        this.drawGhost();

        // 現在のピースを描画
        if (this.currentPiece) {
            const shape = TETROMINOS[this.currentPiece].shape[this.currentRotation];
            const color = TETROMINOS[this.currentPiece].color;

            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    if (shape[row][col]) {
                        const drawY = this.currentY + row - (BOARD_HEIGHT - VISIBLE_HEIGHT);
                        // 画面内に収まっている場合（チラ見せ分含む）のみ描画
                        if (drawY >= -1) {
                            this.drawBlock(this.currentX + col, drawY + (DISPLAY_OFFSET / BLOCK_SIZE), color);
                        }
                    }
                }
            }
        }

        // グリッド線を描画
        this.drawGrid();
    }

    drawBlock(x, y, color) {
        const pixelX = x * BLOCK_SIZE;
        const pixelY = y * BLOCK_SIZE;

        // メインブロック
        this.ctx.fillStyle = color;
        this.ctx.fillRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);

        // ハイライト
        const gradient = this.ctx.createLinearGradient(pixelX, pixelY, pixelX + BLOCK_SIZE, pixelY + BLOCK_SIZE);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);

        // ボーダー
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(pixelX, pixelY, BLOCK_SIZE, BLOCK_SIZE);
    }

    drawGhost() {
        if (!this.currentPiece) return;

        let ghostY = this.currentY;
        while (!this.checkCollision(this.currentX, ghostY + 1, this.currentRotation)) {
            ghostY++;
        }

        const shape = TETROMINOS[this.currentPiece].shape[this.currentRotation];
        const color = TETROMINOS[this.currentPiece].color;

        this.ctx.globalAlpha = 0.2;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (shape[row][col]) {
                    const drawY = ghostY + row - (BOARD_HEIGHT - VISIBLE_HEIGHT);
                    if (drawY >= -1) {
                        this.drawBlock(this.currentX + col, drawY + (DISPLAY_OFFSET / BLOCK_SIZE), color);
                    }
                }
            }
        }
        this.ctx.globalAlpha = 1.0;
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        for (let i = 0; i <= BOARD_WIDTH; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * BLOCK_SIZE, 0);
            this.ctx.lineTo(i * BLOCK_SIZE, this.canvas.height);
            this.ctx.stroke();
        }

        for (let i = 0; i <= VISIBLE_HEIGHT + 1; i++) {
            const y = i * BLOCK_SIZE - (BLOCK_SIZE - DISPLAY_OFFSET);
            if (y < 0) continue;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawPieceOnCanvas(ctx, type, canvasWidth, canvasHeight, scale = 1) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (!type) return;

        const shape = TETROMINOS[type].shape[0];
        const color = TETROMINOS[type].color;

        const blockSize = 22 * scale;

        // ミノの実際の範囲を計算
        let minRow = 4, maxRow = 0, minCol = 4, maxCol = 0;
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (shape[row][col]) {
                    minRow = Math.min(minRow, row);
                    maxRow = Math.max(maxRow, row);
                    minCol = Math.min(minCol, col);
                    maxCol = Math.max(maxCol, col);
                }
            }
        }

        const pieceWidth = (maxCol - minCol + 1) * blockSize;
        const pieceHeight = (maxRow - minRow + 1) * blockSize;

        // Canvas内の中央に配置するためのオフセット
        const offsetX = (canvasWidth - pieceWidth) / 2 - minCol * blockSize;
        const offsetY = (canvasHeight - pieceHeight) / 2 - minRow * blockSize;

        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (shape[row][col]) {
                    const x = offsetX + col * blockSize;
                    const y = offsetY + row * blockSize;

                    ctx.fillStyle = color;
                    ctx.fillRect(x, y, blockSize, blockSize);

                    const gradient = ctx.createLinearGradient(x, y, x + blockSize, y + blockSize);
                    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, y, blockSize, blockSize);

                    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x, y, blockSize, blockSize);
                }
            }
        }
    }

    drawHold() {
        this.drawPieceOnCanvas(this.holdCtx, this.holdPiece, this.holdCanvas.width, this.holdCanvas.height);
    }

    drawNext() {
        for (let i = 0; i < 5; i++) {
            this.drawPieceOnCanvas(
                this.nextCtxs[i],
                this.nextQueue[i],
                this.nextCanvases[i].width,
                this.nextCanvases[i].height,
                0.85 // 80px枠に合わせる
            );
        }
    }

    // ========================================
    // UI更新
    // ========================================
    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('ren').textContent = Math.max(0, this.renCount - 1);
        document.getElementById('time').textContent = this.formatTime(this.elapsedTime);

        // APMの表示
        const sentApmElement = document.getElementById('apm');
        const recvApmElement = document.getElementById('recv-apm');
        if (this.elapsedTime > 0) {
            const timeInMinutes = this.elapsedTime / 60000;
            if (sentApmElement) {
                sentApmElement.textContent = (this.totalAttacks / timeInMinutes).toFixed(2);
            }
            // 受信APMはサバイバルモード時のみ表示を更新
            if (recvApmElement && this.gameMode === 'survival') {
                recvApmElement.textContent = (this.totalReceivedAttacks / timeInMinutes).toFixed(2);
            }
        } else {
            if (sentApmElement) sentApmElement.textContent = '0.00';
            if (recvApmElement) recvApmElement.textContent = '0.00';
        }

        // リアルタイムでベスト記録を表示に反映
        this.updateBestDisplay();
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    finish40Lines() {
        this.isRunning = false;
        const notification = document.getElementById('tspin-notification');
        notification.className = 'tspin-notification show perfect-clear';
        notification.textContent = 'FINISH!';
        this.showGameOver(true);
    }

    showGameOver(isWin = false) {
        this.isRunning = false;
        this.gameOver = true;
        const overlay = document.getElementById('game-over-overlay');
        const title = overlay.querySelector('.game-over-title');
        const statsContainer = overlay.querySelector('.final-score'); // Container instead of direct ID link

        if (isWin) {
            title.textContent = 'COMPLETE!';
            title.style.color = '#FFD700';
            statsContainer.innerHTML = `タイム: <span id="final-score">${this.formatTime(this.elapsedTime)}</span>`;

            // 40ラインベストタイム更新チェック
            if (this.elapsedTime < this.bestTime) {
                this.bestTime = this.elapsedTime;
            }
        } else {
            title.textContent = 'GAME OVER';
            title.style.color = 'var(--accent-secondary)';
            if (this.gameMode === 'ren4') {
                statsContainer.innerHTML = `最高REN: <span id="final-score">${this.maxRen}</span>`;
            } else if (this.gameMode === 'survival') {
                statsContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                        <div>スコア: <span id="final-score">${this.score.toLocaleString()}</span></div>
                        <div>タイム: <span style="color: var(--accent-primary);">${this.formatTime(this.elapsedTime)}</span></div>
                    </div>
                `;
            } else {
                statsContainer.innerHTML = `スコア: <span id="final-score">${this.score.toLocaleString()}</span>`;
            }
        }

        // ベスト記録の更新チェック
        let updated = false;

        if (this.gameMode === 'marathon') {
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                updated = true;
            }
        } else if (this.gameMode === '40lines' && isWin) {
            if (this.elapsedTime < this.bestTime) {
                this.bestTime = this.elapsedTime;
                updated = true;
            }
        } else if (this.gameMode === 'ren4') {
            if (this.maxRen > this.bestRen) {
                this.bestRen = this.maxRen;
                updated = true;
            }
        } else if (this.gameMode === 'survival') {
            if (this.survivalType === 'serial') {
                if (this.elapsedTime > this.bestSurvivalSerial) {
                    this.bestSurvivalSerial = this.elapsedTime;
                    updated = true;
                }
            } else {
                if (this.elapsedTime > this.bestSurvival) {
                    this.bestSurvival = this.elapsedTime;
                    updated = true;
                }
            }
        }

        if (updated) {
            this.saveHighScores();
            this.updateBestDisplay();
        }

        if (updated || isWin) {
            this.saveHighScores();
            this.updateScore();
        }

        overlay.classList.add('active');
    }

    async shareToX() {
        let text = '';
        if (this.gameMode === 'ren4') {
            text = `無限4列RENで ${this.maxRen} RENでした！`;
        } else if (this.gameMode === '40lines') {
            text = `40ラインモードでタイム ${this.formatTime(this.elapsedTime)} でした！`;
        } else if (this.gameMode === 'survival') {
            const modeName = this.survivalType === 'serial' ? '課金穴サバイバル' : '通常サバイバル';
            text = `${modeName}でスコア ${this.score.toLocaleString()} / タイム ${this.formatTime(this.elapsedTime)} でした！`;
        } else {
            text = `マラソンモードでスコア ${this.score.toLocaleString()} でした！`;
        }

        const hashtags = '無限4列REN,TETRIN';
        const url = window.location.href;

        // X(Twitter)の投稿用URLを生成
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;

        // 新しいタブで開く
        window.open(twitterUrl, '_blank');
    }

    // ========================================
    // ゲームループ
    // ========================================
    update(time = 0) {
        this.pollGamepad();

        if (!this.isRunning || this.gameOver || this.isPaused) {
            // ゲームオーバー時やポーズ時もゲームパッド入力を継続的に検出するため、ループを継続
            requestAnimationFrame((t) => this.update(t));
            return;
        }

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        if (this.isRunning && !this.isPaused) {
            this.elapsedTime += deltaTime;
            this.updateScore();
        }

        this.handleInputs(deltaTime); // 追加

        this.dropCounter += deltaTime;

        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
            this.dropCounter = 0;
            // 落下した場合は inner でリセットされるようになったので、ここでは削除
        }

        // サバイバルモードのせり上がり処理
        if (this.gameMode === 'survival' && !this.isPaused) {
            this.garbageTimer += deltaTime;

            // 警告演出（残り2秒から）
            if (this.garbageTimer >= this.garbageInterval - 2000 && !this.isGarbageWarning) {
                this.isGarbageWarning = true;
                this.showGarbageWarning();
            }

            if (this.garbageTimer >= this.garbageInterval) {
                this.addGarbageLine();
                this.garbageTimer = 0;
                this.isGarbageWarning = false;
                // レベルに応じて徐々に加速（最低1秒まで）
                this.garbageInterval = Math.max(1000, 10000 - (this.level - 1) * 500);
            }

            // 時間経過によるレベルアップ (10秒ごと)
            const newLevel = Math.floor(this.elapsedTime / 10000) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.showMessage(`LEVEL UP: ${this.level}`, 'info');
                // せり上がり間隔も即座に再計算
                this.garbageInterval = Math.max(1000, 10000 - (this.level - 1) * 500);
            }
        }

        // 接地判定と猶予タイマーの処理
        if (this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation)) {
            // リセット回数を使い切っている場合は即座に固定（這い上がり防止）
            if (this.lockResetCount >= MAX_LOCK_RESET) {
                this.mergePiece();
                this.clearLines();
                this.spawnPiece();
                this.lockDelayCounter = 0;
            } else {
                this.lockDelayCounter += deltaTime;
                if (this.lockDelayCounter >= LOCK_DELAY_TIME) {
                    this.mergePiece();
                    this.clearLines();
                    this.spawnPiece();
                    this.lockDelayCounter = 0;
                }
            }
        } else {
            // 空中：リセット回数に余裕がある時だけタイマーをリセット
            if (this.lockResetCount < MAX_LOCK_RESET) {
                this.lockDelayCounter = 0;
            }
            // 上限到達後は空中にいてもタイマーがリセットされないため、
            // 空中でタイマーが満了すれば落下速度によらず固定される
        }

        this.updateParticles(); // 追加

        this.draw();
        this.drawNext();
        this.drawParticles(); // 追加

        requestAnimationFrame((t) => this.update(t));
    }

    start(mode = 'marathon', survivalType = 'normal') {
        this.gameMode = mode;
        this.survivalType = survivalType;
        this.board = this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.renCount = 0;
        this.maxRen = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.isRunning = true;
        this.elapsedTime = 0;
        this.gameStartTime = performance.now();
        this.dropCounter = 0;
        this.dropInterval = INITIAL_SPEED;

        this.garbageTimer = 0;
        this.garbageInterval = 10000;
        this.isGarbageWarning = false;

        this.holdPiece = null;
        this.canHold = true;

        this.bag = [];
        this.nextQueue = [];
        this.initializeNextQueue();

        if (this.gameMode === 'ren4') {
            this.setupRen4Board();
        }

        this.spawnPiece();
        this.updateScore();
        this.updateBestDisplay();

        // 特定のモードでの初期メッセージ
        if (mode === '40lines') {
            this.showMessage('SPRINT: 40 LINES!', 'info');
        } else if (mode === 'ren4') {
            this.showMessage('REN PRACTICE: 4 COLUMNS', 'info');
        } else if (mode === 'survival') {
            const typeLabel = survivalType === 'serial' ? 'KAKIN-ANA (4-LINE)' : 'NORMAL';
            this.showMessage(`SURVIVAL: ${typeLabel}`, 'info');
        }

        // サブタイトルの更新
        const subtitle = document.getElementById('subtitle');
        if (subtitle) {
            switch (mode) {
                case 'marathon':
                    subtitle.textContent = 'ハイスコアへの挑戦';
                    break;
                case '40lines':
                    subtitle.textContent = '40ライン消去までのタイムアタック';
                    break;
                case 'ren4':
                    subtitle.textContent = 'RENの限界に挑戦';
                    break;
                case 'survival':
                    subtitle.textContent = survivalType === 'serial' ? '4列穴固定せり上がりを耐えろ' : '迫りくる地面から生き残れ';
                    break;
            }
        }

        document.getElementById('game-overlay').style.display = 'none';
        document.getElementById('game-over-overlay').classList.remove('active');

        // サバイバルパネルの表示制御
        const survivalPanel = document.getElementById('survival-panel');
        if (survivalPanel) {
            survivalPanel.style.display = (mode === 'survival') ? 'block' : 'none';
        }

        // 通知をクリア
        const notification = document.getElementById('tspin-notification');
        notification.className = 'tspin-notification';
        if (this.tspinTimeout) {
            clearTimeout(this.tspinTimeout);
            this.tspinTimeout = null;
        }

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.update(t));
    }

    pollGamepad() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const actions = ['moveLeft', 'moveRight', 'softDrop', 'hardDrop', 'rotateRight', 'rotateLeft', 'hold', 'hold2', 'pause', 'reset'];
        const currentButtons = {};
        actions.forEach(a => currentButtons[a] = false);

        for (const gp of gamepads) {
            if (!gp) continue;

            const buttons = gp.buttons;
            const axes = gp.axes;

            actions.forEach(action => {
                const btnIndex = this.keyBindings.getGamepadBinding(action);
                if (btnIndex !== null && btnIndex !== undefined && buttons[btnIndex]?.pressed) {
                    currentButtons[action] = true;
                }
            });

            // スティック操作の集約 (デッドゾーン 0.5)
            if (axes[0] < -0.5) currentButtons['moveLeft'] = true;
            if (axes[0] > 0.5) currentButtons['moveRight'] = true;
            if (axes[1] > 0.5) currentButtons['softDrop'] = true;
        }

        // 状態の更新とエッジ検出
        for (const actionName of actions) {
            const isPressed = currentButtons[actionName];
            const wasPressed = this.lastGamepadButtons[actionName] || false;

            if (isPressed) {
                // キーボードが押されていないときのみ、ゲームパッドの状態を反映（共存）
                this.keysState[actionName] = true;

                // 押し下げられた瞬間 (Edge Detection)
                if (!wasPressed) {
                    this.handleButtonDown(actionName);
                }
            } else if (wasPressed) {
                this.keysState[actionName] = false;
            }

            this.lastGamepadButtons[actionName] = isPressed;
        }
    }

    handleButtonDown(action) {
        if (!this.isRunning || this.gameOver) {
            if (action === 'reset') {
                this.quickReset();
                return;
            }
            return;
        }

        if (this.isPaused) {
            if (action === 'pause') this.pause();
            return;
        }

        switch (action) {
            case 'moveLeft':
                this.moveLeft();
                this.lastAction = 'moveLeft';
                this.dasTimer = 0;
                break;
            case 'moveRight':
                this.moveRight();
                this.lastAction = 'moveRight';
                this.dasTimer = 0;
                break;
            case 'softDrop':
                this.moveDown();
                this.softDropTimer = 0;
                break;
            case 'rotateRight': this.rotate(1); break;
            case 'rotateLeft': this.rotate(-1); break;
            case 'hold': this.hold(); break;
            case 'hold2': this.hold(); break;
            case 'hardDrop': this.hardDrop(); break;
            case 'pause': this.pause(); break;
            case 'reset': this.quickReset(); break;
        }
        this.draw();
    }

    handleInputs(deltaTime) {
        if (!this.isRunning || this.gameOver || this.isPaused) return;

        // 左右移動の DAS/ARR 処理
        const moveLeft = this.keysState['moveLeft'];
        const moveRight = this.keysState['moveRight'];

        // 両方のキーが押されている場合は、後に押された方、または何もしない（ここでは左優先とするのがシンプル）
        const moveAction = moveLeft ? 'moveLeft' : (moveRight ? 'moveRight' : null);

        if (moveAction) {
            this.dasTimer += deltaTime;
            if (this.dasTimer >= this.settings.get('dasDelay')) {
                this.arrTimer += deltaTime;
                if (this.arrTimer >= this.settings.get('arrInterval')) {
                    if (moveAction === 'moveLeft') this.moveLeft();
                    else this.moveRight();
                    this.arrTimer = 0;
                    this.draw();
                }
            }
        } else {
            this.dasTimer = 0;
            this.arrTimer = 0;
        }

        // ソフトドロップのリピート処理
        if (this.keysState['softDrop']) {
            this.softDropTimer += deltaTime;
            if (this.softDropTimer >= this.settings.get('dasDelay')) {
                // 300ms 経過後は、落下速度を大幅に上げる
                this.dropCounter += deltaTime * 15;
            }
        } else {
            this.softDropTimer = 0;
        }
    }

    pause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused && this.isRunning) {
            this.lastTime = performance.now();
            requestAnimationFrame((t) => this.update(t));
        }
    }

    quickReset() {
        // タイトル画面に戻らず、即座にゲームを再開
        this.board = this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.renCount = 0;
        this.maxRen = 0;
        this.totalAttacks = 0;
        this.totalReceivedAttacks = 0;
        this.isBackToBack = false;
        this.holdPiece = null;
        this.canHold = true;
        this.bag = [];
        this.dropCounter = 0;
        this.dropInterval = INITIAL_SPEED;
        this.lockDelayCounter = 0;
        this.lockResetCount = 0;
        this.elapsedTime = 0;
        this.gameStartTime = performance.now();

        // サバイバルモード関連の状態をリセット
        this.garbageTimer = 0;
        this.garbageInterval = 10000;
        this.isGarbageWarning = false;

        this.initializeNextQueue();

        if (this.gameMode === 'ren4') {
            this.setupRen4Board();
        }

        this.spawnPiece();
        this.updateScore();

        this.gameOver = false;
        this.isPaused = false;
        this.isRunning = true;
        this.updateBestDisplay();

        document.getElementById('game-over-overlay').classList.remove('active');

        // 通知をクリア
        const notification = document.getElementById('tspin-notification');
        notification.className = 'tspin-notification';
        if (this.tspinTimeout) {
            clearTimeout(this.tspinTimeout);
            this.tspinTimeout = null;
        }

        this.draw();
        this.drawHold();
        this.drawNext();

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.update(t));
    }

    returnToTitle() {
        this.isRunning = false;
        this.gameOver = false;
        this.isPaused = false;

        // 全ての状態を初期化
        this.board = this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.renCount = 0;
        this.maxRen = 0;
        this.totalAttacks = 0;
        this.totalReceivedAttacks = 0;
        this.isBackToBack = false;
        this.holdPiece = null;
        this.canHold = true;
        this.bag = [];
        this.dropCounter = 0;
        this.dropInterval = INITIAL_SPEED;
        this.elapsedTime = 0;

        this.garbageTimer = 0;
        this.garbageInterval = 10000;
        this.isGarbageWarning = false;

        this.initializeNextQueue();
        this.updateScore();

        // キャンバスのクリア
        this.draw();
        this.drawHold();
        this.drawNext();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // メインボードも真っ新に

        document.getElementById('game-overlay').style.display = 'flex';
        document.getElementById('game-over-overlay').classList.remove('active');

        // サブタイトルのリセット
        const subtitle = document.getElementById('subtitle');
        if (subtitle) {
            subtitle.textContent = '次の5個を見通せ、HOLDで戦略を';
        }

        // サバイバルパネルの非表示
        const survivalPanel = document.getElementById('survival-panel');
        if (survivalPanel) {
            survivalPanel.style.display = 'none';
        }
    }

    // ========================================
    // イベントリスナー
    // ========================================
    setupEventListeners() {
        // キーボード入力（キーバインド対応）
        document.addEventListener('keydown', (e) => {
            const action = this.keyBindings.getAction(e.code);

            if (this.isRunning && this.isPaused && action === 'pause') {
                e.preventDefault();
                this.pause();
                return;
            }

            if (!this.isRunning || this.gameOver || this.isPaused) {
                if (action === 'reset' && (this.isRunning || this.gameOver || this.isPaused)) {
                    e.preventDefault();
                    this.quickReset();
                    this.draw();
                }
                return;
            }

            if (action) {
                e.preventDefault();

                // すでに押されている場合はリピートをブラウザに任せない
                if (this.keysState[action]) return;

                this.keysState[action] = true;

                // 初動の実行
                switch (action) {
                    case 'moveLeft':
                        this.moveLeft();
                        this.lastAction = 'moveLeft';
                        this.dasTimer = 0;
                        break;
                    case 'moveRight':
                        this.moveRight();
                        this.lastAction = 'moveRight';
                        this.dasTimer = 0;
                        break;
                    case 'softDrop':
                        this.moveDown();
                        this.dropCounter = 0;
                        this.softDropTimer = 0;
                        break;
                    case 'hardDrop':
                        this.hardDrop();
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
                    case 'hold2':
                        this.hold();
                        break;
                    case 'pause':
                        this.pause();
                        break;
                    case 'reset':
                        if (this.isRunning) {
                            this.quickReset();
                        }
                        break;
                }
                this.draw();
            }
        });

        document.addEventListener('keyup', (e) => {
            const action = this.keyBindings.getAction(e.code);
            if (action) {
                this.keysState[action] = false;
                if (action === 'moveLeft' || action === 'moveRight') {
                    if (!this.keysState['moveLeft'] && !this.keysState['moveRight']) {
                        this.lastAction = null;
                        this.dasTimer = 0;
                    }
                }
            }
        });

        //  ボタンイベント
        document.getElementById('start-marathon').addEventListener('click', () => {
            this.start('marathon');
        });

        document.getElementById('start-40lines').addEventListener('click', () => {
            this.start('40lines');
        });

        document.getElementById('start-ren4').addEventListener('click', () => {
            this.start('ren4');
        });

        // モード選択UIの制御
        const mainModeSelect = document.getElementById('main-mode-select');
        const survivalModeSelect = document.getElementById('survival-mode-select');

        document.getElementById('show-survival-menu').addEventListener('click', () => {
            mainModeSelect.style.display = 'none';
            survivalModeSelect.style.display = 'flex';
        });

        document.getElementById('back-to-main').addEventListener('click', () => {
            mainModeSelect.style.display = 'flex';
            survivalModeSelect.style.display = 'none';
        });

        document.getElementById('start-survival-normal').addEventListener('click', () => {
            this.start('survival', 'normal');
        });

        document.getElementById('start-survival-serial').addEventListener('click', () => {
            this.start('survival', 'serial');
        });

        document.getElementById('restart-btn').addEventListener('click', () => {
            this.quickReset();
        });

        document.getElementById('pause-btn').addEventListener('click', () => {
            if (this.isRunning && !this.gameOver) {
                this.pause();
            }
        });

        document.getElementById('quick-reset-btn').addEventListener('click', () => {
            if (this.isRunning) {
                this.quickReset();
            }
        });

        document.getElementById('return-title-btn').addEventListener('click', () => {
            this.returnToTitle();
        });

        document.getElementById('return-title-gameover-btn').addEventListener('click', () => {
            this.returnToTitle();
        });

        document.getElementById('share-x-btn').addEventListener('click', () => {
            this.shareToX();
        });
    }

    // ========================================
    // T-spin検出 (事前判定用)
    // ========================================
    getBaseTSpinType() {
        if (this.currentPiece !== 'T' || !this.lastMoveWasRotation) {
            return null;
        }

        const corners = this.getTCorners();
        let filledCorners = 0;
        let frontCorners = 0;

        for (let i = 0; i < corners.length; i++) {
            const [cx, cy] = corners[i];
            if (cy < 0 || cy >= BOARD_HEIGHT || cx < 0 || cx >= BOARD_WIDTH || (cy >= 0 && this.board[cy][cx])) {
                filledCorners++;
                // 前面コーナー判定
                const isFront = (this.currentRotation === 0 && (i === 0 || i === 1)) ||
                    (this.currentRotation === 1 && (i === 1 || i === 2)) ||
                    (this.currentRotation === 2 && (i === 2 || i === 3)) ||
                    (this.currentRotation === 3 && (i === 3 || i === 0));

                if (isFront) {
                    frontCorners++;
                }
            }
        }

        if (filledCorners >= 3) {
            // 前面2つが埋まっていれば通常の T-spin、そうでなければ Mini
            // ※より正確には最後の回転がSRSの特定のキック（Offset 5）だった場合なども考慮が必要だが
            // ここではフロントコーナーの数で簡易判定する（一般的ルールに近い）
            return frontCorners >= 2 ? 'NORMAL' : 'MINI';
        }

        return null;
    }

    // 以前のメソッドは削除または getBaseTSpinType に一本化
    checkTSpin(linesCleared) {
        // 後方互換性または簡易呼び出し用
        const base = this.getBaseTSpinType();
        if (!base) return null;
        if (linesCleared === 3) return 'T-SPIN-TRIPLE';
        if (linesCleared === 2) return 'T-SPIN-DOUBLE';
        if (linesCleared === 1) return base === 'NORMAL' ? 'T-SPIN-SINGLE' : 'T-SPIN-MINI';
        return base === 'NORMAL' ? 'T-SPIN' : 'T-SPIN-MINI';
    }

    getTCorners() {
        // T字ミノの4つのコーナー座標を返す
        const corners = [
            [this.currentX, this.currentY],
            [this.currentX + 2, this.currentY],
            [this.currentX + 2, this.currentY + 2],
            [this.currentX, this.currentY + 2]
        ];
        return corners;
    }

    showTSpinNotification(type) {
        const notification = document.getElementById('tspin-notification');

        // 前の通知タイマーをクリア
        if (this.tspinTimeout) {
            clearTimeout(this.tspinTimeout);
        }

        notification.className = 'tspin-notification show';

        let color = '#ffffff';
        let particleCount = 20;

        // 通知の種類に応じた設定
        if (type === 'T-SPIN-MINI') {
            notification.textContent = 'T-SPIN MINI!';
            notification.classList.add('tspin-mini');
            color = '#b300ff';
        } else if (type === 'T-SPIN' || type === 'T-SPIN-NORMAL') {
            notification.textContent = 'T-SPIN!';
            notification.classList.add('tspin-single'); // 共有スタイル
            color = '#3a86ff';
        } else if (type === 'T-SPIN-SINGLE') {
            notification.textContent = 'T-SPIN SINGLE!';
            notification.classList.add('tspin-single');
            color = '#3a86ff';
            particleCount = 30;
        } else if (type === 'T-SPIN-DOUBLE') {
            notification.textContent = 'T-SPIN DOUBLE!';
            notification.classList.add('tspin-double');
            color = '#ff006e';
            particleCount = 50;
            this.shakeBoard();
        } else if (type === 'T-SPIN-TRIPLE') {
            notification.textContent = 'T-SPIN TRIPLE!';
            notification.classList.add('tspin-triple');
            color = '#ffcc00';
            particleCount = 100;
            this.shakeBoard();
        } else if (type === 'TETRIS') {
            notification.textContent = 'TETRIS!';
            notification.classList.add('tspin-triple');
            color = '#00f0ff';
            particleCount = 80;
            this.shakeBoard();
        }

        // 座標計算（現在のピース位置または中央）
        const px = this.currentX !== undefined ? (this.currentX + 1.5) * BLOCK_SIZE : 150;
        const py = this.currentY !== undefined ? (this.currentY + 1.5) * BLOCK_SIZE : 300;
        this.createParticles(px, py, color, particleCount);

        this.tspinTimeout = setTimeout(() => {
            notification.className = 'tspin-notification';
            this.tspinTimeout = null;
        }, 2000);
    }

    // サバイバルモード用：せり上がりロジック
    addGarbageLine() {
        // 出現位置（可視範囲の最上段中央付近）にお邪魔ミノが到達するかチェック
        const spawnX = Math.floor(BOARD_WIDTH / 2) - 2;
        const visibleTop = BOARD_HEIGHT - VISIBLE_HEIGHT;
        const targetRows = [visibleTop, visibleTop + 1];

        let garbageReachesTop = false;
        for (let r of targetRows) {
            for (let c = spawnX; c < spawnX + 4; c++) {
                if (this.board[r][c] === '#7d7d7d') {
                    garbageReachesTop = true;
                    break;
                }
            }
            if (garbageReachesTop) break;
        }

        if (garbageReachesTop) {
            this.showGameOver();
            return;
        }

        const linesToAdd = this.survivalType === 'serial' ? 4 : 1;
        this.totalReceivedAttacks += linesToAdd;
        const holeIndex = Math.floor(Math.random() * BOARD_WIDTH);

        for (let l = 0; l < linesToAdd; l++) {
            // 全てを1段上にずらす
            for (let y = 0; y < BOARD_HEIGHT - 1; y++) {
                this.board[y] = [...this.board[y + 1]];
            }

            // 最下段に穴空きラインを追加
            const currentHole = this.survivalType === 'serial' ? holeIndex : Math.floor(Math.random() * BOARD_WIDTH);
            const garbageColor = '#7d7d7d';
            this.board[BOARD_HEIGHT - 1] = new Array(BOARD_WIDTH).fill(garbageColor);
            this.board[BOARD_HEIGHT - 1][currentHole] = 0;

            // 現在のピースが重なる場合は上にずらす
            if (this.checkCollision(this.currentX, this.currentY, this.currentRotation)) {
                this.currentY--;
                // それでも衝突する場合はゲームオーバー
                if (this.checkCollision(this.currentX, this.currentY, this.currentRotation)) {
                    this.showGameOver();
                    return;
                }
            }
        }

        this.draw();
        this.showMessage(this.survivalType === 'serial' ? 'KAKIN-ANA GARBAGE!' : 'GARBAGE RISE!');
    }

    showGarbageWarning() {
        this.shakeBoard();
        // ボードを赤くフラッシュさせる（簡易的にCSSクラス付与などで対応可能だが、ここでは揺れのみ）
    }

    showRenNotification(renCount) {
        const notification = document.getElementById('ren-notification');
        if (!notification) return;

        // 既存のタイマーをクリア
        if (this.renTimeout) {
            clearTimeout(this.renTimeout);
            this.renTimeout = null;
        }

        // アニメーションのリセットのために一度クラスを全て削除
        notification.classList.remove('show', 'ren-low', 'ren-mid', 'ren-high');

        // 強制リフローを起こして、ブラウザに「消えた状態」を認識させる
        void notification.offsetWidth;

        // 新しい内容をセット
        notification.textContent = `${renCount} REN!`;

        // ランクに応じたクラスと演出の設定
        let color = '#ffd700'; // Gold
        let particleCount = 20;

        if (renCount >= 10) {
            notification.classList.add('ren-high');
            color = '#ff4500'; // OrangeRed
            particleCount = 60;
            this.shakeBoard();
        } else if (renCount >= 5) {
            notification.classList.add('ren-mid');
            color = '#ff8c00'; // DarkOrange
            particleCount = 40;
            this.shakeBoard();
        } else {
            notification.classList.add('ren-low');
        }

        // 表示開始
        notification.classList.add('show');

        // エフェクトの生成
        const px = this.currentX !== undefined ? (this.currentX + 1.5) * BLOCK_SIZE : 150;
        const py = this.currentY !== undefined ? (this.currentY + 1.0) * BLOCK_SIZE : 250;
        this.createParticles(px, py, color, particleCount);

        // 一定時間後に非表示にするタイマーをセット
        this.renTimeout = setTimeout(() => {
            notification.classList.remove('show');
            this.renTimeout = null;
        }, 1500);
    }

    showPerfectClearNotification() {
        const notification = document.getElementById('tspin-notification');

        // 前の通知タイマーをクリア
        if (this.tspinTimeout) {
            clearTimeout(this.tspinTimeout);
        }

        notification.className = 'tspin-notification show perfect-clear';
        notification.textContent = 'PERFECT CLEAR!';

        // 超豪華なエフェクト
        this.shakeBoard();

        // 虹色のパーティクルを大量に発生
        const colors = ['#ff0080', '#00f0ff', '#ffcc00', '#00ff41', '#b300ff'];
        const centerX = BOARD_WIDTH * BLOCK_SIZE / 2;
        const centerY = BOARD_HEIGHT * BLOCK_SIZE / 2;

        colors.forEach((color, index) => {
            setTimeout(() => {
                this.createParticles(centerX, centerY, color, 50);
            }, index * 50);
        });

        this.tspinTimeout = setTimeout(() => {
            notification.className = 'tspin-notification';
            this.tspinTimeout = null;
        }, 3000);
    }

    // ========================================
    // 設定UI管理
    // ========================================
    setupSettingsUI() {
        const settingsBtn = document.getElementById('settings-btn');
        const settingsModal = document.getElementById('settings-modal');
        const closeSettings = document.getElementById('close-settings');
        const saveSettings = document.getElementById('save-settings');
        const resetDefaults = document.getElementById('reset-defaults');
        const messageDiv = document.getElementById('keybind-message');

        let currentEditingAction = null;

        // 設定ボタンクリック
        settingsBtn.addEventListener('click', () => {
            this.loadKeyBindingsToUI();
            this.loadGameSettingsToUI(); // 追加
            settingsModal.classList.add('active');
        });

        // スライダーのリアルタイム表示更新
        const dasSlider = document.getElementById('setting-das');
        const arrSlider = document.getElementById('setting-arr');
        const dasValue = document.getElementById('value-das');
        const arrValue = document.getElementById('value-arr');

        dasSlider.addEventListener('input', (e) => {
            dasValue.textContent = e.target.value;
        });

        arrSlider.addEventListener('input', (e) => {
            arrValue.textContent = e.target.value;
        });

        // モーダルを閉じる
        const closeModal = () => {
            settingsModal.classList.remove('active');
            currentEditingAction = null;
            this.clearAllListeningStates();
        };

        closeSettings.addEventListener('click', closeModal);
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                closeModal();
            }
        });

        // キーバインド変更ボタン
        document.querySelectorAll('.btn-rebind').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.startKeyListening(action);
            });
        });

        // ゲームパッドのリバインドボタン
        document.querySelectorAll('.btn-rebind-gp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.startGamepadListening(action);
            });
        });

        // デフォルトに戻す
        resetDefaults.addEventListener('click', () => {
            if (confirm('すべての設定をデフォルトに戻しますか？')) {
                this.keyBindings.resetToDefaults();
                this.settings.resetToDefaults();
                this.loadKeyBindingsToUI();
                this.loadGameSettingsToUI();
                messageDiv.textContent = 'デフォルトに戻しました';
                messageDiv.className = 'keybind-message info';
                setTimeout(() => {
                    messageDiv.textContent = '';
                }, 2000);
            }
        });

        // 保存
        saveSettings.addEventListener('click', () => {
            // キーバインド保存
            this.keyBindings.saveBindings();

            // ゲーム設定保存
            this.settings.set('dasDelay', parseInt(dasSlider.value));
            this.settings.set('arrInterval', parseInt(arrSlider.value));

            // 背景設定は変更時に即保存されている想定だが、念のためここでも保存
            this.settings.saveSettings();

            messageDiv.textContent = '設定を保存しました';
            messageDiv.className = 'keybind-message success';
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'keybind-message';
                closeModal();
            }, 1500);
        });

        // ----------------------------------------
        // 背景設定のリスナー追加
        // ----------------------------------------

        // プリセット選択
        document.querySelectorAll('.btn-bg-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.bgType;
                const value = btn.dataset.bgValue;

                this.settings.set('bgType', type);
                this.settings.set('bgValue', value);
                this.applyBackground();

                // UI表示の更新
                document.querySelectorAll('.btn-bg-preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // カスタム適用ボタン（色・画像）
        document.querySelectorAll('.btn-apply-custom').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.bgType;
                let value = '';

                if (type === 'color') {
                    value = document.getElementById('setting-bg-color').value;
                } else if (type === 'image') {
                    value = document.getElementById('setting-bg-image').value;
                    if (!value) return;
                }

                this.settings.set('bgType', type);
                this.settings.set('bgValue', value);
                this.applyBackground();

                // プリセットの選択解除
                document.querySelectorAll('.btn-bg-preset').forEach(b => b.classList.remove('active'));

                messageDiv.textContent = '背景を適用しました';
                messageDiv.className = 'keybind-message info';
                setTimeout(() => { messageDiv.textContent = ''; }, 2000);
            });
        });

        // ローカルファイル選択
        const bgFileInput = document.getElementById('setting-bg-file');
        const selectFileBtn = document.getElementById('btn-select-file');

        if (selectFileBtn && bgFileInput) {
            selectFileBtn.addEventListener('click', () => {
                bgFileInput.click();
            });

            bgFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    const dataUrl = event.target.result;
                    this.settings.set('bgType', 'image');
                    this.settings.set('bgValue', dataUrl);
                    this.applyBackground();

                    // プリセットの選択解除
                    document.querySelectorAll('.btn-bg-preset').forEach(b => b.classList.remove('active'));

                    messageDiv.textContent = 'ローカル画像を適用しました';
                    messageDiv.className = 'keybind-message info';
                    setTimeout(() => { messageDiv.textContent = ''; }, 2000);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    loadGameSettingsToUI() {
        const dasSlider = document.getElementById('setting-das');
        const arrSlider = document.getElementById('setting-arr');
        const dasValue = document.getElementById('value-das');
        const arrValue = document.getElementById('value-arr');

        dasSlider.value = this.settings.get('dasDelay');
        arrSlider.value = this.settings.get('arrInterval');
        dasValue.textContent = dasSlider.value;
        arrValue.textContent = arrSlider.value;

        // 背景設定の読み込み
        const currentBgType = this.settings.get('bgType');
        const currentBgValue = this.settings.get('bgValue');

        document.querySelectorAll('.btn-bg-preset').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.bgValue === currentBgValue && currentBgType === 'preset');
        });

        if (currentBgType === 'color') {
            document.getElementById('setting-bg-color').value = currentBgValue;
        } else if (currentBgType === 'image') {
            document.getElementById('setting-bg-image').value = currentBgValue;
        }
    }

    applyBackground() {
        const bgType = this.settings.get('bgType');
        const bgValue = this.settings.get('bgValue');
        const body = document.body;

        // 既存の背景クラスを削除
        body.className = body.className.replace(/\bbg-preset-\S+/g, '');
        body.style.background = '';

        if (bgType === 'preset') {
            body.classList.add(`bg-preset-${bgValue}`);
        } else if (bgType === 'color') {
            body.style.background = bgValue;
        } else if (bgType === 'image') {
            body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bgValue}')`;
            body.style.backgroundSize = 'cover';
            body.style.backgroundPosition = 'center';
            body.style.backgroundAttachment = 'fixed';
        }
    }

    loadKeyBindingsToUI() {
        const actions = ['moveLeft', 'moveRight', 'softDrop', 'hardDrop', 'rotateRight', 'rotateLeft', 'hold', 'hold2', 'pause', 'reset'];
        actions.forEach(action => {
            // キーボード
            const keyInput = document.getElementById(`key-${action}`);
            if (keyInput) {
                const key = this.keyBindings.getBinding(action);
                keyInput.value = this.keyBindings.getKeyDisplay(key);
            }
            // ゲームパッド
            const gpInput = document.getElementById(`gp-${action}`);
            if (gpInput) {
                const buttonIndex = this.keyBindings.getGamepadBinding(action);
                gpInput.value = this.keyBindings.getGamepadButtonDisplay(buttonIndex);
            }
        });
    }

    startKeyListening(action) {
        this.clearAllListeningStates();

        const input = document.getElementById(`key-${action}`);
        const btn = document.querySelector(`[data-action="${action}"]`);

        input.classList.add('listening');
        btn.classList.add('active');

        this.showMessage('新しいキーを押してください...', 'info');

        const keyHandler = (e) => {
            e.preventDefault();

            const key = e.code;

            // 重複チェック
            const duplicate = this.keyBindings.isDuplicate(key, action);
            if (duplicate) {
                this.showMessage(`このキーは既に「${this.getActionLabel(duplicate)}」に割り当てられています`, 'error');
                return;
            }

            // キーバインドを更新
            this.keyBindings.setBinding(action, key);
            input.value = this.keyBindings.getKeyDisplay(key);

            input.classList.remove('listening');
            btn.classList.remove('active');
            this.showMessage('キーを設定しました', 'success');

            document.removeEventListener('keydown', keyHandler);
        };

        document.addEventListener('keydown', keyHandler);
    }

    clearAllListeningStates() {
        document.querySelectorAll('.key-input').forEach(input => {
            input.classList.remove('listening');
        });
        document.querySelectorAll('.btn-rebind, .btn-rebind-gp').forEach(btn => {
            btn.classList.remove('active');
        });

        // ゲームパッドのリバインドループ用フラグをクリア
        this.isGamepadListening = false;
        if (this.gamepadListeningInterval) {
            clearInterval(this.gamepadListeningInterval);
            this.gamepadListeningInterval = null;
        }
    }

    startGamepadListening(action) {
        this.clearAllListeningStates();

        const input = document.getElementById(`gp-${action}`);
        const btn = document.querySelector(`.btn-rebind-gp[data-action="${action}"]`);

        input.classList.add('listening');
        btn.classList.add('active');

        this.showMessage('ゲームパッドのボタンを押してください...', 'info');

        this.isGamepadListening = true;

        // ポーリングでボタン入力を待ち受ける
        this.gamepadListeningInterval = setInterval(() => {
            const gamepads = navigator.getGamepads();

            for (const gp of gamepads) {
                if (!gp) continue;

                for (let i = 0; i < gp.buttons.length; i++) {
                    if (gp.buttons[i].pressed) {
                        const buttonIndex = i;

                        // 重複チェック
                        const duplicate = this.keyBindings.isGamepadDuplicate(buttonIndex, action);
                        if (duplicate) {
                            this.showMessage(`このボタンは既に「${this.getActionLabel(duplicate)}」に割り当てられています`, 'error');
                            return;
                        }

                        // バインド更新
                        this.keyBindings.setGamepadBinding(action, buttonIndex);
                        input.value = this.keyBindings.getGamepadButtonDisplay(buttonIndex);

                        this.showMessage('ボタンを設定しました', 'success');
                        this.clearAllListeningStates();
                        return;
                    }
                }
            }
        }, 100);
    }

    showMessage(text, type) {
        const messageDiv = document.getElementById('keybind-message');
        messageDiv.textContent = text;
        messageDiv.className = `keybind-message ${type}`;
    }

    getActionLabel(action) {
        const labels = {
            moveLeft: '左移動',
            moveRight: '右移動',
            softDrop: 'ソフトドロップ',
            hardDrop: 'ハードドロップ',
            rotateRight: '右回転',
            rotateLeft: '左回転',
            hold: 'HOLD',
            pause: 'ポーズ'
        };
        return labels[action] || action;
    }
}

// ========================================
// 初期化
// ========================================
const game = new TetrisGame();
game.draw();
game.drawNext();
