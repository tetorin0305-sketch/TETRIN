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
const ARR_INTERVAL = 40;   // 連続移動の間隔 (ms)
const SOFT_DROP_INTERVAL = 10; // ソフトドロップ時の間隔 (ms)
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

// Seeded Random Number Generator (Xorshift)
class SeededRNG {
    constructor(seed) {
        this.seed = seed || Date.now();
    }

    // Returns a random number between 0 (inclusive) and 1 (exclusive)
    next() {
        // Simple Xorshift implementation
        let x = this.seed;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        this.seed = x;
        // Map to 0-1
        return (x >>> 0) / 4294967296;
    }
}

// ========================================
// キーバインド管理
// ========================================
class KeyBindings {
    constructor(playerIndex = 1) {
        this.playerIndex = playerIndex;
        this.defaultBindings = playerIndex === 1 ? {
            moveLeft: 'ArrowLeft',
            moveRight: 'ArrowRight',
            softDrop: 'ArrowDown',
            hardDrop: 'ArrowUp',         // Space → ArrowUp
            rotateRight: 'Space',        // ArrowUp → Space
            rotateLeft: 'KeyZ',
            hold: 'KeyC',
            hold2: 'ShiftLeft',
            pause: 'KeyP',
            reset: 'KeyR',
            returnToTitle: 'Escape'
        } : {
            // Player 2 default keyboard bindings (using WASD etc. or Numpad)
            moveLeft: 'KeyF',            // WASD/IJKL is common, but let's use something spread out
            moveRight: 'KeyH',
            softDrop: 'KeyG',
            hardDrop: 'KeyT',
            rotateRight: 'KeyY',
            rotateLeft: 'KeyR',
            hold: 'KeyU',
            hold2: 'KeyI',
            pause: 'F1',                 // Shared? Let's see
            reset: 'F2',
            returnToTitle: 'Escape'
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
            reset: 9,        // START (画像準拠)
            returnToTitle: 8 // SELECT (画像準拠)
        };
        this.loadBindings();
    }

    loadBindings() {
        try {
            const keySuffix = this.playerIndex === 1 ? '' : `_P${this.playerIndex}`;
            const savedKeys = localStorage.getItem(`tetrisKeyBindings${keySuffix}`);
            this.bindings = savedKeys ? { ...this.defaultBindings, ...JSON.parse(savedKeys) } : { ...this.defaultBindings };

            const savedGp = localStorage.getItem(`tetrisGamepadBindings${keySuffix}`);
            this.gamepadBindings = savedGp ? { ...this.defaultGamepadBindings, ...JSON.parse(savedGp) } : { ...this.defaultGamepadBindings };
        } catch (e) {
            this.bindings = { ...this.defaultBindings };
            this.gamepadBindings = { ...this.defaultGamepadBindings };
        }
    }

    saveBindings() {
        try {
            const keySuffix = this.playerIndex === 1 ? '' : `_P${this.playerIndex}`;
            localStorage.setItem(`tetrisKeyBindings${keySuffix}`, JSON.stringify(this.bindings));
            localStorage.setItem(`tetrisGamepadBindings${keySuffix}`, JSON.stringify(this.gamepadBindings));
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
// AudioStorage (IndexedDB Wrapper for large audio files)
// ========================================
class AudioStorage {
    constructor() {
        this.dbName = 'TetrisAudioDB';
        this.storeName = 'audioData';
        this.version = 1;
        this.db = null;
    }

    async init() {
        if (this.db) return;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    async set(key, value) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.put(value, key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async get(key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async delete(key) {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.delete(key);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clear() {
        await this.init();
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
}

// ========================================
// ゲーム設定管理 (DAS / ARR)
// ========================================
class GameSettings {
    constructor() {
        this.audioStorage = new AudioStorage();
        this.defaults = {
            dasDelay: 200,
            arrInterval: 40,
            bgType: 'preset',
            bgValue: 'default',
            practiceGravity: 1000,
            practiceLockDelay: 500,
            practiceInfiniteLockDelay: false,
            seVolume: 0.5,
            seMuted: false,
            bgmVolume: 0.3,
            bgmMuted: false,
            bgmType: 'retro',
            menuBgmType: 'lofi',
            softDropSpeed: 40,
            customMenuPlaylist: [], // [{name: string, data: string}] IndexedDBから読み込まれる
            customGamePlaylist: [], // [{name: string, data: string}] IndexedDBから読み込まれる
            customBgPlaylist: [],   // [{name: string, data: string}] IndexedDBから読み込まれる
            cpuLevel: 1,
            playerName: 'ななし'
        };
        this.loadSettings();
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('tetrisGameSettings');
            this.settings = saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
            // セキュリティと容量のためDataフィールドはLocalStorageから除去されるように運用する
            this.settings.customMenuPlaylist = [];
            this.settings.customGamePlaylist = [];
            this.settings.customBgPlaylist = [];
        } catch (e) {
            this.settings = { ...this.defaults };
        }
    }

    async loadAudioData() {
        try {
            const menuPlaylist = await this.audioStorage.get('customMenuPlaylist');
            const gamePlaylist = await this.audioStorage.get('customGamePlaylist');
            const bgPlaylist = await this.audioStorage.get('customBgPlaylist');
            this.settings.customMenuPlaylist = menuPlaylist || [];
            this.settings.customGamePlaylist = gamePlaylist || [];
            this.settings.customBgPlaylist = bgPlaylist || [];
        } catch (e) {
            console.error('Failed to load audio data from IndexedDB:', e);
        }
    }

    async saveSettings() {
        try {
            // Dataフィールドを除いた状態で保存
            const toSave = { ...this.settings };
            delete toSave.customMenuPlaylist;
            delete toSave.customGamePlaylist;
            delete toSave.customBgPlaylist;
            localStorage.setItem('tetrisGameSettings', JSON.stringify(toSave));

            // DataフィールドはIndexedDBに保存
            await this.audioStorage.set('customMenuPlaylist', this.settings.customMenuPlaylist);
            await this.audioStorage.set('customGamePlaylist', this.settings.customGamePlaylist);
            await this.audioStorage.set('customBgPlaylist', this.settings.customBgPlaylist);
        } catch (e) {
            console.error('Failed to save game settings:', e);
        }
    }

    async resetToDefaults() {
        this.settings = { ...this.defaults };
        await this.audioStorage.clear();
        await this.saveSettings();
    }

    set(key, value) {
        this.settings[key] = value;
    }

    get(key) {
        return this.settings[key];
    }
}

class SoundManager {
    constructor(settings) {
        this.settings = settings;
        this.audioCtx = null;
        this.masterGain = null;
        this.bgmGain = null;
        this.bgmFilter = null; // 追加: BGM用のフィルター
        this.isInitialized = false;

        // BGM Sequencer State
        this.bgmLoopId = null;
        this.bgmStep = 0;
        this.isPlayingBGM = false;
        this.bpm = 90;
        this.nextTickTime = 0;
        this.bgmContext = 'menu'; // 'menu' or 'game'

        // Custom BGM Audio Elements
        this.customMenuAudio = new Audio();
        this.customMenuAudio.loop = true;
        this.customGameAudio = new Audio();
        this.customGameAudio.loop = true;
    }

    init() {
        if (this.isInitialized) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.connect(this.audioCtx.destination);

            this.bgmGain = this.audioCtx.createGain();

            // BGM Filter for texture
            this.bgmFilter = this.audioCtx.createBiquadFilter();
            this.bgmFilter.type = 'lowpass';
            this.bgmFilter.frequency.value = 2000;

            this.bgmGain.connect(this.bgmFilter);
            this.bgmFilter.connect(this.audioCtx.destination);

            this.updateVolume();
            this.isInitialized = true;
        } catch (e) {
            console.error('Web Audio API is not supported', e);
        }
    }

    setBGMContext(context) {
        this.bgmContext = context;
    }

    updateVolume() {
        // Custom BGM Volume (Gainノードの状態に関わらず常に適用)
        const bgmVol = this.settings.get('bgmMuted') ? 0 : this.settings.get('bgmVolume');
        this.customMenuAudio.volume = bgmVol * 0.4;
        this.customGameAudio.volume = bgmVol * 0.4;
        this.customMenuAudio.muted = this.settings.get('bgmMuted');
        this.customGameAudio.muted = this.settings.get('bgmMuted');

        if (!this.masterGain || !this.bgmGain) return;

        // SE Volume
        const seVol = this.settings.get('seMuted') ? 0 : this.settings.get('seVolume');
        this.masterGain.gain.setTargetAtTime(seVol * 0.5, this.audioCtx.currentTime, 0.05);

        // BGM Volume (Gainノード用)
        this.bgmGain.gain.setTargetAtTime(bgmVol * 0.4, this.audioCtx.currentTime, 0.05);
    }

    async startBGM() {
        if (!this.isInitialized) this.init();
        if (this.isPlayingBGM) return;

        const type = this.bgmContext === 'menu'
            ? this.settings.get('menuBgmType')
            : this.settings.get('bgmType');

        if (type === 'custom') {
            const playlist = this.bgmContext === 'menu'
                ? this.settings.get('customMenuPlaylist')
                : this.settings.get('customGamePlaylist');

            const audio = this.bgmContext === 'menu' ? this.customMenuAudio : this.customGameAudio;

            if (playlist && playlist.length > 0) {
                // ランダムに曲を選択
                const randomIndex = Math.floor(Math.random() * playlist.length);
                const track = playlist[randomIndex];

                if (track && track.data) {
                    // すでに同じ曲を再生中なら何もしない
                    if (this.isPlayingBGM && audio.src === track.data && !audio.paused) return;

                    audio.src = track.data;
                    audio.loop = false; // プレイリスト再生のためループ無効

                    // 曲が終わったら次の曲へ (再帰的に呼び出し)
                    audio.onended = () => {
                        this.isPlayingBGM = false;
                        this.startBGM();
                    };

                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(e => {
                            if (e.name !== 'AbortError') {
                                console.error('Failed to play custom BGM', e);
                            }
                        });
                    }
                    this.isPlayingBGM = true;
                    return;
                }
            }
        }

        this.isPlayingBGM = true;
        this.bgmStep = 0;
        this.nextTickTime = this.audioCtx.currentTime;
        this._bgmLoop();
    }

    stopBGM() {
        this.isPlayingBGM = false;
        if (this.bgmLoopId) {
            cancelAnimationFrame(this.bgmLoopId);
            this.bgmLoopId = null;
        }
        this.customMenuAudio.pause();
        this.customGameAudio.pause();
    }

    _bgmLoop() {
        if (!this.isPlayingBGM) return;

        const lookAhead = 0.1; // 100ms 先までスケジュール
        while (this.nextTickTime < this.audioCtx.currentTime + lookAhead) {
            this._scheduleBGMStep(this.bgmStep, this.nextTickTime);

            // 次のステップの時間を計算 (16分音符)
            const secondsPerBeat = 60.0 / this.bpm;
            this.nextTickTime += 0.25 * secondsPerBeat;
            this.bgmStep = (this.bgmStep + 1) % 32; // 2小節ループ
        }

        this.bgmLoopId = requestAnimationFrame(() => this._bgmLoop());
    }

    _scheduleBGMStep(step, time) {
        const type = this.bgmContext === 'menu'
            ? (this.settings.get('menuBgmType') || 'lofi')
            : (this.settings.get('bgmType') || 'synthwave');

        switch (type) {
            case 'lofi':
                this._playLofiStep(step, time);
                break;
            case 'retro':
                this._playRetroStep(step, time);
                break;
            case 'happy':
                this._playHappyStep(step, time);
                break;
            case 'rave':
                this._playRaveStep(step, time);
                break;
            case 'tropical':
                this._playTropicalStep(step, time);
                break;
            case 'synthwave':
            default:
                this._playSynthwaveStep(step, time);
                break;
        }
    }

    _playSynthwaveStep(step, time) {
        // Synthwave: Driving bass and glassy lead
        this.bpm = 100;
        this.bgmFilter.frequency.setTargetAtTime(1500, time, 0.1);

        const chordBases = [32.7, 43.65, 36.71, 38.89]; // C1, F1, D1, Eb1
        const chordIndex = Math.floor(step / 8);
        const baseFreq = chordBases[chordIndex];

        // Driving Bass (8th notes)
        if (step % 2 === 0) {
            this._playBGMNote(baseFreq * 2, time, 0.15, 'sawtooth', 0.2, 0.01, 0.1);
        }

        // Arpeggio / Lead
        const scale = [0, 3, 7, 10, 12]; // Minor Pentatonic
        const melody = [0, 7, 12, 7, 3, 10, 7, 3];
        const note = melody[step % 8];
        const freq = baseFreq * 4 * Math.pow(2, note / 12);

        if (step % 4 === 0 || (step % 8 === 3) || (step % 8 === 7)) {
            this._playBGMNote(freq, time, 0.4, 'square', 0.1, 0.05, 0.3);
        }
    }

    _playLofiStep(step, time) {
        // Lo-fi Jazz: Soft Rhodes and steady rhythm
        this.bpm = 80;
        this.bgmFilter.frequency.setTargetAtTime(800, time, 0.1);

        const chords = [
            [261.63, 311.13, 392.00, 466.16], // Cm7
            [349.23, 415.30, 523.25, 622.25]  // Fm7
        ];
        const chordIndex = Math.floor(step / 16);
        const currentChord = chords[chordIndex];

        // Chord Stabs (Lazy rhythm)
        if (step === 0 || step === 6 || step === 16 || step === 22) {
            currentChord.forEach(f => {
                this._playBGMNote(f, time, 1.5, 'triangle', 0.15, 0.1, 1.0);
            });
        }

        // Walking Bass
        if (step % 4 === 0) {
            const bassFreq = currentChord[0] / 4;
            this._playBGMNote(bassFreq, time, 0.5, 'sine', 0.3, 0.05, 0.4);
        }

        // Random-ish Melodic bits
        const melody = [null, 7, null, 12, null, 10, 7, null];
        const note = melody[step % 8];
        if (note !== null) {
            const freq = currentChord[0] * Math.pow(2, note / 12);
            this._playBGMNote(freq, time, 0.8, 'sine', 0.1, 0.2, 0.6);
        }
    }

    _playRetroStep(step, time) {
        // 8-bit Retro: Fast arps and NES pulse
        this.bpm = 120;
        this.bgmFilter.frequency.setTargetAtTime(5000, time, 0.1); // No filter for retro

        const baseNotes = [261.63, 196.00, 220.00, 174.61]; // C4, G3, A3, F3
        const chordIndex = Math.floor(step / 8);
        const root = baseNotes[chordIndex];

        // Pulse Bass
        if (step % 4 === 0) {
            this._playBGMNote(root / 2, time, 0.1, 'square', 0.2, 0.01, 0.05);
        }

        // Fast Arpeggio (Chiptune style)
        const arpScale = [0, 4, 7, 12]; // Major Arp
        const arpNote = arpScale[step % 4];
        const arpFreq = root * Math.pow(2, arpNote / 12);
        this._playBGMNote(arpFreq, time, 0.05, 'square', 0.15, 0.005, 0.04);

        // Noise Snare (simplified)
        if (step % 8 === 4) {
            this._playBGMNote(100, time, 0.1, 'white', 0.1, 0.01, 0.08);
        }
    }

    _playHappyStep(step, time) {
        // Happy Pop: Bright major scale, bouncy triangle waves
        this.bpm = 124;
        this.bgmFilter.frequency.setTargetAtTime(3500, time, 0.1);
        const rootNotes = [261.63, 349.23, 392.00, 311.13];
        const root = rootNotes[Math.floor(step / 8)];
        if (step % 4 === 0) this._playBGMNote(root / 2, time, 0.2, 'triangle', 0.3, 0.02, 0.1);
        const scale = [0, 4, 7, 12, 14, 12, 7, 4];
        if (step % 2 === 0) this._playBGMNote(root * 2 * Math.pow(2, scale[step % 8] / 12), time, 0.15, 'sine', 0.15, 0.01, 0.05);
    }

    _playRaveStep(step, time) {
        // Techno Rave: High energy, sawtooth driving bass
        this.bpm = 145;
        this.bgmFilter.frequency.setTargetAtTime(1500, time, 0.1);
        this._playBGMNote(110, time, 0.08, 'sawtooth', 0.2, 0.01, 0.04);
        if (step % 2 === 1) this._playBGMNote(8000, time, 0.03, 'white', 0.1, 0.005, 0.01);
        if (step % 16 === 0 || step % 16 === 3 || step % 16 === 6) {
            [220, 275, 330].forEach(f => this._playBGMNote(f, time, 0.15, 'sawtooth', 0.08, 0.01, 0.1));
        }
    }

    _playTropicalStep(step, time) {
        // Tropical Beach: Steel drum feel with shaker
        this.bpm = 96;
        this.bgmFilter.frequency.setTargetAtTime(2800, time, 0.1);
        const root = [261.63, 349.23, 392.00, 349.23][Math.floor(step / 8)];
        if (step % 4 === 0) this._playBGMNote(root / 2, time, 0.4, 'sine', 0.3, 0.05, 0.2);
        if (step % 2 === 0) {
            const freq = root * Math.pow(2, [0, 4, 7, 12, 7, 4, 0, 7][step % 8] / 12);
            this._playBGMNote(freq, time, 0.25, 'triangle', 0.2, 0.01, 0.1);
            this._playBGMNote(freq * 3.01, time, 0.1, 'sine', 0.05, 0.01, 0.05);
        }
        if (step % 2 === 1) this._playBGMNote(6000, time, 0.02, 'white', 0.04, 0.005, 0.01);
    }

    _playBGMNote(freq, time, duration, type, volume, attack = 0.05, release = 0.3) {
        const osc = type === 'white' ? null : this.audioCtx.createOscillator();
        const noise = type === 'white' ? this.audioCtx.createBufferSource() : null;
        const gain = this.audioCtx.createGain();

        if (osc) {
            osc.type = type;
            osc.frequency.setValueAtTime(freq, time);
            osc.connect(gain);
        } else if (noise) {
            const bufferSize = this.audioCtx.sampleRate * 0.1;
            const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;
            noise.connect(gain);
        }

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(volume, time + attack);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        gain.connect(this.bgmGain);

        if (osc) {
            osc.start(time);
            osc.stop(time + duration);
        } else if (noise) {
            noise.start(time);
            noise.stop(time + duration);
        }
    }

    playTone(freq, type, attack, decay, sustain, release, volume = 1) {
        if (!this.isInitialized) this.init();
        if (this.settings.get('seMuted')) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        const now = this.audioCtx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + attack);
        gain.gain.exponentialRampToValueAtTime(sustain * volume, now + attack + decay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay + release);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + attack + decay + release);
    }

    // 高級感のある各種SE
    playMove() {
        this.playTone(600, 'sine', 0.005, 0.02, 0.1, 0.05, 0.2);
    }

    playRotate() {
        this.playTone(800, 'sine', 0.005, 0.03, 0.1, 0.05, 0.2);
    }

    playDrop() {
        this.playTone(150, 'sine', 0.005, 0.05, 0.1, 0.1, 0.4);
    }

    playHardDrop() {
        const now = this.audioCtx ? this.audioCtx.currentTime : 0;
        this.playTone(100, 'sine', 0.005, 0.1, 0.1, 0.2, 0.6);
        setTimeout(() => this.playTone(400, 'sine', 0.005, 0.05, 0.05, 0.1, 0.3), 20);
    }

    playLock() {
        // 接地音 (Standardize to match Hard Drop's "Solid" feel)
        const now = this.audioCtx ? this.audioCtx.currentTime : 0;
        this.playTone(100, 'sine', 0.005, 0.1, 0.1, 0.2, 0.6);
        setTimeout(() => this.playTone(400, 'sine', 0.005, 0.05, 0.05, 0.1, 0.3), 20);
    }

    playClear(lines, isBTB = false) {
        if (lines === 4) {
            // TETRIS: T-Spinと同じ音にする
            this.playTSpin(isBTB);
        } else {
            const chords = {
                1: [523.25, 659.25], // C5, E5 (Major)
                2: [523.25, 659.25, 783.99], // C5, E5, G5
                3: [523.25, 659.25, 783.99, 987.77] // C5, E5, G5, B5 (Major 7th)
            };
            const chord = chords[lines] || chords[1];
            chord.forEach((freq, i) => {
                setTimeout(() => {
                    this.playTone(freq, 'triangle', 0.01, 0.1, 0.3, 0.4, 0.2);
                }, i * 50);
            });
        }
    }

    playTSpin(isBTB = false) {
        // T-Spin: 特徴的な上昇アルペジオ（より豊かな音色）
        [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
            setTimeout(() => {
                const type = i % 2 === 0 ? 'triangle' : 'sine';
                this.playTone(freq, type, 0.02, 0.1, 0.4, 0.5, 0.4);
            }, i * 50);
        });

        if (isBTB) {
            // BTB T-Spin 演出: さらに高音のレイヤー
            setTimeout(() => {
                [1318.51, 1760].forEach((f, i) => {
                    this.playTone(f, 'sine', 0.05, 0.2, 0.3, 1.0, 0.2);
                });
            }, 150);
        }
    }

    playPerfectClear() {
        const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
        freqs.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.05, 0.2, 0.5, 1.0, 0.2);
            }, i * 100);
        });
    }

    playRecordBreak() {
        // T-SpinのSE（上昇アルペジオ）を含まず、キラキラした高音のみで構成
        [1046.50, 1318.51, 1567.98, 2093.00, 2637.02].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.03, 0.15, 0.4, 0.8, 0.25);
            }, i * 60);
        });
    }

    playRen(count) {
        const base = 261.63; // C4 (ド)
        const scale = [0, 2, 4, 5, 7, 9, 11]; // C Major scale semitone offsets

        // ピッチ（音程）は20 RENで制限する
        const pitchIndex = Math.min(count, 20) - 1;
        const octave = Math.floor(pitchIndex / 7);
        const noteIndex = pitchIndex % 7;
        const semitones = octave * 12 + scale[noteIndex];
        const freq = base * Math.pow(2, semitones / 12);

        // クリスタルベル調: 純粋な正弦波（Sine wave）を使用
        // アタックが鋭く、余韻が長い透明感のあるサウンド
        this.playTone(freq, 'sine', 0.002, 0.1, 0.01, 0.6, 0.8);
    }

    playCountdown(num) {
        const freq = num === 0 ? 880 : 440;
        this.playTone(freq, 'sine', 0.01, 0.05, 0.2, 0.2, 0.4);
    }

    playGameOver() {
        const now = this.audioCtx ? this.audioCtx.currentTime : 0;
        [440, 349.23, 293.66, 220].forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.02, 0.2, 0.2, 0.4, 0.3);
            }, i * 150);
        });
    }

    playVictory() {
        // 勝利ファンファーレ: C Major 9th (C5, E5, G5, B5, D6)
        [523.25, 659.25, 783.99, 987.77, 1174.66].forEach((freq, i) => {
            setTimeout(() => {
                const type = i === 4 ? 'sine' : 'triangle'; // 最後の一番高い音だけサイン波でキラキラさせる
                this.playTone(freq, type, 0.02, 0.1, 0.3, 0.8, 0.4);
            }, i * 80);
        });
    }

    playMenuClick() {
        this.playTone(1000, 'sine', 0.005, 0.02, 0.1, 0.05, 0.1);
    }

    playMenuMove() {
        this.playTone(1200, 'sine', 0.005, 0.01, 0.1, 0.03, 0.05);
    }
}

// ========================================
// ゲーム状態
// ========================================
class TetrisGame {
    constructor(settings = null, soundManager = null, elementPrefix = '') {
        this.instanceId = Math.random().toString(36).substring(7); // Debug ID


        // IDプレフィックス (例: 'p1-', 'p2-')
        this.prefix = elementPrefix;

        // 設定とサウンドマネージャーの解決
        if (settings && soundManager) {
            this.settings = settings;
            this.sounds = soundManager;
        } else {
            this.settings = new GameSettings();
            this.sounds = new SoundManager(this.settings);
        }

        // ゲームパッドインデックス
        this.gamepadIndex = null;
        this.inputEnabled = true; // 入力有効フラグ (CPUなどはfalseにする)
        this.opponent = null;     // 対戦相手のTetrisGameインスタンス
        this.garbageQueue = 0;    // 受け取った未消化のガベージライン数
        this.lastVersusHoleIndex = null; // 対戦モード用：直近のお邪魔穴位置を記録して直列化を制御
        this.aiFailCount = 0;     // AIの移動試行失敗数

        // DOM要素の解決
        this.canvas = this.getElement('game-canvas');
        this.holdCanvas = this.getElement('hold-canvas');
        this.nextCanvases = [];
        this.nextCtxs = [];
        for (let i = 0; i < 5; i++) {
            const canvas = this.getElement(`next-canvas-${i}`);
            if (canvas) {
                this.nextCanvases.push(canvas);
                this.nextCtxs.push(canvas.getContext('2d'));
            }
        }

        if (!this.canvas) {
            console.error(`Canvas not found with prefix "${this.prefix}"`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.holdCtx = this.holdCanvas.getContext('2d');

        this.countdownElement = this.getElement('countdown-overlay');
        this.isCountingDown = false;

        this.board = this.createBoard();
        this.currentPiece = null;
        this.currentX = 0;
        this.currentY = 0;
        this.currentRotation = 0;
        this.winningSets = 1;
        this.setsWon = 0;
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
        this.bestSurvival = 0;
        this.bestSurvivalSerial = 0;
        this.survivalType = 'normal';
        this.bestT20 = Infinity;
        this.garbageDelayBonus = 0;
        this.lastScoreBonusThreshold = 0;

        this.loadHighScores();

        this.dropInterval = INITIAL_SPEED;
        this.lastTime = 0;
        this.lockDelayCounter = 0;
        this.lockResetCount = 0;

        this.lastMoveWasRotation = false;

        this.keyBindings = new KeyBindings(this.prefix === 'p2-' ? 2 : 1);

        // RNG
        this.rng = new SeededRNG();

        this.particles = [];
        this.tspinTimeout = null;
        this.renTimeout = null;
        this.syncedApm = '0.00'; // Added for online APM sync
        this.garbageTimer = 0;
        this.garbageInterval = 10000;
        this.isGarbageWarning = false;

        this.keysState = {};
        this.dasTimer = 0;
        this.arrTimer = 0;
        this.softDropTimer = 0;
        this.lastAction = null;
        this.lastGamepadButtons = {};

        this.isMouseDown = false;
        this.dragMode = null;
        this.lastDraggedCell = { row: -1, col: -1 };
        this.uiClickLocked = false;

        // ランキング関連要素
        this.rankingModal = document.getElementById('ranking-modal');
        this.rankingListContainer = document.getElementById('ranking-list-container');
        this.closeRankingBtn = document.getElementById('close-ranking');
        this.showNationalRankingBtn = document.getElementById('show-national-ranking');

        this.menuNavigationEnabled = true;
        this.currentMenuIndex = 0;
        this.currentMenuItems = [];
        this.currentMenuContext = 'main';

        this.initializeNextQueue();
        this.applyBackground();
        this.updateMenuItems();
        this.setupEventListeners();
        if (this.prefix === '') {
            this.checkAutoJoin();
        }
        this.setupSettingsUI();

        this.sounds.setBGMContext('menu');
        this.sounds.updateVolume();

        // Online Game Start Listener (Main Instance Only)
        if (this.prefix === '') {
            window.addEventListener('networkGameStart', (e) => {
                // 重複イベントを防ぐためのガード
                const gameId = e.detail.roomId + '_' + e.detail.startTime;
                if (this.lastGameStartId === gameId) return;
                this.lastGameStartId = gameId;

                console.log('Starting Online Game', e.detail);

                // 既存のインスタンスをクリーンアップ
                if (this.p1) this.p1.isRunning = false;
                if (this.p2) this.p2.isRunning = false;

                // Hide Lobby or Setup Menu
                const lobbyMenu = document.getElementById('online-lobby-menu');
                const versusSetupMenu = document.getElementById('versus-setup-menu');
                if (lobbyMenu) lobbyMenu.style.display = 'none';
                if (versusSetupMenu) versusSetupMenu.style.display = 'none';

                // ゲームオーバー画面を即座に非表示にする
                const p1GameOver = document.getElementById('p1-game-over-overlay');
                const p2GameOver = document.getElementById('p2-game-over-overlay');
                if (p1GameOver) p1GameOver.classList.remove('active');
                if (p2GameOver) p2GameOver.classList.remove('active');

                // 再戦ボタン等の状態をリセット
                const restartBtn = document.getElementById('p1-restart-btn');
                const backBtn = document.getElementById('p1-back-btn');
                const statusEl = document.getElementById('p1-vs-status-message');
                if (restartBtn) {
                    restartBtn.disabled = false;
                    restartBtn.style.opacity = '1';
                }
                if (backBtn) {
                    backBtn.disabled = false;
                    backBtn.style.opacity = '1';
                }
                if (statusEl) {
                    statusEl.textContent = '';
                }

                // 1. Initialize P2 via toggleVersusMode FIRST
                this.toggleVersusMode(true, 'online');

                // Force Input Enabled for P1 (Fix for 2P freeze)
                if (this.p1) this.p1.inputEnabled = true;

                // 2. Sync Seed and Settings
                const seed = e.detail.seed;
                const settings = e.detail.settings || {};
                const startLevel = settings.level || 1;
                const winSets = settings.winningSets || 1;
                if (seed) {
                    // Main instance RNG (just in case)
                    this.rng = new SeededRNG(seed);

                    // Seed P1
                    if (this.p1) {
                        this.p1.rng = new SeededRNG(seed);
                        this.p1.bag = [];
                    }

                    // Seed P2
                    if (this.p2) {
                        this.p2.rng = new SeededRNG(seed);
                        this.p2.bag = [];
                    }
                    console.log(`Initialized RNG with seed: ${seed}`);

                    // Setup Winning Sets
                    if (this.p1) {
                        this.p1.winningSets = winSets;
                        this.p1.setsWon = 0;
                        this.p1.reset();
                        this.p1.isRunning = true;
                        this.p1.gameOver = false;
                    }
                    if (this.p2) {
                        this.p2.winningSets = winSets;
                        this.p2.setsWon = 0;
                        this.p2.reset();
                        this.p2.isRunning = true;
                        this.p2.gameOver = false;
                    }
                }

                // 2. Setup Loading Overlay
                const loadingOverlay = document.getElementById('versus-loading-overlay');
                if (loadingOverlay) loadingOverlay.style.display = 'flex';

                // 2.5 Explicitly Reset State Visuals BEFORE Countdown
                console.log(`[${this.prefix || 'MAIN'}] networkGameStart: Resetting P1/P2 instances`);
                [this.p1, this.p2].forEach((p, idx) => {
                    if (p) {
                        console.log(`[${this.prefix || 'MAIN'}] Resetting Player ${idx + 1}...`);
                        p.reset();
                        // Force clear canvas just in case context state is weird
                        p.ctx.clearRect(0, 0, p.canvas.width, p.canvas.height);
                        p.draw();

                        // Hide NEXT queue to avoid spoilers/mismatch before proper start
                        p.nextQueue = [];
                        p.drawNext();
                    }
                });

                // 3. Start Countdown (Synced)
                const startTime = e.detail.startTime;
                let delay = 0;

                if (startTime) {
                    const now = Date.now();
                    delay = Math.max(0, startTime - now);
                    console.log(`Synced start in ${delay}ms`);
                } else {
                    delay = 500; // Fallback
                }

                setTimeout(() => {
                    // Hide loading overlay before countdown starts
                    if (loadingOverlay) loadingOverlay.style.display = 'none';

                    // Orchestrate P1 and P2 countdowns
                    const p1Promise = this.p1 ? this.p1.startCountdown() : Promise.resolve();
                    const p2Promise = this.p2 ? this.p2.startCountdown() : Promise.resolve();

                    Promise.all([p1Promise, p2Promise]).then(() => {
                        // Start both games with synced settings
                        if (this.p1) this.p1.start('versus', 'normal', startLevel);
                        if (this.p2) this.p2.start('versus', 'normal', startLevel);
                    });
                }, delay);
            });

            if (this.prefix === '') {
                // Handle Opponent Disconnect
                window.addEventListener('networkPlayerLeft', () => {
                    if (this.gameMode === 'versus' && this.isRunning && !this.gameOver) {
                        this.showMessage('OPPONENT LEFT!', 'warning');
                        // Treat as win
                        this.showGameOver(true);
                    }
                });

                // Online Lobby List Update
                window.addEventListener('networkLobbyUpdate', (e) => {
                    this.updateLobbyUI(e.detail);
                });

                window.addEventListener('networkLobbyReturn', (e) => {
                    const data = e.detail;
                    const isOpponentInitiated = data && data.initiatorId && data.initiatorId !== window.networkManager.socket.id;

                    if (isOpponentInitiated) {
                        const statusEl = document.getElementById('p1-vs-status-message');
                        if (statusEl) {
                            statusEl.textContent = '対戦相手がルームに戻りました。';
                            statusEl.style.color = 'var(--accent-primary)';
                        }
                        this.showMessage('対戦相手がルームに戻る選択をしました。', 'warning');
                        // Give a moment for the user to read the message before transitioning
                        setTimeout(() => {
                            this.toggleVersusMode(false);
                        }, 2000);
                    } else {
                        this.toggleVersusMode(false);
                    }

                    const lobbyMenu = document.getElementById('online-lobby-menu');
                    if (lobbyMenu) lobbyMenu.style.display = 'flex';
                });

                window.addEventListener('networkOpponentRematch', () => {
                    const statusEl = document.getElementById('p1-vs-status-message');
                    // Only show if we haven't already requested a rematch ourselves
                    if (statusEl && statusEl.textContent !== '対戦相手の選択を待っています...') {
                        statusEl.textContent = '対戦相手が再戦を希望しています！';
                        statusEl.style.color = 'var(--accent-success)';
                    }
                    this.showMessage('OPPONENT WANTS A REMATCH!', 'info');
                });
            }
        }

        // ループを開始
        this.update();

        // BTB演出用
        this.btbPopTimeout = null;
        this.isDestroyed = false;

        // CPU AI用
        this.aiTargetX = null;
        this.aiTargetRotation = null;
        this.aiLastActionTime = 0;
        this.aiMoveDelay = 150; // 操作間隔(ms)
        this.aiState = 'idle'; // idle, thinking, moving, dropping

        // Line Clear Effect State
        this.isClearingLines = false;
        this.clearedWithEffectRows = [];

        // Online Sync State
        this.isOnlineRemote = false; // Is this instance a remote ghost?
        this.onlineRoomId = null;

        // Listener for remote events (only if this is p2 and online mode is active)
        if (this.prefix === 'p2-') {
            window.addEventListener('networkGameEvent', (e) => {
                this.handleNetworkEvent(e.detail);
            });
        }
    }

    isOnlineHost() {
        return window.networkManager && window.networkManager.isHost;
    }

    updateLobbyUI(data) {
        const lobbyMenu = document.getElementById('online-lobby-menu');
        const setupMenu = document.getElementById('versus-setup-menu');
        const roomIdEl = document.getElementById('lobby-room-id');
        const playerListEl = document.getElementById('lobby-player-list');
        const winSetsInput = document.getElementById('lobby-win-sets-input');
        const readyBtn = document.getElementById('lobby-ready-btn');
        const startBtn = document.getElementById('lobby-start-btn');

        if (!lobbyMenu || !playerListEl) return;

        // Transition to lobby if not already there
        if (lobbyMenu.style.display === 'none') {
            const mainMenu = document.getElementById('main-mode-select');
            const setupMenu = document.getElementById('versus-setup-menu');
            if (mainMenu) mainMenu.style.display = 'none';
            if (setupMenu) setupMenu.style.display = 'none';
            const controlsGuide = document.querySelector('.controls-guide');
            if (controlsGuide) controlsGuide.style.display = 'none';

            lobbyMenu.style.display = 'flex';
            this.currentMenuContext = 'online-lobby';
            if (typeof this.updateMenuItems === 'function') this.updateMenuItems();
        }

        if (roomIdEl) roomIdEl.textContent = `ROOM: ${data.roomId}`;

        if (winSetsInput) {
            winSetsInput.value = data.settings.winningSets || 1;
            winSetsInput.disabled = !this.isOnlineHost();
        }

        playerListEl.innerHTML = '';
        const myId = window.networkManager.socket.id;

        data.players.forEach(p => {
            const isMe = p.id === myId;
            const playerRow = document.createElement('div');
            playerRow.style.display = 'flex';
            playerRow.style.justifyContent = 'space-between';
            playerRow.style.padding = '12px';
            playerRow.style.background = isMe ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
            playerRow.style.borderRadius = '10px';
            playerRow.style.border = isMe ? '1px solid #00f0ff' : '1px solid #333';
            playerRow.style.fontFamily = "'Orbitron', sans-serif";
            playerRow.style.fontSize = "0.9em";

            const nameSpan = document.createElement('span');
            nameSpan.textContent = `${p.name}${isMe ? ' (YOU)' : ''}`;

            const statusSpan = document.createElement('span');
            if (p.index === 1) {
                statusSpan.textContent = 'HOST';
                statusSpan.style.color = '#00f0ff';
            } else {
                statusSpan.textContent = p.ready ? 'READY' : 'WAITING';
                statusSpan.style.color = p.ready ? '#00ff41' : '#ff0055';
            }

            playerRow.appendChild(nameSpan);
            playerRow.appendChild(statusSpan);
            playerListEl.appendChild(playerRow);
        });

        const isHost = this.isOnlineHost();
        if (readyBtn) {
            readyBtn.style.display = isHost ? 'none' : 'block';
            const myPlayer = data.players.find(p => p.id === myId);
            if (myPlayer) {
                readyBtn.textContent = myPlayer.ready ? '取り消し' : '準備完了';
                readyBtn.style.background = myPlayer.ready ? '#555' : '#ff0055';
            }
        }
        if (startBtn) {
            startBtn.style.display = isHost ? 'block' : 'none';
            const allReady = data.players.every(p => p.ready || p.index === 1);
            startBtn.disabled = !allReady || data.players.length < 2;
            startBtn.style.opacity = startBtn.disabled ? '0.5' : '1';
        }
    }

    // ========================================
    // ゲーム状態のリセット
    // ========================================
    reset() {
        this.board = this.createBoard();
        this.currentPiece = null;
        this.holdPiece = null;
        this.canHold = true;
        this.nextQueue = [];
        this.bag = [];
        this.score = 0;
        this.lines = 0;
        this.level = this.startLevel || 1;
        this.renCount = 0;
        this.totalAttacks = 0;
        this.totalReceivedAttacks = 0;
        this.isBackToBack = false;
        this.gameOver = false;
        this.isPaused = false;
        this.isRunning = false;
        this.dropInterval = INITIAL_SPEED;

        this.initializeNextQueue();
        this.updateScore();
        this.draw();
        this.drawNext();
        if (typeof this.drawHold === 'function') this.drawHold();

        // 対戦モードの場合はスコア表示を初期化
        if (this.gameMode === 'versus') {
            this.updateVersusScoreDisplay();
        }
    }

    updateVersusScoreDisplay() {
        if (this.gameMode !== 'versus') return;

        // P1とP2のインスタンスを特定（メインインスタンス経由）
        const main = window.game;
        if (!main) return;

        const p1 = main.p1;
        const p2 = main.p2;
        if (!p1 || !p2) return;

        const p1SetsEl = document.getElementById('vs-p1-sets');
        const p2SetsEl = document.getElementById('vs-p2-sets');
        const winTargetEl = document.getElementById('vs-win-target');

        if (p1SetsEl) p1SetsEl.textContent = p1.setsWon;
        if (p2SetsEl) p2SetsEl.textContent = p2.setsWon;
        if (winTargetEl) winTargetEl.textContent = p1.winningSets;
    }

    handleNetworkEvent(data) {
        if (!this.isRunning &&
            data.type !== 'gameStart' &&
            data.type !== 'rematch' &&
            data.type !== 'ready' &&
            data.type !== 'gameOver' &&
            data.type !== 'gameWinSync') return;

        try {
            switch (data.type) {
                case 'gameStart':
                    this.reset();
                    if (data.settings && data.settings.winningSets) {
                        this.winningSets = data.settings.winningSets;
                    }
                    this.setsWon = 0;
                    if (this.opponent) this.opponent.setsWon = 0;
                    this.isRunning = true;
                    this.isPaused = false;
                    this.gameOver = false;
                    if (this.readyOverlay) this.readyOverlay.style.display = 'none';
                    this.startCountdown();
                    break;
                case 'rematch':
                    if (window.networkManager) {
                        window.networkManager.isRematchPending = true;
                        window.networkManager.checkRematchStart();
                    }
                    break;
                case 'ready':
                    // Opponent is ready
                    break;
                case 'stateUpdate':
                    this.currentX = data.payload.x;
                    this.currentY = data.payload.y;
                    this.currentRotation = data.payload.rotation;
                    this.currentPiece = data.payload.piece; // Sync piece just in case
                    if (data.payload.holdPiece !== undefined) this.holdPiece = data.payload.holdPiece;
                    if (data.payload.nextQueue !== undefined) this.nextQueue = data.payload.nextQueue;
                    if (data.payload.score !== undefined) this.score = data.payload.score;
                    break;
                case 'pieceLocked':
                    if (data.payload.currentPiece !== undefined) {
                        this.currentPiece = data.payload.currentPiece;
                        this.currentX = data.payload.x;
                        this.currentY = data.payload.y;
                        this.currentRotation = data.payload.rotation;
                    } else {
                        this.spawnPiece();
                    }
                    this.board = data.payload.board;
                    if (data.payload.garbageQueue !== undefined) {
                        this.garbageQueue = data.payload.garbageQueue;
                    }
                    if (data.payload.score !== undefined) this.score = data.payload.score;
                    if (data.payload.lines !== undefined) this.lines = data.payload.lines;
                    if (data.payload.totalAttacks !== undefined) this.totalAttacks = data.payload.totalAttacks;
                    if (data.payload.apm !== undefined) this.syncedApm = data.payload.apm;

                    this.updateScore();
                    this.draw();
                    this.sounds.playLock();
                    break;
                case 'garbage':
                    if (data.payload.amount > 0) {
                        this.opponent.receiveGarbage(data.payload.amount);
                        this.opponent.showMessage(`ATTACKED! ${data.payload.amount}`, 'warning');
                    }
                    break;
                case 'gameOver':
                    console.log(`[${this.prefix || 'MAIN'}] handleNetworkEvent: Recv gameOver. Syncing final stats.`);
                    if (data.payload.score !== undefined) this.score = data.payload.score;
                    if (data.payload.lines !== undefined) this.lines = data.payload.lines;
                    if (data.payload.totalAttacks !== undefined) this.totalAttacks = data.payload.totalAttacks;
                    if (data.payload.apm !== undefined) this.syncedApm = data.payload.apm;
                    this.updateScore();
                    this.showGameOver(false); // Ghost dies
                    break;
                case 'gameWinSync':
                    console.log(`[${this.prefix || 'MAIN'}] handleNetworkEvent: Recv gameWinSync. Syncing final stats.`);
                    if (data.payload.score !== undefined) this.score = data.payload.score;
                    if (data.payload.lines !== undefined) this.lines = data.payload.lines;
                    if (data.payload.totalAttacks !== undefined) this.totalAttacks = data.payload.totalAttacks;
                    if (data.payload.apm !== undefined) this.syncedApm = data.payload.apm;
                    this.updateScore();
                    break;
            }
        } catch (e) {
            console.error(`[${this.prefix || 'MAIN'}] handleNetworkEvent ERROR:`, e);
        }
    }

    broadcastState() {
        if (this.gameMode === 'versus' && this.inputEnabled && window.networkManager) {
            const now = performance.now();
            if (this.lastBroadcastTime && now - this.lastBroadcastTime < 50) {
                return;
            }
            this.lastBroadcastTime = now;

            window.networkManager.sendGameEvent('stateUpdate', {
                x: this.currentX,
                y: this.currentY,
                rotation: this.currentRotation,
                piece: this.currentPiece,
                holdPiece: this.holdPiece // Added holdPiece sync
            });
        }
    }

    broadcastLock() {
        if (this.gameMode === 'versus' && this.inputEnabled && window.networkManager) {
            const timeInMinutes = this.elapsedTime / 60000;
            const currentApm = timeInMinutes > 0 ? (this.totalAttacks / timeInMinutes).toFixed(2) : '0.00';

            window.networkManager.sendGameEvent('pieceLocked', {
                board: this.board,
                score: this.score,
                lines: this.lines,
                garbageQueue: this.garbageQueue, // Sync the meter
                lastEffect: this.lastEffect,
                nextQueue: this.nextQueue, // Added nextQueue sync
                holdPiece: this.holdPiece,  // Added holdPiece sync
                apm: currentApm, // Added APM sync
                totalAttacks: this.totalAttacks, // Added totalAttacks sync
                // Add current piece info for immediate sync (Fix for queue desync)
                currentPiece: this.currentPiece,
                x: this.currentX,
                y: this.currentY,
                rotation: this.currentRotation
            });
            this.lastEffect = null;
        }
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
                this.bestT20 = highScores.t20 || Infinity;
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
                survivalSerial: this.bestSurvivalSerial,
                t20: this.bestT20
            };
            localStorage.setItem('tetrisHighScores', JSON.stringify(highScores));
        } catch (e) {
            console.error('Failed to save high scores:', e);
        }
    }

    updateBestDisplay() {
        const label = this.getElement('best-label');
        const value = this.getElement('best-value');
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
            case 't20':
                label.textContent = 'BEST TIME';
                value.textContent = (this.bestT20 === Infinity) ? '--:--.--' : this.formatTimeShort(this.bestT20);
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
            // Use seeded RNG
            const j = Math.floor(this.rng.next() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        return bag;
    }

    getHeights(board) {
        const heights = new Array(BOARD_WIDTH).fill(0);
        for (let x = 0; x < BOARD_WIDTH; x++) {
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                if (board[y][x]) {
                    heights[x] = BOARD_HEIGHT - y;
                    break;
                }
            }
        }
        return heights;
    }

    getSimulatedY(board, type, rotation, x) {
        const shape = TETROMINOS[type].shape[rotation];
        let y = 0;
        while (!this.checkCollisionWithBoard(board, x, y + 1, shape)) {
            y++;
        }
        return y;
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
        // 対戦・サバイバルモード: ピーススポーン時にガベージ処理（穴せり上がり）
        // オンラインのRemoteはネットワーク同期で盤面更新されるため、ここでは実行しない
        if ((this.gameMode === 'versus' || this.gameMode === 'survival') && this.garbageQueue > 0 && !this.isOnlineRemote) {
            this.addGarbageLine();
        }

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
        this.currentPieceActualMoves = 0; // Reset input count for Practice Mode stats
        this.currentPieceHasUsedSoftDrop = false; // Reset soft drop usage flag

        if (this.checkCollision(this.currentX, this.currentY, this.currentRotation)) {
            // Online Remoteの場合、ローカルで勝手にGameOverにしない
            // サーバーからの 'gameOver' イベントを待つ
            if (!this.isOnlineRemote) {
                this.gameOver = true;
                this.showGameOver();
            }
        }



        // CPU AI用の状態リセット
        if (!this.inputEnabled) {
            this.aiState = 'idle';
            this.aiLastActionTime = 0;
            // レベルに応じて操作速度を調整 (高レベルでも視認可能な速さ)
            // Lv1: 150ms, Lv10: 40ms
            this.aiMoveDelay = Math.max(40, 150 - (this.level - 1) * 12);
        }

        this.drawNext();
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
            this.sounds.playMove(); // SE
            this.broadcastState(); // Broadcast
            // 移動前後のいずれかが接地状態であれば猶予をリセット（通算回数制限あり）
            const isOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
            if (wasOnGround || isOnGround) {
                const isInfiniteLock = this.gameMode === 'practice' && this.settings.get('practiceInfiniteLockDelay');
                if (isInfiniteLock) {
                    this.lockDelayCounter = 0;
                } else if (this.lockResetCount < MAX_LOCK_RESET) {
                    this.lockDelayCounter = 0;
                    this.lockResetCount++;
                } else if (isOnGround) {
                    // 既に上限に達した状態で接地したなら即座に固定
                    this.mergePiece();
                    this.sounds.playLock();
                    if (!this.clearLines()) {
                        this.spawnPiece();
                        this.broadcastLock();
                    }
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
            this.sounds.playMove(); // SE
            this.broadcastState(); // Broadcast
            // 移動前後のいずれかが接地状態であれば猶予をリセット（通算回数制限あり）
            const isOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
            if (wasOnGround || isOnGround) {
                const isInfiniteLock = this.gameMode === 'practice' && this.settings.get('practiceInfiniteLockDelay');
                if (isInfiniteLock) {
                    this.lockDelayCounter = 0;
                } else if (this.lockResetCount < MAX_LOCK_RESET) {
                    this.lockDelayCounter = 0;
                    this.lockResetCount++;
                } else if (isOnGround) {
                    // 既に上限に達した状態で接地したなら即座に固定
                    this.mergePiece();
                    if (!this.clearLines()) {
                        this.spawnPiece();
                        this.broadcastLock();
                    }
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
            this.broadcastState(); // Broadcast

            // Mark Soft Drop usage (if this method call came from Soft Drop input, handled via caller, but moveDown is also gravity)
            // But wait, moveDown is called by Gravity too. We need to set the flag ONLY on input.
            // See handleButtonDown change below.

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
        if (this.currentPiece === 'O') {
            // Oミノは物理的には回転しないが、AIの状態管理のために回転インデックスだけは更新する
            this.currentRotation = (this.currentRotation + direction + 4) % 4;
            this.broadcastState();
            return true;
        }

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
                this.lastRotateWasKick = (dx !== 0 || dy !== 0); // Track if this was a wall kick
                this.sounds.playRotate(); // SE

                // 回転前後のいずれかが接地状態、あるいは上方へのキックが発生した場合は猶予をリセット（通算回数制限あり）
                const isOnGround = this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation);
                if (wasOnGround || isOnGround || isUpwardKick) {
                    const isInfiniteLock = this.gameMode === 'practice' && this.settings.get('practiceInfiniteLockDelay');
                    if (isInfiniteLock) {
                        this.lockDelayCounter = 0;
                    } else if (this.lockResetCount < MAX_LOCK_RESET) {
                        this.lockDelayCounter = 0;
                        this.lockResetCount++;
                    } else if (isOnGround) {
                        // 既に上限に達した状態で接地したなら即座に固定
                        this.mergePiece();
                        this.sounds.playLock();
                        if (!this.clearLines()) {
                            this.spawnPiece();
                        }
                        this.lockDelayCounter = 0;
                    }
                }
                return true;
            }
        }
        return false;
    }

    rotateRight() { return this.rotate(1); }
    rotateLeft() { return this.rotate(-1); }

    hardDrop() {
        let dropDistance = 0;
        while (!this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation)) {
            this.currentY++;
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.updateScore();
        this.sounds.playHardDrop(); // SE
        this.mergePiece();
        if (!this.clearLines()) {
            this.spawnPiece();
            this.broadcastLock();
        }
    }

    hold() {
        if (!this.canHold) return;

        this.canHold = false;

        if (this.holdPiece === null) {
            this.holdPiece = this.currentPiece;
            this.spawnPiece();
            this.canHold = false; // spawnPiece() で true に戻ってしまうため、ここで再度 false に設定
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
        this.sounds.playMenuMove(); // SE
        this.broadcastState();
    }

    // ========================================
    // ボード操作
    // ========================================
    mergePiece() {
        if (!this.currentPiece) return;

        if (this.gameMode === 'practice' || this.gameMode === '40lines') {
            // Filter: If Soft Drop was used, we skip this piece's stats (per user request)
            if (!this.currentPieceHasUsedSoftDrop) {
                // Check for Equivalent States (Symmetry) and find absolute minimum inputs
                const equivalentStates = this.getEquivalentStates(this.currentPiece, this.currentX, this.currentY, this.currentRotation);
                // Calculate for current state first
                let minOptimal = this.calculateFinesse(this.currentPiece, this.currentRotation, this.currentX, this.currentY);

                for (const state of equivalentStates) {
                    // Start BFS for the alternative target state
                    const cost = this.calculateFinesse(this.currentPiece, state.r, state.x, state.y);

                    if (cost < minOptimal) {
                        minOptimal = cost;
                    }
                }
                let optimalMoves = minOptimal;

                // Wall Kick Success Logic (User Request): 
                if (this.lastMoveWasRotation && this.lastRotateWasKick) {
                    optimalMoves = this.currentPieceActualMoves;
                }

                // Metric Switch: Piece Success Rate (Successful Counts / Total Counts)
                this.totalPieces++;

                // If actual moves are within optimal range (taking <= optimal is perfect)
                if (this.currentPieceActualMoves <= optimalMoves) {
                    this.perfectPieces++;
                }

                if (this.totalPieces > 0) {
                    this.optimizationRate = (this.perfectPieces / this.totalPieces) * 100;

                    const optRateElem = document.getElementById('optimization-rate');
                    if (optRateElem) {
                        optRateElem.textContent = `${this.optimizationRate.toFixed(1)}%`;
                    }
                }
            }
        }

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

    // Identifies other (x, y, rot) states that result in the exact same block occupation
    getEquivalentStates(type, x, y, r) {
        const states = [];
        // SRS Offsets for Symmetry
        if (type === 'I') {
            // 0 <-> 2: (x, y, 0) == (x, y-1, 2)
            if (r === 0) states.push({ x: x, y: y - 1, r: 2 });
            if (r === 2) states.push({ x: x, y: y + 1, r: 0 });
            // 1 <-> 3: (x, y, 1) == (x+1, y, 3)
            if (r === 1) states.push({ x: x + 1, y: y, r: 3 });
            if (r === 3) states.push({ x: x - 1, y: y, r: 1 });
        } else if (type === 'S' || type === 'Z') {
            // 0 <-> 2: (x, y, 0) == (x, y-1, 2)
            if (r === 0) states.push({ x: x, y: y - 1, r: 2 });
            if (r === 2) states.push({ x: x, y: y + 1, r: 0 });
            // 1 <-> 3: (x, y, 1) == (x+1, y, 3)
            if (r === 1) states.push({ x: x + 1, y: y, r: 3 });
            if (r === 3) states.push({ x: x - 1, y: y, r: 1 });
        } else if (type === 'O') {
            // All rotations are same (O piece doesn't move in SRS usually, strictly 0==1==2==3 at same X,Y)
            for (let i = 0; i < 4; i++) {
                if (i !== r) states.push({ x: x, y: y, r: i });
            }
        }
        return states;
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

    createExplosion(boardX, boardY, color, count = 3) {
        // DOM要素を使用したパーティクル生成（オーバーレイの上に表示するため）
        // 画面中央を取得
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const colors = ['#ff0055', '#00f0ff', '#ffeb3b', '#00ff41', '#b300ff', '#ff6d00'];

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            const size = 5 + Math.random() * 8; // サイズを少し大きく (5-13px)
            const particleColor = colors[Math.floor(Math.random() * colors.length)];

            // スタイル設定
            p.style.position = 'fixed';
            p.style.left = `${centerX + (Math.random() - 0.5) * 50}px`; // 範囲も少しだけ緩和
            p.style.top = `${centerY + (Math.random() - 0.5) * 50}px`;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.backgroundColor = particleColor;
            p.style.borderRadius = '50%';
            p.style.zIndex = '100000'; // 最前面
            p.style.pointerEvents = 'none'; // クリック阻害しない
            p.style.boxShadow = `0 0 8px ${particleColor}`; // 光彩も少し戻す

            document.body.appendChild(p);

            // ランダムな方向へ拡散
            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 300; // 移動距離
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 200; // 少し上向きに

            // Web Animations APIでアニメーション
            const animation = p.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
            ], {
                duration: 200 + Math.random() * 300, // 0.2~0.5秒（さらに短縮）
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });

            animation.onfinish = () => {
                p.remove();
            };
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
        this.particles.forEach(p => {
            // 影を追加
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;

            // パーティクル本体
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = Math.min(1.0, p.life * 1.5); // より不透明に
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();

            // 白い縁取りを追加（より目立つように）
            this.ctx.strokeStyle = 'rgba(255, 255, 255, ' + (p.life * 0.8) + ')';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });

        // リセット
        this.ctx.globalAlpha = 1.0;
        this.ctx.shadowBlur = 0;
    }

    clearLines() {
        this.lastEffect = null; // Reset effect data
        // 1. Check if lines exist (without modifying board yet)
        const hasLines = this.board.some(row => row.every(cell => cell !== 0));
        if (!hasLines) {
            this.renCount = 0; // Reset REN count
            // REN4 mode: Game Over if no lines are cleared
            if (this.gameMode === 'ren4') {
                this.showGameOver();
                return true; // Return true to prevent spawnPiece() in caller
            }
            return false;
        }

        // 2. Analyze clearance (Pre-calculation for Effect/Sound)
        const clearedRows = [];
        for (let row = BOARD_HEIGHT - 1; row >= 0; row--) {
            if (this.board[row].every(cell => cell !== 0)) {
                clearedRows.push(row);
            }
        }
        const linesCleared = clearedRows.length;

        // T-spin detection
        const baseTSpinType = (this.currentPiece === 'T' && this.lastMoveWasRotation) ? this.getBaseTSpinType() : null;
        let finalTSpin = null;
        if (baseTSpinType) {
            if (linesCleared === 3) finalTSpin = 'T-SPIN-TRIPLE';
            else if (linesCleared === 2) finalTSpin = 'T-SPIN-DOUBLE';
            else if (linesCleared === 1) {
                finalTSpin = (baseTSpinType === 'NORMAL') ? 'T-SPIN-SINGLE' : 'T-SPIN-MINI';
            } else if (linesCleared === 0) { // Should not happen here since we checked hasLines
                finalTSpin = (baseTSpinType === 'NORMAL') ? 'T-SPIN' : 'T-SPIN-MINI';
            }
        }

        // Perfect Clear detection
        // Check if all cells NOT in clearedRows are empty
        let isPerfectClear = true;
        for (let row = 0; row < BOARD_HEIGHT; row++) {
            if (clearedRows.includes(row)) continue; // This row will be cleared
            if (this.board[row].some(cell => cell !== 0)) {
                isPerfectClear = false;
                break;
            }
        }

        // REN prediction
        const predictedRenCount = this.renCount + 1;

        // 3. Play Sounds & Show Notifications IMMEDIATELY
        if (finalTSpin) {
            this.showTSpinNotification(finalTSpin);
            this.sounds.playTSpin(this.isBackToBack);
        } else if (linesCleared > 0) {
            if (linesCleared === 4) {
                this.showTSpinNotification('TETRIS');
                this.sounds.playClear(4, this.isBackToBack);
            } else {
                this.sounds.playClear(linesCleared);
            }
        }

        if (predictedRenCount > 1) {
            this.showRenNotification(predictedRenCount - 1);
            this.sounds.playRen(predictedRenCount - 1);
        }

        if (isPerfectClear) {
            this.showPerfectClearNotification();
            this.sounds.playPerfectClear();
        }

        if (this.isBackToBack && (linesCleared === 4 || finalTSpin)) {
            this.showBTBNotification();
        }

        // Store effect for networking
        this.lastEffect = {
            tspin: finalTSpin,
            lines: linesCleared,
            ren: predictedRenCount - 1,
            pc: isPerfectClear,
            btb: this.isBackToBack
        };

        // 4. Setup effect state
        this.isClearingLines = true;
        this.clearedWithEffectRows = clearedRows;

        // 5. Delay execution
        setTimeout(() => {
            this.finalizeClearLines();
        }, 100);

        return true;
    }

    finalizeClearLines() {
        let linesCleared = 0;
        let clearedRows = [];
        const wasBTB = this.isBackToBack; // 以前のBTB状態を保持

        // T-spin検出（ライン削除前、かつ現在の状態を保持）
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

        // T-spinの最終判定
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
                this.lines = 40;
                this.updateScore();
                this.finish40Lines();
                // 終了時はスパウンしないようにリセット
                this.isClearingLines = false;
                this.clearedWithEffectRows = [];
                return;
            }

            // T20 Sprintモード判定
            if (this.gameMode === 't20') {
                if (baseTSpinType) {
                    // T-Spinのみライン加算済み
                } else {
                    this.lines -= linesCleared;
                }

                if (this.lines >= 20) {
                    this.lines = 20;
                    this.updateScore();
                    this.finish40Lines();
                    this.isClearingLines = false;
                    this.clearedWithEffectRows = [];
                    return;
                }
            }

            // REN管理
            let actualRen = 0;
            if (linesCleared > 0) {
                this.renCount++;
                actualRen = Math.max(0, this.renCount - 1);
                if (actualRen > this.maxRen) this.maxRen = actualRen;
            }

            clearedRows.forEach(rowY => {
                this.createParticles(BOARD_WIDTH * BLOCK_SIZE / 2, rowY * BLOCK_SIZE, '#ffffff', 15);
            });

            const scoreLevel = this.gameMode === 'survival' ? Math.min(this.level, 12) : this.level;
            let baseScore = 0;
            let attack = 0;

            if (finalTSpin) {
                const tSpinScores = {
                    'T-SPIN-MINI': linesCleared === 0 ? 100 : 200,
                    'T-SPIN': 400,
                    'T-SPIN-SINGLE': 800,
                    'T-SPIN-DOUBLE': 1200,
                    'T-SPIN-TRIPLE': 1600
                };
                baseScore = (tSpinScores[finalTSpin] || 0) * scoreLevel;

                if (finalTSpin === 'T-SPIN-SINGLE') attack = 2;
                else if (finalTSpin === 'T-SPIN-DOUBLE') attack = 4;
                else if (finalTSpin === 'T-SPIN-TRIPLE') attack = 6;
                else if (finalTSpin === 'T-SPIN-MINI' && linesCleared > 0) attack = 1;

                if (linesCleared > 0) {
                    if (this.isBackToBack) attack += 1;
                    this.isBackToBack = true;
                }
            } else if (linesCleared > 0) {
                const lineScores = [0, 100, 300, 500, 800];
                baseScore = lineScores[linesCleared] * scoreLevel;

                if (linesCleared === 4) {
                    attack = 4;
                    if (this.isBackToBack) attack += 1;
                    this.isBackToBack = true;
                } else {
                    attack = [0, 0, 1, 2, 4][linesCleared];
                    this.isBackToBack = false;
                }
            }

            this.score += baseScore;

            if (linesCleared > 0 && this.renCount > 1) {
                const comboAttack = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5];
                attack += comboAttack[Math.min(this.renCount, comboAttack.length - 1)];
                const renBonus = actualRen * 50 * scoreLevel;
                this.score += renBonus;
            }

            // パーフェクトクリア判定
            const isPerfectClear = this.board.every(row => row.every(cell => cell === 0));
            if (isPerfectClear) {
                this.score += 3000 * scoreLevel;
                // PC火力を固定10ラインにする（テトリスPCやRENPCでも10固定）
                attack = 10;
            }

            this.totalAttacks += attack;

            // 相殺
            if ((this.gameMode === 'versus' || this.gameMode === 'survival') && this.garbageQueue > 0 && attack > 0) {
                const offset = Math.min(this.garbageQueue, attack);
                this.garbageQueue -= offset;
                attack -= offset;
                if (offset > 0) {
                    this.showMessage(`CANCEL! -${offset}`, 'info');
                }
            }

            // 対戦相手にガベージを送信
            if (this.opponent && attack > 0) {
                // Local update (for visual feedback or local versus)
                this.opponent.receiveGarbage(attack);

                // Online Broadcast
                if (window.networkManager && this.gameMode === 'versus' && this.prefix !== 'p2-') {
                    window.networkManager.sendGameEvent('garbage', { amount: attack });
                }

                this.showMessage(`ATTACK! ${attack} LINES`, 'info');
            }

            if (this.gameMode !== 'survival' && this.gameMode !== 'versus') {
                const newLevel = Math.floor(this.lines / 10) + 1;
                if (newLevel > this.level) {
                    this.level = newLevel;
                    this.dropInterval = INITIAL_SPEED * Math.pow(SPEED_DECREASE_RATE, this.level - 1);
                }
            } else if (this.gameMode === 'versus') {
                const newLevel = Math.floor(this.lines / 10) + 1;
                if (newLevel > this.level) {
                    this.level = newLevel;
                }
            }

            this.updateScore();

        } else {
            if (this.gameMode === 'ren4') {
                this.showGameOver();
                // DO NOT spawn or resume if game over
                this.isClearingLines = false;
                this.clearedWithEffectRows = [];
                return;
            } else {
                this.renCount = 0;
                this.updateScore();
            }
        }

        // Finish cleanup and resume
        this.isClearingLines = false;
        this.clearedWithEffectRows = [];
        this.spawnPiece();
        this.broadcastLock(); // Broadcast AFTER clear and spawn
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

        // Clearing Effect: Draw Glow
        if (this.isClearingLines) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.clearedWithEffectRows.forEach(row => {
                const drawY = row - (BOARD_HEIGHT - VISIBLE_HEIGHT);
                // 可視範囲内なら描画 (チラ見せ含む)
                if (drawY >= -1) {
                    const y = (drawY + (DISPLAY_OFFSET / BLOCK_SIZE)) * BLOCK_SIZE;
                    this.ctx.fillRect(0, y, this.canvas.width, BLOCK_SIZE);
                }
            });
        }

        // ゴーストピースを描画
        if (!this.isClearingLines) {
            this.drawGhost();
        }

        // 現在のピースを描画
        if (this.currentPiece && !this.isClearingLines) {
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

    getBoardPosFromMouseEvent(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / BLOCK_SIZE);
        const row = Math.floor((y - DISPLAY_OFFSET) / BLOCK_SIZE) + (BOARD_HEIGHT - VISIBLE_HEIGHT);

        if (col >= 0 && col < BOARD_WIDTH && row >= 0 && row < BOARD_HEIGHT) {
            return { row, col };
        }
        return null;
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
        if (this.nextCtxs && this.nextCanvases) {
            // シングルモード: 既存のcanvasに描画
            for (let i = 0; i < 5; i++) {
                if (this.nextCtxs[i] && this.nextCanvases[i]) {
                    this.drawPieceOnCanvas(
                        this.nextCtxs[i],
                        this.nextQueue[i],
                        this.nextCanvases[i].width,
                        this.nextCanvases[i].height,
                        0.85
                    );
                }
            }
        }
    }

    // ========================================
    // UI更新
    // ========================================
    // ========================================
    // UI更新
    // ========================================
    updateScore() {
        if (this.getElement('score')) this.getElement('score').textContent = this.score;
        if (this.getElement('level')) this.getElement('level').textContent = this.level;
        if (this.getElement('lines')) this.getElement('lines').textContent = this.lines;
        if (this.getElement('ren')) this.getElement('ren').textContent = Math.max(0, this.renCount - 1);
        if (this.getElement('time')) this.getElement('time').textContent = this.formatTime(this.elapsedTime);
        if (this.getElement('garbage-pending')) this.getElement('garbage-pending').textContent = this.totalAttacks;

        // APMの表示
        const sentApmElement = this.getElement('apm');
        const recvApmElement = this.getElement('recv-apm');

        if (this.isOnlineRemote) {
            if (sentApmElement) sentApmElement.textContent = this.syncedApm;
        } else if (this.elapsedTime > 0) {
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

        // ガベージメーターの更新
        const garbageFill = this.getElement('garbage-meter-fill');
        if (garbageFill) {
            const maxVisibleLines = 12; // メーターが満タンになる行数
            const percentage = Math.min(this.garbageQueue / maxVisibleLines, 1) * 100;
            garbageFill.style.height = `${percentage}%`;

            // 溜まっている量に応じて色を変える演出
            if (this.garbageQueue >= 8) {
                garbageFill.style.background = 'linear-gradient(to top, #ff0000, #ff4400)';
                garbageFill.style.boxShadow = '0 0 15px rgba(255, 0, 0, 0.8)';
            } else {
                garbageFill.style.background = 'linear-gradient(to top, #ff0044, #ff6b00)';
                garbageFill.style.boxShadow = '0 0 8px rgba(255, 0, 85, 0.6)';
            }
        }
        // リアルタイムでベスト記録を表示に反映
        this.updateBestDisplay();

        // サバイバルモードのスコアボーナスチェック (10,000点ごと)
        if (this.gameMode === 'survival' && !this.gameOver) {
            const currentThreshold = Math.floor(this.score / 10000);
            if (currentThreshold > this.lastScoreBonusThreshold) {
                const bonusCount = currentThreshold - this.lastScoreBonusThreshold;
                this.garbageDelayBonus += bonusCount * 1000; // 1秒追加
                this.lastScoreBonusThreshold = currentThreshold;

                // ボーナス演出（複数同時に超えた場合も考慮）
                const totalDelaySec = (this.garbageDelayBonus / 1000).toFixed(1);
                this.showTSpinNotification(`SURVIVAL BONUS! +${(bonusCount * 1.0).toFixed(1)}s DELAY`);

                // 即座に現在のインターバルに反映させるため再計算
                this.garbageInterval = Math.max(1000, 10000 - (this.level - 1) * 500 + this.garbageDelayBonus);
            }
        }
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
    }

    finish40Lines() {
        const notification = this.getElement('tspin-notification');
        if (notification) {
            notification.className = 'tspin-notification show perfect-clear';
            notification.textContent = 'FINISH!';
        }
        this.showGameOver(true);

        // 全国ランキングに送信
        if (this.gameMode === '40lines') {
            this.submitScoreToSupabase('40lines', this.elapsedTime);
        } else if (this.gameMode === 't20') {
            this.submitScoreToSupabase('t20', this.elapsedTime);
        }
    }

    showGameOver(isWin = false) {
        if (!this.isRunning) return;

        // ライン消去アニメーション中の場合、強制的にスコアを確定させる
        if (this.isClearingLines) {
            this.finalizeClearLines();
            // finalizeClearLines 内、またはそこから呼ばれる処理で既に game over 状態になった場合は中断
            if (!this.isRunning) return;
        }

        console.log(`[${this.prefix || 'MAIN'}] showGameOver: isWin=${isWin}, isRunning=${this.isRunning}`);

        this.isRunning = false;
        this.gameOver = true;
        this.setClickLock(500);

        // 対戦相手もロックする
        if (this.gameMode === 'versus' && this.opponent) {
            this.opponent.setClickLock(500);
        }
        this.sounds.stopBGM();

        // Sound only for local player
        if (!this.isOnlineRemote) {
            if (isWin) {
                this.sounds.playVictory();
            } else {
                this.sounds.playGameOver();
            }
        }

        if (isWin) {
            // ... score submission if needed ...
        }

        // 全国ランキングに送信
        if (this.gameMode === 'marathon') {
            this.submitScoreToSupabase('marathon', this.score);
        } else if (this.gameMode === 'ren4') {
            this.submitScoreToSupabase('ren4', this.maxRen);
        }

        // 対戦モード用ロジック
        if (this.gameMode === 'versus') {
            console.log(`[${this.prefix || 'MAIN'}] showGameOver (Versus Logic Start)`);
            const overlay = this.getElement('game-over-overlay');
            const gameOverTitle = this.getElement('game-over-title');
            const statsContainer = this.getElement('final-stats-container');
            const shareXBtn = this.getElement('share-x-btn');

            console.log(`[${this.prefix || 'MAIN'}] Elements: overlay=${!!overlay}, title=${!!gameOverTitle}`);

            if (isWin) {
                this.setsWon++;
                console.log(`[${this.prefix || 'MAIN'}] Set Won! Current sets: ${this.setsWon}/${this.winningSets}`);

                if (gameOverTitle) {
                    gameOverTitle.textContent = this.setsWon >= this.winningSets ? 'MATCH WINNER!' : 'SET WON!';
                    gameOverTitle.style.color = '#00f0ff';
                    gameOverTitle.style.fontSize = '3rem';
                }

                // Online Broadcast: I won this set
                if (window.networkManager && this.gameMode === 'versus' && !this.isOnlineRemote) {
                    this.updateScore(); // 最新の状態に更新 (APM等)
                    const timeInMinutes = this.elapsedTime / 60000;
                    const currentApm = timeInMinutes > 0 ? (this.totalAttacks / timeInMinutes).toFixed(2) : '0.00';
                    window.networkManager.sendGameEvent('gameWinSync', {
                        score: this.score,
                        lines: this.lines,
                        totalAttacks: this.totalAttacks,
                        apm: currentApm
                    });
                }
            } else {
                if (gameOverTitle) {
                    gameOverTitle.textContent = (this.opponent && this.opponent.setsWon + 1 >= this.winningSets) ? 'MATCH LOST' : 'SET LOST';
                    gameOverTitle.style.color = '#ff3d00';
                    gameOverTitle.style.fontSize = '3rem';
                }

                // Online Broadcast: I lost this set
                if (window.networkManager && this.gameMode === 'versus' && !this.isOnlineRemote) {
                    console.log(`[${this.prefix || 'MAIN'}] Broadcasting gameOver (Set Lost) with final stats`);
                    this.updateScore(); // 最新の状態に更新 (APM等)
                    const timeInMinutes = this.elapsedTime / 60000;
                    const currentApm = timeInMinutes > 0 ? (this.totalAttacks / timeInMinutes).toFixed(2) : '0.00';

                    window.networkManager.sendGameEvent('gameOver', {
                        setsWon: this.setsWon,
                        score: this.score,
                        lines: this.lines,
                        totalAttacks: this.totalAttacks,
                        apm: currentApm
                    });
                }

                // 自分が負けた場合、相手を勝たせる (Local/CPU/OnlineRemote Ghost)
                if (this.opponent && this.opponent.isRunning) {
                    console.log(`[${this.prefix || 'MAIN'}] Forcing opponent set win`);
                    this.opponent.showGameOver(true);
                }
            }

            // グローバルなセットスコア表示を更新
            this.updateVersusScoreDisplay();

            // マッチ終了判定
            const matchOver = this.setsWon >= this.winningSets || (this.opponent && this.opponent.setsWon >= this.winningSets);

            if (statsContainer) {
                const p1Sets = this.prefix === '' ? this.setsWon : (this.opponent ? this.opponent.setsWon : 0);
                const p2Sets = this.prefix !== '' ? this.setsWon : (this.opponent ? this.opponent.setsWon : 0);
                statsContainer.innerHTML = `
                    <div style="font-size: 2rem; font-family: 'Orbitron', sans-serif; color: #fff; margin: 10px 0;">
                        ${p1Sets} - ${p2Sets}
                    </div>
                `;
            }

            if (shareXBtn) shareXBtn.style.display = 'none';

            // ボタンの表示制御 (マッチ終了時のみ表示)
            const restartBtn = this.getElement('restart-btn');
            const backBtn = this.getElement('back-btn');
            if (restartBtn) restartBtn.style.display = matchOver ? 'block' : 'none';
            if (backBtn) backBtn.style.display = matchOver ? 'block' : 'none';

            if (overlay) {
                overlay.classList.add('active');
            }

            if (matchOver) {
                // マッチ全体の終了
                if (this.inputEnabled) {
                    this.menuNavigationEnabled = true;
                    this.currentMenuContext = 'versus-gameover';
                    setTimeout(() => {
                        this.updateMenuItems();
                        this.updateMenuFocus();
                    }, 50);
                }
            } else {
                // 次のセットへ (自動リスタート)
                this.showMessage('NEXT SET STARTS IN 3 SECONDS...', 'info');
                setTimeout(() => {
                    if (this.gameMode === 'versus' && !matchOver) {
                        this.start('versus', 'normal', this.level);
                    }
                }, 3000);
            }
            return;
        }



        const overlay = this.getElement('game-over-overlay');
        const gameOverTitle = this.getElement('game-over-title');
        const statsContainer = this.getElement('final-stats-container');
        const newRecordBadge = this.getElement('new-record-badge');

        if (newRecordBadge) newRecordBadge.classList.remove('active');
        let isNewRecord = false;

        if (isWin) {
            if (gameOverTitle) {
                gameOverTitle.textContent = 'GAME CLEAR!';
                gameOverTitle.style.color = '#00f0ff';
            }
        } else {
            if (gameOverTitle) {
                gameOverTitle.textContent = 'GAME OVER';
                gameOverTitle.style.color = '#ff3d00';
            }
        }

        // 40ラインモードでクリアしていない場合はX投稿ボタンを隠す
        const shareXBtn = this.getElement('share-x-btn');
        if (shareXBtn) {
            if ((this.gameMode === '40lines' || this.gameMode === 't20') && !isWin) {
                shareXBtn.style.display = 'none';
            } else {
                shareXBtn.style.display = 'block';
            }
        }

        // 統計情報の表示
        if (this.gameMode === 'ren4') {
            statsContainer.innerHTML = `最高REN: <span id="final-ren">${this.maxRen}</span>`;
        } else if (this.gameMode === 'survival') {
            statsContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                    <div>スコア: <span id="final-score">${this.score.toLocaleString()}</span></div>
                    <div>タイム: <span style="color: var(--accent-primary);">${this.formatTime(this.elapsedTime)}</span></div>
                </div>
            `;
        } else if ((this.gameMode === '40lines' || this.gameMode === 't20') && isWin) {
            statsContainer.innerHTML = `タイム: <span id="final-time">${this.formatTime(this.elapsedTime)}</span>`;
        } else {
            statsContainer.innerHTML = `スコア: <span id="final-score">${this.score.toLocaleString()}</span>`;
        }

        overlay.classList.add('active');

        // ベスト記録の更新判定
        if (this.gameMode === 'marathon') {
            if (this.score > this.bestScore) {
                this.bestScore = this.score;
                isNewRecord = true;
            }
        } else if (this.gameMode === '40lines') {
            if (isWin && (this.elapsedTime < this.bestTime)) {
                this.bestTime = this.elapsedTime;
                isNewRecord = true;
            }
        } else if (this.gameMode === 't20') {
            if (isWin && (this.elapsedTime < this.bestT20)) {
                this.bestT20 = this.elapsedTime;
                isNewRecord = true;
            }
        } else if (this.gameMode === 'ren4') {
            if (this.maxRen > this.bestRen) {
                this.bestRen = this.maxRen;
                isNewRecord = true;
            }
        } else if (this.gameMode === 'survival') {
            // レベル10スタートの場合のみ記録を保存
            if (this.startLevel >= 10) {
                const modeStr = (this.survivalType === 'serial') ? 'survival_serial' : 'survival_normal';

                if (this.survivalType === 'serial') {
                    if (this.elapsedTime > this.bestSurvivalSerial) {
                        this.bestSurvivalSerial = this.elapsedTime;
                        isNewRecord = true;
                    }
                } else {
                    if (this.elapsedTime > this.bestSurvival) {
                        this.bestSurvival = this.elapsedTime;
                        isNewRecord = true;
                    }
                }
                // 全国ランキングへの送信 (タイムを送信)
                this.submitScoreToSupabase(modeStr, this.elapsedTime);
            } else {
                console.log('Survival score info: Not recorded as start level < 10');
            }
        }

        if (isNewRecord && newRecordBadge) {
            // 少し遅延させて、オーバーレイが出てから「NEW RECORD」をポップさせる
            setTimeout(() => {
                newRecordBadge.classList.add('active');
                this.sounds.playRecordBreak(); // BTB風の豪華な音に変更

                // 記録更新の紙吹雪演出
                const rect = overlay.getBoundingClientRect();
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        this.createExplosion(
                            Math.random() * BOARD_WIDTH,
                            Math.random() * VISIBLE_HEIGHT + (BOARD_HEIGHT - VISIBLE_HEIGHT),
                            '#ff0055'
                        );
                    }, i * 40);
                }
            }, 300);
        }

        this.saveHighScores();
        this.updateBestDisplay();
        this.menuNavigationEnabled = true;
        this.updateMenuItems();

        // フォーカスを外してキーボードイベントが届くようにする
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }
    }

    shareToX() {
        try {
            let text = '';
            if (this.gameMode === 'ren4') {
                text = `無限4列RENで ${this.maxRen} RENでした！`;
            } else if (this.gameMode === '40lines') {
                text = `40ラインモードでタイム ${this.formatTime(this.elapsedTime)} でした！`;
            } else if (this.gameMode === 't20') {
                text = `T20 Sprint完走！タイム ${this.formatTime(this.elapsedTime)} でした！`;
            } else if (this.gameMode === 'survival') {
                const modeName = this.survivalType === 'serial' ? '課金穴サバイバル' : '通常サバイバル';
                text = `${modeName}でスコア ${this.score.toLocaleString()} / タイム ${this.formatTime(this.elapsedTime)} でした！`;
            } else {
                text = `マラソンモードでスコア ${this.score.toLocaleString()} でした！`;
            }

            let hashtags = 'TETRIN';
            if (this.gameMode === 'ren4') {
                hashtags = '無限4列REN,TETRIN';
            } else if (this.gameMode === '40lines') {
                hashtags = '40ライン,TETRIN';
            } else if (this.gameMode === 't20') {
                hashtags = 'T20Sprint,TETRIN';
            } else if (this.gameMode === 'survival') {
                hashtags = this.survivalType === 'serial' ? '課金穴サバイバル,TETRIN' : '通常サバイバル,TETRIN';
            } else {
                hashtags = 'マラソン,TETRIN';
            }

            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;

            console.log('Sharing to X:', twitterUrl);
            const win = window.open(twitterUrl, '_blank');
            if (!win) {
                console.error('Window open failed. Pop-up may be blocked.');
            }
        } catch (e) {
            console.error('shareToX failed:', e);
        }
    }



    // ========================================
    // ゲームループ
    // ========================================
    update(time = 0) {
        if (this.isDestroyed) return;

        this.pollGamepad();

        if (!this.isRunning || this.gameOver || this.isPaused) {
            // ゲームオーバー時やポーズ時もパーティクルを更新・描画
            this.updateParticles();
            this.draw();
            this.drawNext();
            this.drawParticles();

            // ゲームパッド入力を継続的に検出するため、ループを継続
            requestAnimationFrame((t) => this.update(t));
            return;
        }

        // Clearing Effect: Pause Loop
        if (this.isClearingLines) {
            this.draw(); // Ensure effect is drawn
            requestAnimationFrame((t) => this.update(t));
            return;
        }

        if (this.isCountingDown) {
            this.lastTime = time;
            this.draw();
            this.drawNext();
            requestAnimationFrame((t) => this.update(t));
            return;
        }

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        if (this.isRunning && !this.isPaused) {
            this.elapsedTime += deltaTime;
            this.updateScore();
        }

        if (this.isOnlineRemote) {
            this.updateParticles();
            this.draw();
            this.drawNext();
            this.drawParticles();
            requestAnimationFrame((t) => this.update(t));
            return;
        }

        this.handleInputs(deltaTime); // 追加

        // Input counting for Optimization Rate in Practice Mode
        if (this.gameMode === 'practice' && this.lastAction) {
            // Count moves: Rotate, Move, Hard Drop. Soft Drop is excluded from Finesse usually, but here we count inputs.
            // Strict Finesse counts keys.
            // Move Left/Right (1), Rotate (1), Hard Drop (1).
            // DAS charge is not an input, but the initial press is.
            // We need to count distinct key presses. 
            // However, handleInputs runs every frame.
            // We should hook into the actual action execution methods: moveLeft, moveRight, rotate, hardDrop.
            // See 'handleInputs' implementation detailing.

            // Implementing simplified tracking via hooks in move methods is cleaner, 
            // but for now, let's assume methods are called.
        }

        // CPU AIの実行
        if (!this.inputEnabled) {
            this.runAI(deltaTime);
        }

        if (this.gameMode === 'practice') {
            this.dropInterval = this.settings.get('practiceGravity');
        }

        this.dropCounter += deltaTime;

        if (this.dropCounter > this.dropInterval) {
            this.moveDown();
            this.dropCounter = 0;
            // 落下した場合は inner でリセットされるようになったので、ここでは削除
        }

        // 対戦モード(CPU)のガベージ処理
        // オンライン対戦の相手（Remote）の場合は、ネットワーク同期（pieceLocked）で盤面が送られてくるので、
        // ここで勝手にガベージを生成してはいけない。
        if (this.gameMode === 'versus' && !this.isPaused && !this.inputEnabled && !this.isOnlineRemote) {
            this.garbageTimer += deltaTime;
            if (this.garbageTimer > 500) {
                if (this.garbageQueue > 0) this.addGarbageLine();
                this.garbageTimer = 0;
            }
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
                const linesToQueue = this.survivalType === 'serial' ? 4 : 1;
                this.receiveGarbage(linesToQueue);
                this.garbageTimer = 0;
                this.isGarbageWarning = false;
                this.garbageDelayBonus = 0; // ボーナスは1回のせり上がりで消費される
                const minInterval = this.survivalType === 'serial' ? 4000 : 1000;
                this.garbageInterval = Math.max(minInterval, 10000 - (this.level - 1) * 500 + this.garbageDelayBonus);
            }

            // 時間経過によるレベルアップ (10秒ごと)
            // 開始レベルを基準にレベルアップを計算
            const newLevel = Math.floor(this.elapsedTime / 10000) + this.startLevel;
            if (newLevel > this.level) {
                this.level = newLevel;
                this.showMessage(`LEVEL UP: ${this.level}`, 'info');
                // せり上がり間隔も即座に再計算（ボーナスも維持）
                // 通常サバイバル: 最低2秒、課金穴サバイバル: 最低4秒
                const minInterval = this.survivalType === 'serial' ? 4000 : 1000;
                this.garbageInterval = Math.max(minInterval, 10000 - (this.level - 1) * 500 + this.garbageDelayBonus);
            }
        }

        // 接地判定と猶予タイマーの処理
        if (this.checkCollision(this.currentX, this.currentY + 1, this.currentRotation)) {
            // リセット回数を使い切っている場合は即座に固定（這い上がり防止）
            const isInfiniteLock = this.gameMode === 'practice' && this.settings.get('practiceInfiniteLockDelay');
            if (!isInfiniteLock && this.lockResetCount >= MAX_LOCK_RESET) {
                if (this.gameMode === 'practice') {
                    const optimalMoves = this.calculateFinesse(this.currentPiece, this.currentRotation, this.currentX, this.currentY);
                    this.totalOptimalMoves += optimalMoves;
                    this.totalActualMoves += this.currentPieceActualMoves;

                    if (this.totalActualMoves > 0) {
                        this.optimizationRate = (this.totalOptimalMoves / this.totalActualMoves) * 100;
                        const optRateElem = this.getElement('optimization-rate');
                        if (optRateElem) {
                            optRateElem.textContent = `${this.optimizationRate.toFixed(1)}%`;
                        }
                    }
                    this.currentPieceActualMoves = 0;
                }

                this.mergePiece();
                this.sounds.playLock();
                if (!this.clearLines()) {
                    this.spawnPiece();
                    this.broadcastLock();
                }
                this.lockDelayCounter = 0;
            } else {
                this.lockDelayCounter += deltaTime;
                const currentLockDelay = this.gameMode === 'practice' ? this.settings.get('practiceLockDelay') : LOCK_DELAY_TIME;
                const isInfiniteLock = this.gameMode === 'practice' && this.settings.get('practiceInfiniteLockDelay');

                if (!isInfiniteLock && this.lockDelayCounter >= currentLockDelay) {
                    if (this.gameMode === 'practice') {
                        // Calculate Finesse before merging
                        const optimalMoves = this.calculateFinesse(this.currentPiece, this.currentRotation, this.currentX, this.currentY);
                        this.totalOptimalMoves += optimalMoves;
                        this.totalActualMoves += this.currentPieceActualMoves;

                        if (this.totalActualMoves > 0) {
                            this.optimizationRate = (this.totalOptimalMoves / this.totalActualMoves) * 100;
                            const optRateElem = this.getElement('optimization-rate');
                            if (optRateElem) {
                                optRateElem.textContent = `${this.optimizationRate.toFixed(1)}%`;
                            }
                        }
                        // Reset for next piece
                        this.currentPieceActualMoves = 0;
                    }

                    this.mergePiece();
                    if (!this.clearLines()) {
                        this.spawnPiece();
                        this.broadcastLock();
                    }
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

    async startCountdown() {
        if (!this.countdownElement) return false;

        this.countdownId = (this.countdownId || 0) + 1;
        const currentId = this.countdownId;

        this.isCountingDown = true;
        this.countdownElement.classList.add('active');
        this.countdownElement.innerHTML = '';

        for (let i = 3; i > 0; i--) {
            if (this.countdownId !== currentId) return false;
            if (!this.isRunning) {
                this.isCountingDown = false;
                this.countdownElement.classList.remove('active');
                return false;
            }
            this.countdownElement.innerHTML = `<div class="countdown-item">${i}</div>`;
            this.sounds.playCountdown(i); // Countdown SE
            await new Promise(resolve => setTimeout(resolve, 400)); // テンポを400msに調整
        }

        if (this.countdownId !== currentId) return false;
        if (!this.isRunning) {
            this.isCountingDown = false;
            this.countdownElement.classList.remove('active');
            return false;
        }
        this.countdownElement.innerHTML = `<div class="countdown-item">GO!</div>`;
        this.sounds.playCountdown(0); // GO! SE
        await new Promise(resolve => setTimeout(resolve, 400));


        if (this.countdownId !== currentId) return false;
        if (!this.isRunning) {
            this.isCountingDown = false;
            this.countdownElement.classList.remove('active');
            return false;
        }

        this.countdownElement.classList.remove('active');
        this.countdownElement.innerHTML = '';
        this.isCountingDown = false;

        this.gameStartTime = performance.now(); // タイマーをこの時点から開始
        return true;
    }

    async start(mode = 'marathon', survivalType = 'normal', startLevel = 1) {
        // 即座にオーバーレイを非表示にする (エラー中断対策)
        const overlay = this.getElement('game-overlay');
        const overlay2 = this.getElement('game-over-overlay');


        if (overlay) overlay.style.display = 'none';
        if (overlay2) overlay2.classList.remove('active');

        this.sounds.stopBGM();
        this.sounds.setBGMContext('game');
        this.sounds.startBGM();

        // 通知とタイムアウトをクリア
        const notification = this.getElement('tspin-notification');
        if (notification) {
            notification.className = 'tspin-notification';
            notification.textContent = '';
        }
        if (this.tspinTimeout) {
            clearTimeout(this.tspinTimeout);
            this.tspinTimeout = null;
        }

        // メニューナビゲーションを無効化
        this.menuNavigationEnabled = false;

        this.garbageDelayBonus = 0;
        this.lastScoreBonusThreshold = 0;
        this.bag = [];
        this.gameMode = mode;
        this.survivalType = survivalType; // survivalType is also used as subType for other modes
        this.startLevel = startLevel;
        this.startLevel = startLevel;
        this.board = this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = startLevel;
        this.renCount = 0;
        this.maxRen = 0;
        this.gameOver = false;
        this.isPaused = false;
        this.isRunning = true;
        this.elapsedTime = 0;
        this.gameStartTime = performance.now();
        this.dropCounter = 0;

        // サバイバルモードと対戦モードは落下速度固定 (レベル1相当)
        if (mode === 'survival' || mode === 'versus') {
            this.dropInterval = INITIAL_SPEED;
        } else {
            this.dropInterval = INITIAL_SPEED * Math.pow(SPEED_DECREASE_RATE, this.level - 1);
        }

        this.garbageTimer = 0;
        this.garbageQueue = 0;   // ガベージキューをリセット
        this.totalAttacks = 0;  // 攻撃統計をリセット
        this.totalReceivedAttacks = 0;
        if (mode === 'survival') {
            const minInterval = survivalType === 'serial' ? 4000 : 2000;
            this.garbageInterval = Math.max(minInterval, 10000 - (startLevel - 1) * 500);
        } else {
            this.garbageInterval = 10000;
        }
        this.isGarbageWarning = false;

        this.holdPiece = null;
        this.canHold = true;
        this.initializeNextQueue();

        // 対戦モードの場合はスコア表示を初期化
        if (mode === 'versus') {
            this.updateVersusScoreDisplay();
        }

        // 入力状態をクリア (前回プレイ時の入力が残らないようにする)
        this.keysState = {};
        this.dasTimer = 0;
        this.arrTimer = 0;
        this.softDropTimer = 0;
        this.lastAction = null;

        // 初期メッセージ & パネル初期化 (カウントダウン前に実行)
        if (mode === '40lines') {
            this.showMessage('SPRINT: 40 LINES!', 'info');

            // 40 Lines Mode Optimization Rate Initialization
            this.totalPieces = 0;
            this.perfectPieces = 0;
            this.currentPieceActualMoves = 0;
            this.currentPieceHasUsedSoftDrop = false;
            this.optimizationRate = 0;
            const optPanel = document.getElementById('practice-info-panel');
            const optRate = document.getElementById('optimization-rate');
            if (optPanel) optPanel.style.display = 'block';
            if (optRate) optRate.textContent = '--%';
        } else if (mode === 't20') {
            this.showMessage('SPRINT: 20 LINES!', 'info');
            // Ensure panel is hidden for other modes
            const optPanel = document.getElementById('practice-info-panel');
            if (optPanel) optPanel.style.display = 'none';
        } else if (mode === 'ren4') {
            this.showMessage('REN PRACTICE: 4 COLUMNS', 'info');
            const optPanel = document.getElementById('practice-info-panel');
            if (optPanel) optPanel.style.display = 'none';
        } else if (mode === 'survival') {
            const typeLabel = survivalType === 'serial' ? 'KAKIN-ANA (4-LINE)' : 'NORMAL';
            this.showMessage(`SURVIVAL: ${typeLabel}`, 'info');
            const optPanel = document.getElementById('practice-info-panel');
            if (optPanel) optPanel.style.display = 'none';
        } else if (mode === 'practice') {
            if (survivalType === 'dpc-t') {
                this.showMessage('PRACTICE: DPC (Left T)', 'info');
                this.holdPiece = 'T';
                this.canHold = true;
                this.drawHold();
            } else if (survivalType === 'dpc-o') {
                this.showMessage('PRACTICE: DPC (Left O)', 'info');
                this.holdPiece = 'O';
                this.canHold = true;
                this.drawHold();
            } else if (survivalType === 'dpc-s') {
                this.showMessage('PRACTICE: DPC (Left S)', 'info');
                this.holdPiece = 'S';
                this.canHold = true;
                this.drawHold();
            } else if (survivalType === 'dpc-z') {
                this.showMessage('PRACTICE: DPC (Left Z)', 'info');
                this.holdPiece = 'Z';
                this.canHold = true;
                this.drawHold();
            } else if (survivalType === 'dpc-i') {
                this.showMessage('PRACTICE: DPC (Left I)', 'info');
                this.holdPiece = 'I';
                this.canHold = true;
                this.drawHold();
            } else if (survivalType === 'dpc-j') {
                this.showMessage('PRACTICE: DPC (Left J)', 'info');
                this.holdPiece = 'J';
                this.canHold = true;
                this.drawHold();
            } else if (survivalType === 'dpc-l') {
                this.showMessage('PRACTICE: DPC (Left L)', 'info');
                this.holdPiece = 'L';
                this.canHold = true;
                this.drawHold();
            } else if (survivalType === 'dpc-left-osz') {
                this.showMessage('PRACTICE: DPC (Left OSZ)', 'info');
                const pieces = ['O', 'S', 'Z'];
                this.holdPiece = pieces[Math.floor(Math.random() * pieces.length)];
                this.canHold = true;
                this.drawHold();
            } else {
                this.showMessage('PRACTICE: CLICK TO PLACE/REMOVE', 'info');
            }

            // Practice Mode Optimization Rate Initialization
            this.totalPieces = 0;
            this.perfectPieces = 0;
            this.currentPieceActualMoves = 0;
            this.currentPieceHasUsedSoftDrop = false;
            this.optimizationRate = 0;
            const optPanel = this.getElement('practice-info-panel');
            const optRate = this.getElement('optimization-rate');
            if (optPanel) optPanel.style.display = 'block';
            if (optRate) optRate.textContent = '--%';
        } else {
            // Default
            const optPanel = document.getElementById('practice-info-panel');
            if (optPanel) optPanel.style.display = 'none';
        }

        if (this.gameMode === '40lines' || this.gameMode === 't20' || this.gameMode === 'versus') {
            this.currentPiece = null;
            if (this.getElement('game-overlay')) this.getElement('game-overlay').style.display = 'none';
            if (this.getElement('game-over-overlay')) this.getElement('game-over-overlay').classList.remove('active');
            const subtitle = this.getElement('subtitle');
            if (subtitle) {
                if (this.gameMode === '40lines') subtitle.textContent = '40ライン消去までのタイムアタック';
                else if (this.gameMode === 't20') subtitle.textContent = '20ライン消去までのタイムアタック';
                // Versus doesn't need subtitle update here usually
            }

            this.updateBestDisplay();
            this.updateScore(); // Ensure cleared score/meter
            this.draw();
            this.drawHold(); // Ensure cleared hold
            this.drawNext();
            const completed = await this.startCountdown();
            if (!completed) return;
        }

        if (this.gameMode === 'ren4') {
            this.setupRen4Board();
        }

        // 初期表示のリセット
        this.drawHold();
        this.drawNext();

        this.spawnPiece();

        // 40ライン/T20/VersusモードのDAS充電対応
        if (this.gameMode === '40lines' || this.gameMode === 't20' || this.gameMode === 'versus') {
            if (this.keysState['moveLeft']) {
                this.moveLeft();
                this.lastAction = 'moveLeft';
                this.arrTimer = this.settings.get('arrInterval');
            } else if (this.keysState['moveRight']) {
                this.moveRight();
                this.lastAction = 'moveRight';
                this.arrTimer = this.settings.get('arrInterval');
            }
        }

        this.updateScore();
        this.updateBestDisplay();



        const subtitleElem = this.getElement('subtitle');
        if (subtitleElem) {
            switch (mode) {
                case 'marathon': subtitleElem.textContent = 'ハイスコアへの挑戦'; break;
                case 'ren4': subtitleElem.textContent = 'RENの限界に挑戦'; break;
                case 'survival': subtitleElem.textContent = survivalType === 'serial' ? '迫りくる課金穴から生き残れ' : '迫りくる地面から生き残れ'; break;
                case 'practice': subtitleElem.textContent = 'マウスで自由にブロックを配置・削除'; break;
                case 'versus': subtitleElem.textContent = (this.prefix === 'p2-' && !this.inputEnabled) ? 'VS CPU BATTLE' : (this.prefix === 'p1-' && this.opponent && !this.opponent.inputEnabled ? 'VS CPU BATTLE' : 'VS 2-PLAYER BATTLE'); break;
                case 't20': subtitleElem.textContent = 'T-spin 20ライン消去のタイムアタック'; break;
            }
        }

        if (this.getElement('game-overlay')) this.getElement('game-overlay').style.display = 'none';
        if (this.getElement('game-over-overlay')) this.getElement('game-over-overlay').classList.remove('active');

        const survivalPanel = this.getElement('survival-panel');
        if (survivalPanel) {
            survivalPanel.style.display = (mode === 'survival') ? 'block' : 'none';
        }

        this.lastTime = performance.now();
    }


    pollGamepad() {
        if (!this.inputEnabled) return;
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        let targets = [];

        // Specific gamepad index assigned to this instance
        if (this.gamepadIndex !== null) {
            if (gamepads[this.gamepadIndex]) targets = [gamepads[this.gamepadIndex]];
        } else {
            // Main instance or unassigned: poll all available
            targets = Array.from(gamepads).filter(gp => gp !== null);
        }

        const actions = ['moveLeft', 'moveRight', 'softDrop', 'hardDrop', 'rotateRight', 'rotateLeft', 'hold', 'hold2', 'pause', 'reset', 'returnToTitle'];
        const currentButtons = {};
        actions.forEach(a => currentButtons[a] = false);

        let hasAnyInput = false;

        for (const gp of targets) {
            if (!gp) continue;

            const buttons = gp.buttons;
            const axes = gp.axes;

            if (!hasAnyInput) {
                for (let i = 0; i < buttons.length; i++) {
                    if (buttons[i]?.pressed) {
                        hasAnyInput = true;
                        break;
                    }
                }
                if (!hasAnyInput) {
                    for (let i = 0; i < axes.length; i++) {
                        if (Math.abs(axes[i]) > 0.5) {
                            hasAnyInput = true;
                            break;
                        }
                    }
                }
            }

            actions.forEach(action => {
                const buttonIndex = this.keyBindings.getGamepadBinding(action);
                if (buttonIndex !== null && buttons[buttonIndex]?.pressed) {
                    currentButtons[action] = true;
                }
            });

            // 十字キー/スティック
            const threshold = 0.5;
            if (axes[0] < -threshold || buttons[14]?.pressed) currentButtons['moveLeft'] = true;
            if (axes[0] > threshold || buttons[15]?.pressed) currentButtons['moveRight'] = true;
            if (axes[1] > threshold || buttons[13]?.pressed) currentButtons['softDrop'] = true;
            if (axes[1] < -threshold || buttons[12]?.pressed) currentButtons['hardDrop'] = true;
        }

        if (hasAnyInput && typeof window._tryStartBGM === 'function') {
            window._tryStartBGM();
        }

        // 誤入力防止ロック中の場合、状態の更新（前回値の保存）のみ行い、アクションは実行しない
        if (this.uiClickLocked) {
            const up = currentButtons['hardDrop'];
            const down = currentButtons['softDrop'];
            const left = currentButtons['moveLeft'];
            const right = currentButtons['moveRight'];
            const confirm = currentButtons['rotateRight'] || currentButtons['pause'];
            const back = currentButtons['returnToTitle'] || currentButtons['rotateLeft'];

            this.lastGamepadMenuInput = { up, down, left, right, confirm, back };
            actions.forEach(a => {
                this.lastGamepadButtons[a] = currentButtons[a];
            });
            return;
        }

        // メニューナビゲーション
        if ((!this.isRunning || this.isPaused) && this.menuNavigationEnabled) {
            const up = currentButtons['hardDrop'];
            const down = currentButtons['softDrop'];
            const left = currentButtons['moveLeft'];
            const right = currentButtons['moveRight'];
            const confirm = currentButtons['rotateRight'] || currentButtons['pause'];
            const back = currentButtons['returnToTitle'] || currentButtons['rotateLeft'];

            if (!this.lastGamepadMenuInput) {
                this.lastGamepadMenuInput = { up: false, down: false, left: false, right: false, confirm: false, back: false };
            }
            // Initialize hold counters
            if (!this.menuHoldCounters) {
                this.menuHoldCounters = { up: 0, down: 0, left: 0, right: 0 };
            }

            const MENU_DAS = 10;
            const MENU_ARR = 2; // Fast scroll

            const directions = [
                { key: 'up', val: up },
                { key: 'down', val: down },
                { key: 'left', val: left },
                { key: 'right', val: right }
            ];

            directions.forEach(d => {
                if (d.val) {
                    const count = this.menuHoldCounters[d.key];
                    if (count === 0) {
                        console.log(`[GAMEPAD MENU] First press: ${d.key}, counter: ${count}`);
                        this.navigateMenu(d.key);
                    } else if (count >= MENU_DAS) {
                        if ((count - MENU_DAS) % MENU_ARR === 0) {
                            console.log(`[GAMEPAD MENU] Repeat: ${d.key}, counter: ${count}`);
                            this.navigateMenu(d.key);
                        }
                    }
                    this.menuHoldCounters[d.key]++;
                } else {
                    this.menuHoldCounters[d.key] = 0;
                }
            });

            // Confirm/Back are still single-press
            if (confirm && !this.lastGamepadMenuInput.confirm) this.activateMenuItem();
            if (back && !this.lastGamepadMenuInput.back) this.goBack();


            // ゲームオーバー時の特殊アクション
            if (this.gameOver) {
                if (currentButtons['reset'] && !this.lastGamepadButtons['reset']) {
                    this.quickReset();
                }
                if (currentButtons['returnToTitle'] && !this.lastGamepadButtons['returnToTitle']) {
                    this.menuNavigationEnabled = true;
                    this.returnToTitle();
                }
            }

            this.lastGamepadMenuInput = { up, down, left, right, confirm, back };
            this.lastGamepadButtons = { ...currentButtons };
            return;
        }

        // ゲームプレイ
        actions.forEach(action => {
            const pressed = currentButtons[action];
            const wasPressed = this.lastGamepadButtons[action];

            if (pressed && !wasPressed) { // Gamepad pressed
                this.handleButtonDown(action);
                this.keysState[action] = true;
            } else if (!pressed && wasPressed) { // Gamepad released
                this.keysState[action] = false;
            }
        });

        this.lastGamepadButtons = { ...currentButtons };
    }

    handleButtonDown(action) {
        if (this.isDestroyed || this.uiClickLocked) return;

        // 対戦モード中（自分自身がメインインスタンスで、且つ子インスタンスが動いている場合）は入力を無視
        if (!this.prefix && (this.p1 || this.p2)) {
            // ただし、もし万が一メニュー操作などがメインに必要ならここで分岐するが、
            // 現状は P1 インスタンスがキーを奪っているのでメインは無視して良い
            return;
        }

        // モーダル表示中は全てのゲーム操作を中断
        if ((this.rankingModal && this.rankingModal.classList.contains('active')) ||
            (this.getElement('settings-modal') && this.getElement('settings-modal').classList.contains('active'))) {
            return;
        }

        if (!this.isRunning || this.gameOver || this.isCountingDown) {

            // Allow Reset in Game Over
            if (action === 'reset') {
                // タイトル画面（isRunningがfalse、かつゲームオーバーでない、あるいはメニュー操作有効）ではリセット無効
                if (this.menuNavigationEnabled && !this.gameOver) {
                    console.log(`[DEBUG][${this.prefix || 'MAIN'}] Reset ignored: On Menu Screen`);
                    return;
                }

                this.quickReset();
                return;
            }
            if (action === 'returnToTitle') {
                const optPanel = document.getElementById('practice-info-panel');
                if (optPanel) optPanel.style.display = 'none';
                this.returnToTitle();
                return;
            }
            return;
        }

        if (this.isPaused) {
            if (action === 'pause') this.pause();
            if (action === 'returnToTitle') {
                const optPanel = document.getElementById('practice-info-panel');
                if (optPanel) optPanel.style.display = 'none';
                this.returnToTitle();
                return;
            }
            return;
        }

        // Input Counting for Practice/40Lines Mode (Key Presses)
        if ((this.gameMode === 'practice' || this.gameMode === '40lines') && !this.uiClickLocked && !this.isPaused) {
            const countedActions = ['moveLeft', 'moveRight', 'softDrop', 'hardDrop', 'rotateRight', 'rotateLeft'];
            if (countedActions.includes(action)) {
                // Optimization: Only count initial press or distinct press. 
                // setupEventListeners calls this on 'keydown'. 
                // If the user holds the key, depending on implementation, it might repeat.
                // However, we want to count PHYSICAL presses.
                // We can use !this.keysState[action] to check if it's already pressed?
                // keysState is updated in handleButtonDown after processing? No, check line 3535 (boundKeyHandler) -> calls this -> then what?
                // In `boundKeyHandler`: `this.handleButtonDown(action); this.keysState[action] = true;` (Wait, where?)
                // Actually, `keysState` is updated in `boundKeyHandler` logic:
                // "if (!this.keysState[action]) { this.handleButtonDown(action); this.keysState[action] = true; }"
                // Let's verify that logic in `boundKeyHandler`.

                this.currentPieceActualMoves++;

                if (action === 'softDrop') {
                    this.currentPieceHasUsedSoftDrop = true;
                }
            }
        }

        if (action === 'moveLeft') {
            this.moveLeft();
            this.lastAction = 'moveLeft';
            this.dasTimer = this.settings.get('dasDelay');
            this.arrTimer = 0;
        }
        if (action === 'moveRight') {
            this.moveRight();
            this.lastAction = 'moveRight';
            this.dasTimer = this.settings.get('dasDelay');
            this.arrTimer = 0;
        }
        if (action === 'softDrop') {
            this.moveDown();
            this.softDropTimer = 0;
        }
        if (action === 'rotateRight') this.rotate(1);
        if (action === 'rotateLeft') this.rotate(-1);
        if (action === 'hold' || action === 'hold2') this.hold();
        if (action === 'hardDrop') this.hardDrop();
        if (action === 'pause') this.pause();
        if (action === 'reset') this.quickReset();
        if (action === 'returnToTitle') {
            const optPanel = document.getElementById('practice-info-panel');
            if (optPanel) optPanel.style.display = 'none';
            this.returnToTitle();
        }

        this.draw();
    }



    pause(isInternal = false) {
        // メインインスタンスかつ対戦モード中の場合、p1 インスタンスに委譲
        if (!isInternal && !this.prefix && this.p1) {
            return this.p1.pause(false);
        }

        // Online mode: forbid pause
        const isOnlineMatch = this.gameMode === 'versus' && (this.isOnlineRemote || (this.opponent && this.opponent.isOnlineRemote));
        if (!isInternal && isOnlineMatch) {
            this.showMessage('PAUSE DISABLED IN ONLINE MATCH', 'warning');
            return;
        }

        // 対戦モードの場合、相手も一緒にポーズする
        if (!isInternal && this.gameMode === 'versus' && this.opponent) {
            this.opponent.pause(true);
        }

        this.isPaused = !this.isPaused;
        this.sounds.playMenuClick(); // SE

        if (this.isPaused) {
            // Reset gamepad menu counters to prevent hypersensitive navigation
            this.menuHoldCounters = { up: 0, down: 0, left: 0, right: 0 };
            this.lastGamepadMenuInput = null;
            this.sounds.stopBGM();
        } else if (this.isRunning) {
            // Reset gamepad menu counters when unpausing
            this.menuHoldCounters = { up: 0, down: 0, left: 0, right: 0 };
            this.lastGamepadMenuInput = null;
            this.sounds.startBGM();
        }
        if (!this.isPaused && this.isRunning) {
            this.lastTime = performance.now();
        }
    }

    async quickReset(isInternal = false) {
        // メインインスタンスかつ対戦モード中の場合、p1 インスタンスに委譲
        if (!isInternal && !this.prefix && this.p1) {
            return this.p1.quickReset(false);
        }

        // Online mode: forbid reset
        if (!isInternal && window.networkManager && this.gameMode === 'versus') {
            this.showMessage('RESET DISABLED IN ONLINE MATCH', 'warning');
            return;
        }

        // 対戦モードの場合、相手も一緒にリセットする
        if (!isInternal && this.gameMode === 'versus' && this.opponent) {
            this.opponent.quickReset(true);
            this.setClickLock(500);
            this.opponent.setClickLock(500);
        }

        // タイトル画面に戻らず、即座にゲームを再開
        this.sounds.stopBGM();
        this.sounds.setBGMContext('game');
        this.sounds.startBGM();

        // 通知とオーバーレイを即座にクリア
        if (this.getElement('game-over-overlay')) this.getElement('game-over-overlay').classList.remove('active');
        const notification = this.getElement('tspin-notification');
        if (notification) {
            notification.className = 'tspin-notification';
            notification.textContent = '';
        }
        if (this.tspinTimeout) {
            clearTimeout(this.tspinTimeout);
            this.tspinTimeout = null;
        }

        // ゲーム状態フラグを全モード共通で初期化
        this.gameOver = false;
        this.isPaused = false;
        this.isRunning = true;
        this.menuNavigationEnabled = false; // メニューナビゲーションを無効化
        this.sounds.playMenuClick(); // SE

        this.board = this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.level = this.startLevel || 1;
        this.renCount = 0;
        this.maxRen = 0;
        this.totalAttacks = 0;
        this.totalReceivedAttacks = 0;
        this.isBackToBack = false;
        this.totalReceivedAttacks = 0;
        this.isBackToBack = false;

        // Optimization Rate Reset (Practice Mode & 40 Lines)
        if (this.gameMode === 'practice' || this.gameMode === '40lines') {
            this.totalPieces = 0;
            this.perfectPieces = 0;
            this.currentPieceActualMoves = 0;
            this.currentPieceHasUsedSoftDrop = false;
            this.optimizationRate = 0;
            const optRate = document.getElementById('optimization-rate');
            const optPanel = document.getElementById('practice-info-panel');
            if (optPanel) optPanel.style.display = 'block'; // Force show on reset
            if (optRate) optRate.textContent = '--%';
        }

        // Practice DPC Reset: Preserve HOLD if DPC mode
        if (this.gameMode === 'practice' &&
            (this.survivalType === 'dpc-t' || this.survivalType === 'dpc-o' ||
                this.survivalType === 'dpc-s' || this.survivalType === 'dpc-z' ||
                this.survivalType === 'dpc-i' || this.survivalType === 'dpc-j' ||
                this.survivalType === 'dpc-l' || this.survivalType === 'dpc-left-osz')) {
            if (this.survivalType === 'dpc-t') this.holdPiece = 'T';
            if (this.survivalType === 'dpc-o') this.holdPiece = 'O';
            if (this.survivalType === 'dpc-s') this.holdPiece = 'S';
            if (this.survivalType === 'dpc-z') this.holdPiece = 'Z';
            if (this.survivalType === 'dpc-i') this.holdPiece = 'I';
            if (this.survivalType === 'dpc-j') this.holdPiece = 'J';
            if (this.survivalType === 'dpc-l') this.holdPiece = 'L';
            if (this.survivalType === 'dpc-left-osz') {
                const pieces = ['O', 'S', 'Z'];
                this.holdPiece = pieces[Math.floor(Math.random() * pieces.length)];
            }
        } else {
            this.holdPiece = null;
        }
        this.canHold = true;

        this.bag = [];
        this.dropCounter = 0;

        // サバイバルモード・対戦モードは落下速度固定
        if (this.gameMode === 'survival' || this.gameMode === 'versus') {
            this.dropInterval = INITIAL_SPEED;
        } else {
            this.dropInterval = INITIAL_SPEED * Math.pow(SPEED_DECREASE_RATE, this.level - 1);
        }

        this.lockDelayCounter = 0;
        this.lockResetCount = 0;
        this.elapsedTime = 0;
        this.gameStartTime = performance.now();

        // サバイバルモード関連の状態をリセット
        this.garbageTimer = 0;
        if (this.gameMode === 'survival') {
            const minInterval = this.survivalType === 'serial' ? 4000 : 2000;
            this.garbageInterval = Math.max(minInterval, 10000 - (this.level - 1) * 500);
        } else {
            this.garbageInterval = 10000;
        }
        this.garbageDelayBonus = 0;
        this.lastScoreBonusThreshold = 0;
        this.isGarbageWarning = false;


        // 対戦関連リセット
        this.garbageQueue = 0;

        this.initializeNextQueue();

        // 入力状態をクリア (前回プレイ時の入力が残らないようにする)
        this.keysState = {};
        this.dasTimer = 0;
        this.arrTimer = 0;
        this.softDropTimer = 0;
        this.lastAction = null;

        if (this.gameMode === 'ren4') {
            this.setupRen4Board();
        }

        // 40ライン/T20/Versusモードの場合はカウントダウンを開始
        if (this.gameMode === '40lines' || this.gameMode === 't20' || this.gameMode === 'versus') {
            this.currentPiece = null; // 古いピースを削除

            // カウントダウン前に画面をクリアしてUIを最新にする
            this.updateScore();
            this.updateBestDisplay();
            document.getElementById('game-over-overlay').classList.remove('active');

            this.draw();
            this.drawHold();
            this.drawNext();
            const completed = await this.startCountdown();
            if (!completed) return; // 中断された場合はここで終了
        }

        this.spawnPiece();

        // DAS充電対応：カウントダウン終了後に押しっぱなしのキーがあれば初動を実行
        if (this.keysState['moveLeft']) {
            this.moveLeft();
            this.lastAction = 'moveLeft';
            // dasTimerはリセットせず、カウントダウン中に溜めた値を維持する
            this.arrTimer = this.settings.get('arrInterval'); // 次のフレームで即座にARR移動
        } else if (this.keysState['moveRight']) {
            this.moveRight();
            this.lastAction = 'moveRight';
            // dasTimerはリセットせず、カウントダウン中に溜めた値を維持する
            this.arrTimer = this.settings.get('arrInterval'); // 次のフレームで即座にARR移動
        }

        this.draw();
        this.drawHold();
        this.drawNext();

        // 40ラインモードの場合、カウントダウン中にループが動いていても、
        // ここで再開を確実にするために呼び出す（二重呼び出し防止はupdate側で行うか、ここでの呼び出しが必要かを再考）
        // 実はawait startCountdown()している間にループが止まっている可能性があるため、
        // 明示的に再開するのが安全。ただし二重ループにならないように注意が必要だが、
        // startCountdown内でisCountingDown=falseにした後、updateループが継続していれば問題ない。
        // しかし、念のためここでループを再キックする方が確実（既存のループが止まっていた場合復帰できないため）

        // 既存のループが生きているかどうかわからないため、安全策として cancelAnimationFrame はできないが、
        // 単純に startCountdown 終了後にisRunning=trueなら update は回り続けるはず。
        // もし止まっているなら、ここで restart する必要がある。

        this.lastTime = performance.now();
    }

    returnToTitle() {
        // 対戦モード中の場合は、対戦モード終了処理に委譲する
        const versusModeContainer = document.getElementById('versus-mode-container');
        if (versusModeContainer && versusModeContainer.style.display !== 'none') {
            if (window.game) {
                window.game.toggleVersusMode(false);
            } else {
                this.toggleVersusMode(false);
            }
            return;
        }

        // すべてのメニューを非表示にし、メインメニューを表示
        document.querySelectorAll('.mode-select').forEach(el => {
            el.style.display = 'none';
        });

        const mainMenu = document.getElementById('main-mode-select');
        if (mainMenu) mainMenu.style.display = 'flex';

        const controlsGuide = document.querySelector('.controls-guide');
        if (controlsGuide) controlsGuide.style.display = 'block';

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

        this.drawNext();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // メインボードも真っ新に

        if (this.getElement('game-overlay')) this.getElement('game-overlay').style.display = 'flex';
        if (this.getElement('game-over-overlay')) this.getElement('game-over-overlay').classList.remove('active');
        this.sounds.playMenuClick(); // SE
        this.sounds.stopBGM();
        this.sounds.setBGMContext('menu');
        this.sounds.startBGM();

        // サブタイトルのリセット
        const subtitle = this.getElement('subtitle');
        if (subtitle) {
            subtitle.textContent = 'テトリスの講師 理想のテトリス';
        }

        // サバイバルパネルの非表示
        const survivalPanel = this.getElement('survival-panel');
        if (survivalPanel) {
            survivalPanel.style.display = 'none';
        }

        // カウントダウンを中断
        this.countdownId = (this.countdownId || 0) + 1;
        this.isCountingDown = false;
        if (this.countdownElement) {
            this.countdownElement.classList.remove('active');
            this.countdownElement.innerHTML = '';
        }

        // Reset gamepad menu counters
        this.menuHoldCounters = { up: 0, down: 0, left: 0, right: 0 };
        this.lastGamepadMenuInput = null;

        // メニューナビゲーションを有効化
        this.menuNavigationEnabled = true;
        this.updateMenuItems();
    }

    // ========================================
    // メニューナビゲーション
    // ========================================
    updateMenuItems() {
        // 現在表示されているメニューのボタンを取得
        const mainMode = this.getElement('main-mode-select');
        const esportsMode = this.getElement('esports-mode-select');
        const survivalMode = this.getElement('survival-mode-select');
        const versusSetupMenu = document.getElementById('versus-setup-menu');
        const gameOverlay = this.getElement('game-overlay');

        this.currentMenuItems = [];

        if (this.rankingModal && this.rankingModal.classList.contains('active')) {
            // ランキングモーダルを最優先
            this.currentMenuContext = 'ranking';
            this.currentMenuItems = Array.from(this.rankingModal.querySelectorAll('.btn-ranking-nav'))
                .filter(el => el.offsetParent !== null);
        } else if (this.getElement('settings-modal') && this.getElement('settings-modal').classList.contains('active')) {
            // 設定モーダル (現在は独自の実装だが、コンテキストをセットして他をブロック)
            this.currentMenuContext = 'settings';
            this.currentMenuItems = []; // 設定モーダル内のナビゲーションは別の場所で処理されている可能性があるが、他をブロックするためにセット
        } else if (gameOverlay && gameOverlay.style.display !== 'none') {
            // タイトル画面
            if (mainMode && mainMode.style.display !== 'none') {
                this.currentMenuContext = 'main';
                this.currentMenuItems = Array.from(mainMode.querySelectorAll('.btn-start'))
                    .filter(el => el.offsetParent !== null);
            } else if (esportsMode && esportsMode.style.display !== 'none') {
                this.currentMenuContext = 'esports';
                this.currentMenuItems = Array.from(esportsMode.querySelectorAll('.btn-start'))
                    .filter(el => el.offsetParent !== null);
            } else if (survivalMode && survivalMode.style.display !== 'none') {
                this.currentMenuContext = 'survival';
                // レベル選択ラジオボタン + モードボタン + 戻るボタン
                const levelOptions = Array.from(survivalMode.querySelectorAll('.level-option'));
                const modeButtons = Array.from(survivalMode.querySelectorAll('.survival-mode-card .btn-start'));
                const backButton = [survivalMode.querySelector('#back-to-main')];
                this.currentMenuItems = [...levelOptions, ...modeButtons, ...backButton]
                    .filter(el => el && el.offsetParent !== null);
            } else if (versusSetupMenu && versusSetupMenu.style.display !== 'none') {
                this.currentMenuContext = 'versus-setup';
                const vsTypeOptions = Array.from(versusSetupMenu.querySelectorAll('.mode-option'));

                // CPUレベルスライダーは、親要素が表示されている場合のみ追加
                const cpuLevelItem = versusSetupMenu.querySelector('#cpu-level-item');
                const cpuSettingsContainer = versusSetupMenu.querySelector('#cpu-settings-container');
                const cpuLevelItems = (cpuLevelItem && cpuSettingsContainer && cpuSettingsContainer.offsetParent !== null)
                    ? [cpuLevelItem]
                    : [];

                const actionButtons = Array.from(versusSetupMenu.querySelectorAll('.btn-start'))
                    .filter(el => el.offsetParent !== null);
                this.currentMenuItems = [...vsTypeOptions, ...cpuLevelItems, ...actionButtons]
                    .filter(el => el && el.offsetParent !== null);
            } else if (this.getElement('practice-mode-select') && this.getElement('practice-mode-select').style.display !== 'none') {
                this.currentMenuContext = 'practice';
                const practiceMenu = this.getElement('practice-mode-select');
                this.currentMenuItems = Array.from(practiceMenu.querySelectorAll('.btn-start'))
                    .filter(el => el && el.offsetParent !== null);
            } else if (this.getElement('dpc-mode-select') && this.getElement('dpc-mode-select').style.display !== 'none') {
                this.currentMenuContext = 'dpc-menu';
                const dpcMenu = this.getElement('dpc-mode-select');
                this.currentMenuItems = Array.from(dpcMenu.querySelectorAll('.btn-start'))
                    .filter(el => el && el.offsetParent !== null);
            } else if (this.getElement('sprint-mode-select') && this.getElement('sprint-mode-select').style.display !== 'none') {
                this.currentMenuContext = 'sprint';
                const sprintMenu = this.getElement('sprint-mode-select');
                this.currentMenuItems = Array.from(sprintMenu.querySelectorAll('.btn-start'))
                    .filter(el => el && el.offsetParent !== null);
            } else if (this.getElement('online-lobby-menu') && this.getElement('online-lobby-menu').style.display !== 'none') {
                this.currentMenuContext = 'online-lobby';
                const lobbyMenu = this.getElement('online-lobby-menu');
                // レベル入力 + 準備ボタン or 開始ボタン + 退出ボタン
                const levelInput = [lobbyMenu.querySelector('#lobby-win-sets-input')];
                const actionButtons = Array.from(lobbyMenu.querySelectorAll('.btn-start'))
                    .filter(el => el && el.offsetParent !== null);
                this.currentMenuItems = [...levelInput, ...actionButtons]
                    .filter(el => el && el.offsetParent !== null);
            }
        } else if (this.currentMenuContext === 'versus-gameover') {
            // 対戦モードゲームオーバー画面
            const p1Overlay = this.getElement('game-over-overlay');
            console.log(`[DEBUG][${this.prefix || 'MAIN'}] updateMenuItems: P1 Overlay Found:${!!p1Overlay}`);
            if (p1Overlay) {
                const buttons = Array.from(p1Overlay.querySelectorAll('.btn-restart'));
                console.log(`[DEBUG][${this.prefix || 'MAIN'}] updateMenuItems: Buttons found: ${buttons.length}`);
                this.currentMenuItems = buttons.filter(el => {
                    const visible = el.offsetParent !== null;
                    console.log(`[DEBUG][${this.prefix || 'MAIN'}] Button ${el.id} visible: ${visible}`);
                    return visible;
                });
                console.log(`[DEBUG][${this.prefix || 'MAIN'}] updateMenuItems: Visible items: ${this.currentMenuItems.length}`);
            }
        } else {
            // ゲームオーバー画面
            const gameOverOverlay = document.getElementById('game-over-overlay');
            if (gameOverOverlay && gameOverOverlay.classList.contains('active')) {
                this.currentMenuContext = 'gameover';
                this.currentMenuItems = Array.from(gameOverOverlay.querySelectorAll('.btn-restart'))
                    .filter(el => el.offsetParent !== null);
            }
        }

        // 現在のインデックスを範囲内に調整
        if (this.currentMenuIndex >= this.currentMenuItems.length) {
            this.currentMenuIndex = this.currentMenuItems.length - 1;
        }
        if (this.currentMenuIndex < 0) {
            this.currentMenuIndex = 0;
        }

        // Update Controls Guide Visibility
        const controlsGuide = document.querySelector('.controls-guide');
        if (controlsGuide) {
            controlsGuide.style.display = (this.currentMenuContext === 'main') ? 'block' : 'none';
        }

        this.updateMenuFocus();
    }

    updateMenuFocus() {
        // すべてのフォーカスを削除
        document.querySelectorAll('.menu-focused').forEach(el => {
            el.classList.remove('menu-focused');
        });

        // 現在のアイテムにフォーカスを追加
        if (this.currentMenuItems[this.currentMenuIndex]) {
            this.currentMenuItems[this.currentMenuIndex].classList.add('menu-focused');
        }
    }

    navigateMenu(direction) {
        if (this.currentMenuItems.length === 0) {
            console.warn(`[DEBUG][${this.prefix || 'MAIN'}] navigateMenu: No menu items to navigate! Context=${this.currentMenuContext}`);
            return;
        }

        // 特別なコンテキストの処理を優先
        if (this.currentMenuContext === 'ranking') {
            const closeBtnIndex = 0; // × ボタン (modal-close)
            const firstTabIndex = 1;
            const lastTabIndex = 6; // タブが6個あるため (1:40L, 2:Mara, 3:T20, 4:REN, 5:SN, 6:SS)
            const rankingContainer = document.getElementById('ranking-list-container');
            const scrollAmount = 50;

            if (direction === 'left' || direction === 'right') {
                // タブ列 (1-4) にいる場合のみ左右で切り替え
                if (this.currentMenuIndex >= firstTabIndex) {
                    if (direction === 'left') {
                        this.currentMenuIndex = this.currentMenuIndex - 1;
                        if (this.currentMenuIndex < firstTabIndex) this.currentMenuIndex = lastTabIndex;
                    } else {
                        this.currentMenuIndex = this.currentMenuIndex + 1;
                        if (this.currentMenuIndex > lastTabIndex) this.currentMenuIndex = firstTabIndex;
                    }
                }
            } else if (direction === 'up') {
                // タブにいる場合: スクロールアップ -> 最上部なら「×」ボタンへ
                if (this.currentMenuIndex >= firstTabIndex) {
                    if (rankingContainer && rankingContainer.scrollTop > 0) {
                        rankingContainer.scrollBy({ top: -scrollAmount, behavior: 'instant' }); // Smoothだと操作感が悪いのでinstant
                    } else {
                        this.currentMenuIndex = closeBtnIndex;
                    }
                }
                // 「×」ボタンにいる場合: 何もしない (これ以上上がない)
            } else if (direction === 'down') {
                // 「×」ボタンにいる場合: タブへ移動
                if (this.currentMenuIndex === closeBtnIndex) {
                    this.currentMenuIndex = firstTabIndex;
                } else if (this.currentMenuIndex >= firstTabIndex) {
                    // タブにいる場合: スクロールダウン (無限スクロール)
                    if (rankingContainer) {
                        rankingContainer.scrollBy({ top: scrollAmount, behavior: 'instant' });
                    }
                }
            }
        } else if (this.currentMenuContext === 'dpc-menu') {
            // DPC練習メニュー: 2列グリッド (ピース8個 + 戻るボタン)
            // 0:T, 1:O
            // 2:S, 3:Z
            // 4:I, 5:J
            // 6:L, 7:OSZ
            // 8:戻る
            const colCount = 2;
            const pieceCount = 8;
            const backBtnIndex = 8;

            if (direction === 'left') {
                if (this.currentMenuIndex < pieceCount) {
                    // 同一行の左へ (偶数なら右端へ、奇数なら左へ)
                    if (this.currentMenuIndex % 2 === 0) this.currentMenuIndex++;
                    else this.currentMenuIndex--;
                }
            } else if (direction === 'right') {
                if (this.currentMenuIndex < pieceCount) {
                    // 同一行の右へ
                    if (this.currentMenuIndex % 2 === 0) this.currentMenuIndex++;
                    else this.currentMenuIndex--;
                }
            } else if (direction === 'up') {
                if (this.currentMenuIndex === backBtnIndex) {
                    this.currentMenuIndex = 6; // OSZかLか迷うが、とりあえずL(6)へ
                } else if (this.currentMenuIndex >= colCount) {
                    this.currentMenuIndex -= colCount;
                } else {
                    this.currentMenuIndex = backBtnIndex; // ループして戻るボタンへ
                }
            } else if (direction === 'down') {
                if (this.currentMenuIndex === backBtnIndex) {
                    this.currentMenuIndex = 0; // ループして最初へ
                } else if (this.currentMenuIndex + colCount < pieceCount) {
                    this.currentMenuIndex += colCount;
                } else {
                    this.currentMenuIndex = backBtnIndex; // 戻るボタンへ
                }
            }
        } else if (this.currentMenuContext === 'survival') {
            // サバイバルメニュー: レベル選択(2個) + モードボタン(2個) + 戻るボタン(1個)
            // 0: Level 1, 1: Level 10
            // 2: 通常サバイバル, 3: 課金穴サバイバル
            // 4: 戻る
            const levelOptionCount = 2;
            const modeButtonStart = 2;
            const modeButtonCount = 2;
            const backButtonIndex = 4;

            if (direction === 'left' || direction === 'right') {
                // レベル選択ラジオボタン間を左右キーで移動
                if (this.currentMenuIndex < levelOptionCount) {
                    if (direction === 'left') {
                        this.currentMenuIndex = 0; // Level 1へ
                    } else {
                        this.currentMenuIndex = 1; // Level 10へ
                    }
                    // ラジオボタンを選択
                    const currentItem = this.currentMenuItems[this.currentMenuIndex];
                    if (currentItem && currentItem.classList.contains('level-option')) {
                        const radio = currentItem.querySelector('input[type="radio"]');
                        if (radio) {
                            radio.checked = true;
                            radio.dispatchEvent(new Event('change'));
                        }
                    }
                }
            } else if (direction === 'up') {
                if (this.currentMenuIndex === backButtonIndex) {
                    // 戻るボタンから上へ: モードボタンの最後へ
                    this.currentMenuIndex = modeButtonStart + modeButtonCount - 1;
                } else if (this.currentMenuIndex >= modeButtonStart && this.currentMenuIndex < modeButtonStart + modeButtonCount) {
                    // モードボタンから上へ: レベル選択へ
                    this.currentMenuIndex = 0;
                } else if (this.currentMenuIndex < levelOptionCount) {
                    // レベル選択から上へ: 戻るボタンへ (ループ)
                    this.currentMenuIndex = backButtonIndex;
                }
            } else if (direction === 'down') {
                if (this.currentMenuIndex < levelOptionCount) {
                    // レベル選択から下へ: モードボタンへ
                    this.currentMenuIndex = modeButtonStart;
                } else if (this.currentMenuIndex >= modeButtonStart && this.currentMenuIndex < modeButtonStart + modeButtonCount) {
                    // モードボタン内を移動
                    this.currentMenuIndex++;
                    if (this.currentMenuIndex >= modeButtonStart + modeButtonCount) {
                        // モードボタンの最後から下へ: 戻るボタンへ
                        this.currentMenuIndex = backButtonIndex;
                    }
                } else if (this.currentMenuIndex === backButtonIndex) {
                    // 戻るボタンから下へ: レベル選択へ (ループ)
                    this.currentMenuIndex = 0;
                }
            }
        } else if (this.currentMenuContext === 'versus-setup') {
            // 対戦モード設定メニュー: 動的な構成に対応
            // モードオプション(2個) + CPUレベル(0または1個) + アクションボタン(2個)
            const currentItem = this.currentMenuItems[this.currentMenuIndex];

            if (direction === 'left' || direction === 'right') {
                // モードオプション間を左右キーで移動
                if (currentItem && currentItem.classList.contains('mode-option')) {
                    const modeOptions = this.currentMenuItems.filter(item => item.classList.contains('mode-option'));
                    const maxIndex = modeOptions.length - 1;

                    if (direction === 'left') {
                        this.currentMenuIndex = Math.max(0, this.currentMenuIndex - 1);
                    } else {
                        this.currentMenuIndex = Math.min(maxIndex, this.currentMenuIndex + 1);
                    }

                    // ラジオボタンを選択
                    const newItem = this.currentMenuItems[this.currentMenuIndex];
                    if (newItem && newItem.classList.contains('mode-option')) {
                        const radio = newItem.querySelector('input[type="radio"]');
                        if (radio) {
                            radio.checked = true;
                            radio.dispatchEvent(new Event('change'));
                            // メニューアイテムを更新(CPUレベルスライダーの表示/非表示が変わる可能性があるため)
                            setTimeout(() => {
                                this.updateMenuItems();
                            }, 50); // CSSアニメーションの完了を待つ
                        }
                    }
                } else if (currentItem && currentItem.id === 'cpu-level-item') {
                    // CPUレベルスライダーを左右キーで調整
                    const slider = currentItem.querySelector('#cpu-level-slider');
                    if (slider) {
                        const step = parseInt(slider.step) || 1;
                        const val = parseInt(slider.value);
                        if (direction === 'left') slider.value = Math.max(parseInt(slider.min), val - step);
                        else slider.value = Math.min(parseInt(slider.max), val + step);
                        slider.dispatchEvent(new Event('input'));
                    }
                }
            } else if (direction === 'up') {
                // 上キー: 前のセクションへ移動
                if (currentItem && currentItem.classList.contains('mode-option')) {
                    // モードオプションから上へ: 戻るボタンへ (ループ)
                    this.currentMenuIndex = this.currentMenuItems.length - 1;
                } else if (currentItem && currentItem.id === 'cpu-level-item') {
                    // CPUレベルから上へ: モードオプション(最初)へ
                    this.currentMenuIndex = 0;
                } else if (currentItem && currentItem.classList.contains('btn-start')) {
                    // アクションボタンから上へ
                    // CPUレベルスライダーがあればそこへ、なければモードオプションへ
                    const hasCpuLevel = this.currentMenuItems.some(item => item.id === 'cpu-level-item');
                    if (hasCpuLevel) {
                        this.currentMenuIndex = this.currentMenuItems.findIndex(item => item.id === 'cpu-level-item');
                    } else {
                        this.currentMenuIndex = 0;
                    }
                } else {
                    this.currentMenuIndex--;
                    if (this.currentMenuIndex < 0) {
                        this.currentMenuIndex = this.currentMenuItems.length - 1;
                    }
                }
            } else if (direction === 'down') {
                // 下キー: 次のセクションへ移動
                if (currentItem && currentItem.classList.contains('mode-option')) {
                    // モードオプションから下へ: CPUレベルまたは試合開始ボタンへ
                    const hasCpuLevel = this.currentMenuItems.some(item => item.id === 'cpu-level-item');
                    if (hasCpuLevel) {
                        this.currentMenuIndex = this.currentMenuItems.findIndex(item => item.id === 'cpu-level-item');
                    } else {
                        // CPUレベルがない場合は試合開始ボタンへ
                        this.currentMenuIndex = this.currentMenuItems.findIndex(item => item.classList.contains('btn-start'));
                    }
                } else if (currentItem && currentItem.id === 'cpu-level-item') {
                    // CPUレベルから下へ: 試合開始ボタンへ
                    this.currentMenuIndex = this.currentMenuItems.findIndex(item => item.classList.contains('btn-start'));
                } else if (currentItem && currentItem.classList.contains('btn-start')) {
                    // アクションボタン内を移動
                    this.currentMenuIndex++;
                    if (this.currentMenuIndex >= this.currentMenuItems.length) {
                        // 戻るボタンから下へ: モードオプションへ (ループ)
                        this.currentMenuIndex = 0;
                    }
                } else {
                    this.currentMenuIndex++;
                    if (this.currentMenuIndex >= this.currentMenuItems.length) {
                        this.currentMenuIndex = 0;
                    }
                }
            }
        } else if (direction === 'up') {
            this.currentMenuIndex--;
            if (this.currentMenuIndex < 0) {
                this.currentMenuIndex = this.currentMenuItems.length - 1;
            }
        } else if (direction === 'down') {
            this.currentMenuIndex++;
            if (this.currentMenuIndex >= this.currentMenuItems.length) {
                this.currentMenuIndex = 0;
            }
        } else if (direction === 'left' || direction === 'right') {
            if (this.currentMenuContext === 'versus-gameover') {
                // 対戦終了画面では左右キーでも上下移動と同じ挙動にする（操作性向上のため）
                if (direction === 'left') { // Up behavior
                    this.currentMenuIndex--;
                    if (this.currentMenuIndex < 0) this.currentMenuIndex = this.currentMenuItems.length - 1;
                } else { // Down behavior
                    this.currentMenuIndex++;
                    if (this.currentMenuIndex >= this.currentMenuItems.length) this.currentMenuIndex = 0;
                }
            }
            // ラジオボタンまたはスライダーの場合は左右で操作
            const currentItem = this.currentMenuItems[this.currentMenuIndex];
            if (currentItem && (currentItem.classList.contains('level-option') || currentItem.classList.contains('mode-option'))) {
                const radio = currentItem.querySelector('input[type="radio"]');
                if (radio) {
                    radio.checked = true;
                    // changeイベントを発火させてUIを更新
                    radio.dispatchEvent(new Event('change'));
                    this.updateMenuItems();
                }
            } else if (currentItem.type === 'range') {
                const step = parseInt(currentItem.step) || 1;
                const val = parseInt(currentItem.value);
                if (direction === 'left') currentItem.value = Math.max(parseInt(currentItem.min), val - step);
                else currentItem.value = Math.min(parseInt(currentItem.max), val + step);
                // イベントを発火させて表示を更新
                currentItem.dispatchEvent(new Event('input'));
            } else if (currentItem.type === 'number') {
                const val = parseInt(currentItem.value) || 0;
                const min = parseInt(currentItem.min) || 0;
                const max = parseInt(currentItem.max) || 100;
                if (direction === 'left') currentItem.value = Math.max(min, val - 1);
                else currentItem.value = Math.min(max, val + 1);
                currentItem.dispatchEvent(new Event('input'));
                currentItem.dispatchEvent(new Event('change'));
            } else if (currentItem.id === 'cpu-level-item') {
                const slider = currentItem.querySelector('#cpu-level-slider');
                if (slider) {
                    const step = parseInt(slider.step) || 1;
                    const val = parseInt(slider.value);
                    if (direction === 'left') slider.value = Math.max(parseInt(slider.min), val - step);
                    else slider.value = Math.min(parseInt(slider.max), val + step);
                    slider.dispatchEvent(new Event('input'));
                }
            }
        }

        try {
            this.sounds.playMenuMove(); // SE
        } catch (e) {
            console.error('Failed to play menu move sound', e);
        }
        this.updateMenuFocus();
    }

    activateMenuItem() {
        if (this.currentMenuItems.length === 0) return;

        const currentItem = this.currentMenuItems[this.currentMenuIndex];

        // ラジオボタンの場合
        if (currentItem.classList.contains('level-option') || currentItem.classList.contains('mode-option')) {
            const radio = currentItem.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
                this.updateMenuItems();
            }
        }
        // ボタン類の場合はクリック
        else {
            try {
                this.sounds.playMenuClick(); // SE
            } catch (e) {
                console.error('Failed to play menu click sound', e);
            }
            currentItem.click();
        }
    }

    goBack() {
        if (this.currentMenuContext === 'survival') {
            document.getElementById('back-to-main').click();
        } else if (this.currentMenuContext === 'esports') {
            document.getElementById('back-to-main-from-esports').click();
        } else if (this.currentMenuContext === 'sprint') {
            document.getElementById('back-to-esports-from-sprint').click();
        } else if (this.currentMenuContext === 'versus-setup') {
            document.getElementById('back-to-main-from-versus').click();
        } else if (this.currentMenuContext === 'practice') {
            document.getElementById('back-to-main-from-practice').click();
        } else if (this.currentMenuContext === 'dpc-menu') {
            document.getElementById('back-to-practice-from-dpc').click();
        } else if (this.currentMenuContext === 'ranking') {
            if (this.closeRankingBtn) this.closeRankingBtn.click();
        } else if (this.currentMenuContext === 'online-lobby') {
            const backBtn = document.getElementById('lobby-back-btn');
            if (backBtn) backBtn.click();
        }
    }

    // ========================================
    // 入力処理
    // ========================================
    processInput(action, isInitial = false) {
        // Debug
        console.log(`[DEBUG] processInput called: action=${action}, isInitial=${isInitial}, keysL=${this.keysState['moveLeft']}, keysR=${this.keysState['moveRight']}`);
        if (!action) return;

        switch (action) {
            case 'moveLeft':
                this.moveLeft();
                this.lastAction = 'moveLeft';
                this.dasTimer = parseInt(this.settings.get('dasDelay')) || 167;
                this.arrTimer = 0;
                break;
            case 'moveRight':
                this.moveRight();
                this.lastAction = 'moveRight';
                this.dasTimer = parseInt(this.settings.get('dasDelay')) || 167;
                this.arrTimer = 0;
                break;
            case 'softDrop':
                this.moveDown();
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
            case 'hold2':
                this.hold();
                break;
        }
    }

    handleInputs(deltaTime) {
        if (this.uiClickLocked) return;

        // モーダル表示中は物理入力をブロック
        if ((this.rankingModal && this.rankingModal.classList.contains('active')) ||
            (this.getElement('settings-modal') && this.getElement('settings-modal').classList.contains('active'))) {
            return;
        }



        // Settings with Safe Fallbacks
        const arrInterval = parseInt(this.settings.get('arrInterval')) || 33;
        const dasDelay = parseInt(this.settings.get('dasDelay')) || 167;
        const isInstantArr = arrInterval <= 0;

        // SOCD / Key Release Logic: Resume previous key if current is released
        if (this.lastAction === 'moveLeft' && !this.keysState['moveLeft'] && this.keysState['moveRight']) {
            this.lastAction = 'moveRight';
            // Treat as new press
            this.moveRight();
            this.dasTimer = dasDelay;
            this.arrTimer = 0;
        } else if (this.lastAction === 'moveRight' && !this.keysState['moveRight'] && this.keysState['moveLeft']) {
            this.lastAction = 'moveLeft';
            // Treat as new press
            this.moveLeft();
            this.dasTimer = dasDelay;
            this.arrTimer = 0;
        }

        // キーボード入力のDAS/ARR処理
        if (this.lastAction === 'moveLeft' && this.keysState['moveLeft']) {
            this.dasTimer -= deltaTime;
            if (this.dasTimer <= 0) {
                this.arrTimer -= deltaTime;
                // If interval is 0 (Instant), move all the way
                if (isInstantArr) {
                    while (!this.checkCollision(this.currentX - 1, this.currentY, this.currentRotation)) {
                        this.moveLeft();
                    }
                    this.arrTimer = 0;
                } else {
                    while (this.arrTimer <= 0) {
                        this.moveLeft();
                        this.arrTimer += arrInterval;
                    }
                }
            }
        } else if (this.lastAction === 'moveRight' && this.keysState['moveRight']) {
            this.dasTimer -= deltaTime;
            if (this.dasTimer <= 0) {
                this.arrTimer -= deltaTime;
                if (isInstantArr) {
                    while (!this.checkCollision(this.currentX + 1, this.currentY, this.currentRotation)) {
                        this.moveRight();
                    }
                    this.arrTimer = 0;
                } else {
                    while (this.arrTimer <= 0) {
                        this.moveRight();
                        this.arrTimer += arrInterval;
                    }
                }
            }
        }

        // ソフトドロップの連続処理
        if (this.keysState['softDrop']) {
            this.softDropTimer -= deltaTime;
            if (this.softDropTimer <= 0) {
                this.moveDown();
                this.softDropTimer = this.settings.get('softDropSpeed');
            }
        }
    }

    // ========================================
    // マウス操作（プラクティスモード用）
    // ========================================
    handleMouseDown(e) {
        if (this.gameMode !== 'practice') return;

        // モーダル表示中は操作をブロック
        if ((this.rankingModal && this.rankingModal.classList.contains('active')) ||
            (this.getElement('settings-modal') && this.getElement('settings-modal').classList.contains('active'))) {
            return;
        }

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / BLOCK_SIZE);
        const row = Math.floor((y + DISPLAY_OFFSET) / BLOCK_SIZE) + (BOARD_HEIGHT - VISIBLE_HEIGHT);

        if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
            this.isMouseDown = true;

            if (this.board[row][col]) {
                this.dragMode = 'remove';
                this.board[row][col] = 0;
            } else {
                this.dragMode = 'place';
                this.board[row][col] = '#888888';
            }

            this.lastDraggedCell = { row, col };
            this.draw();
        }
    }

    handleMouseMove(e) {
        if (!this.isMouseDown || this.gameMode !== 'practice') return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const col = Math.floor(x / BLOCK_SIZE);
        const row = Math.floor((y + DISPLAY_OFFSET) / BLOCK_SIZE) + (BOARD_HEIGHT - VISIBLE_HEIGHT);

        if (row >= 0 && row < BOARD_HEIGHT && col >= 0 && col < BOARD_WIDTH) {
            if (this.lastDraggedCell.row !== row || this.lastDraggedCell.col !== col) {
                if (this.dragMode === 'place') {
                    this.board[row][col] = '#888888';
                } else if (this.dragMode === 'remove') {
                    this.board[row][col] = 0;
                }

                this.lastDraggedCell = { row, col };
                this.draw();
            }
        }
    }

    handleMouseUp() {
        this.isMouseDown = false;
        this.dragMode = null;
    }

    destroy() {
        this.isDestroyed = true;
        this.isRunning = false;

        if (this.boundKeyHandler) {
            window.removeEventListener('keydown', this.boundKeyHandler);
            this.boundKeyHandler = null;
        }
        if (this.boundKeyUpHandler) {
            window.removeEventListener('keyup', this.boundKeyUpHandler);
            this.boundKeyUpHandler = null;
        }

        if (this.canvas) {
            if (this.boundMouseDownHandler) this.canvas.removeEventListener('mousedown', this.boundMouseDownHandler);
            if (this.boundMouseMoveHandler) this.canvas.removeEventListener('mousemove', this.boundMouseMoveHandler);
            if (this.boundMouseUpHandler) this.canvas.removeEventListener('mouseup', this.boundMouseUpHandler);
            this.canvas.removeEventListener('mouseleave', this.boundMouseUpHandler);
        }
        console.log(`[DEBUG][${this.instanceId}] Game instance destroyed.`);
    }

    // ========================================
    // イベントリスナー
    // ========================================
    setupEventListeners() {
        // 既存のリスナーがあれば確実に削除する (旧インスタンス破棄後の再利用や、複数回呼び出し対策)
        if (this.boundKeyHandler) {
            window.removeEventListener('keydown', this.boundKeyHandler);
            this.boundKeyHandler = null;
        }
        if (this.boundKeyUpHandler) {
            window.removeEventListener('keyup', this.boundKeyUpHandler);
            this.boundKeyUpHandler = null;
        }

        // キーボード操作
        this.boundKeyHandler = (e) => {
            if (!this.inputEnabled) return;

            // Raw Debug Log
            // console.log(`[DEBUG][${this.instanceId}] Keydown: code=${e.code}, repeat=${e.repeat}, running=${this.isRunning}`);

            if (this.uiClickLocked && e.type === 'keydown') return;

            const action = this.keyBindings.getAction(e.code);

            // Default prevent for game keys to stop scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }

            if (action) {
                const isModalActive = (this.rankingModal && this.rankingModal.classList.contains('active')) ||
                    (this.getElement('settings-modal') && this.getElement('settings-modal').classList.contains('active'));

                // モーダル表示中はメニューナビゲーションのみを許可し、他のグローバルアクションやゲームプレイを完全にブロック
                if (isModalActive) {
                    if (e.type === 'keydown') {
                        if (action === 'rotateRight') this.activateMenuItem();
                        else if (action === 'rotateLeft') this.goBack();
                        else if (['moveLeft', 'moveRight', 'softDrop', 'hardDrop'].includes(action)) {
                            const navMap = {
                                'moveLeft': 'left',
                                'moveRight': 'right',
                                'softDrop': 'down',
                                'hardDrop': 'up'
                            };
                            if (navMap[action]) this.navigateMenu(navMap[action]);
                        }
                    }
                    return;
                }

                // Reset / Return to Title / Pause (Keyboard parity with gamepad)
                // Global match actions should only be handled by the main instance (prefix === '')
                if (e.type === 'keydown' && !e.repeat) {
                    if (action === 'reset' || action === 'returnToTitle' || action === 'pause') {
                        // メインインスタンス、または P1 インスタンスのみがグローバルアクションを処理
                        if (this.prefix !== '' && this.prefix !== 'p1-') return;
                        this.handleButtonDown(action);
                        return;
                    }
                }

                // Sub-instances (p1-/p2-) should NOT handle menu navigation or global pause/reset
                if (this.prefix !== '') {
                    // Exception: Allow sub-instance to navigate menu if it's in Game Over state and Navigation is enabled (Versus Result Screen)
                    const isVersusResult = (this.gameOver && this.menuNavigationEnabled);
                    if (!isVersusResult && (!this.isRunning || this.isPaused || this.gameOver || this.isCountingDown)) return;
                }

                // Menu Navigation
                if (this.menuNavigationEnabled && !this.isRunning) {
                    if (e.type === 'keydown') {
                        if (action === 'rotateRight') this.activateMenuItem();
                        else if (action === 'rotateLeft') this.goBack();
                        else if (['moveLeft', 'moveRight', 'softDrop', 'hardDrop'].includes(action)) {
                            const navMap = {
                                'moveLeft': 'left',
                                'moveRight': 'right',
                                'softDrop': 'down',
                                'hardDrop': 'up'
                            };
                            if (navMap[action]) this.navigateMenu(navMap[action]);
                        }
                    }
                    return;
                }

                // Pause
                if (action === 'pause' && e.type === 'keydown' && this.isRunning && !this.gameOver) {
                    this.pause();
                    return;
                }

                // Gameplay
                if (this.isRunning && !this.isPaused && !this.gameOver && !this.isCountingDown) {
                    if (this.isClearingLines) return;

                    if (e.type === 'keydown') {
                        if (e.repeat) return; // Strict check for OS repeat
                        if (!this.keysState[action]) {
                            this.processInput(action, true);
                            this.keysState[action] = true;
                            if (this.gameMode === 'practice' || this.gameMode === '40lines') {
                                this.currentPieceActualMoves++;
                                if (action === 'softDrop') {
                                    this.currentPieceHasUsedSoftDrop = true;
                                }
                            }
                        }
                    }
                }

                // Countdown
                if (this.isCountingDown) {
                    if (e.type === 'keydown' && (action === 'moveLeft' || action === 'moveRight')) {
                        if (!this.keysState[action]) this.keysState[action] = true;
                    }
                }
            }
        };

        this.boundKeyUpHandler = (e) => {
            const action = this.keyBindings.getAction(e.code);
            // console.log(`[DEBUG] RAW KeyUp: code=${e.code}, action=${action}`);
            if (action) {
                console.log(`[DEBUG] KeyUp processed: ${action}`);
                this.keysState[action] = false;
            }
        };

        window.addEventListener('keydown', this.boundKeyHandler);
        window.addEventListener('keyup', this.boundKeyUpHandler);

        // マウス操作 (プラクティスモード用)
        this.boundMouseDownHandler = (e) => this.handleMouseDown(e);
        this.boundMouseMoveHandler = (e) => this.handleMouseMove(e);
        this.boundMouseUpHandler = () => this.handleMouseUp();

        if (this.canvas) {
            this.canvas.addEventListener('mousedown', this.boundMouseDownHandler);
            this.canvas.addEventListener('mousemove', this.boundMouseMoveHandler);
            this.canvas.addEventListener('mouseup', this.boundMouseUpHandler);
            this.canvas.addEventListener('mouseleave', this.boundMouseUpHandler);
        }

        // 対戦モード設定のリスナー
        const versusTypeRadios = document.querySelectorAll('input[name="versus-type"]');
        const cpuSettingsContainer = document.getElementById('cpu-settings-container');
        versusTypeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (cpuSettingsContainer) {
                    cpuSettingsContainer.style.display = e.target.value === 'cpu' ? 'flex' : 'none';
                }
            });
        });

        // 以下、UIボタンのイベントリスナー (メインインスタンスのみ)
        if (this.prefix === '') {
            const bindButton = (id, handler) => {
                const btn = document.getElementById(id);
                if (btn) {
                    // クローンしてリスナー重複を排除
                    const newBtn = btn.cloneNode(true);
                    btn.parentNode.replaceChild(newBtn, btn);
                    newBtn.addEventListener('click', () => {
                        if (this.uiClickLocked) return;
                        this.sounds.playMenuClick();
                        handler();
                        newBtn.blur();
                    });
                }
            };

            // メニューボタン
            bindButton('start-marathon', () => this.start('marathon'));
            bindButton('start-40lines', () => this.start('40lines'));
            bindButton('start-t20', () => this.start('t20'));
            bindButton('start-ren4', () => this.start('ren4'));
            bindButton('start-survival-normal', () => {
                const selectedLevel = parseInt(document.querySelector('input[name="survival-level"]:checked').value);
                this.start('survival', 'normal', selectedLevel);
            });
            bindButton('start-survival-serial', () => {
                const selectedLevel = parseInt(document.querySelector('input[name="survival-level"]:checked').value);
                this.start('survival', 'serial', selectedLevel);
            });
            // bindButton('start-practice', () => this.start('practice')); // Removed to use submenu

            // コントロールボタン
            bindButton('pause-btn', () => this.pause());
            bindButton('vs-pause-btn', () => this.pause());
            bindButton('quick-reset-btn', () => this.quickReset());
            bindButton('vs-quick-reset-btn', () => this.quickReset());
            bindButton('return-title-btn', () => {
                const optPanel = document.getElementById('practice-info-panel');
                if (optPanel) optPanel.style.display = 'none';
                this.menuNavigationEnabled = true;
                this.returnToTitle();
            });
            bindButton('vs-return-title-btn', () => {
                const optPanel = document.getElementById('practice-info-panel');
                if (optPanel) optPanel.style.display = 'none';
                this.menuNavigationEnabled = true;
                this.returnToTitle();
            });

            // ゲームオーバー画面のボタン
            const returnTitleGameoverBtn = document.getElementById('return-title-gameover-btn');
            if (returnTitleGameoverBtn) {
                const newBtn = returnTitleGameoverBtn.cloneNode(true);
                returnTitleGameoverBtn.parentNode.replaceChild(newBtn, returnTitleGameoverBtn);
                newBtn.addEventListener('click', () => {
                    try {
                        this.sounds.playMenuClick();
                    } catch (e) {
                        console.error('Sound play failed:', e);
                    }
                    const optPanel = document.getElementById('practice-info-panel');
                    if (optPanel) optPanel.style.display = 'none';
                    this.menuNavigationEnabled = true;
                    this.returnToTitle();
                });
            }

            bindButton('restart-btn', () => this.quickReset());
            bindButton('share-x-btn', () => this.shareToX());

            // 設定ボタン
            const openSettings = () => {
                this.loadKeyBindingsToUI();
                this.loadGameSettingsToUI();
                document.getElementById('settings-modal').classList.add('active');

                // オンライン対戦時はポーズをかけない
                const isOnline = this.p2 && this.p2.isOnlineRemote;
                if (isOnline) return;

                // 対戦中の場合は両インスタンスを一時停止
                if (this.p1 && this.p2) {
                    if (!this.p1.isPaused) this.p1.pause(true);
                    if (!this.p2.isPaused) this.p2.pause(true);
                }
                this.isPaused = true;
            };
            bindButton('settings-btn', openSettings);
            bindButton('vs-settings-btn', openSettings);

            // e-sportsメニュー制御
            const showEsportsBtn = document.getElementById('show-esports-menu');
            const esportsMenu = document.getElementById('esports-mode-select');
            const backToMainFromEsportsBtn = document.getElementById('back-to-main-from-esports');

            // メインメニューの定義（共通で使用）
            const mainMenu = document.getElementById('main-mode-select');
            const controlsGuide = document.querySelector('.controls-guide');

            if (showEsportsBtn && esportsMenu && mainMenu && backToMainFromEsportsBtn) {
                const newShow = showEsportsBtn.cloneNode(true);
                showEsportsBtn.parentNode.replaceChild(newShow, showEsportsBtn);

                const newBack = backToMainFromEsportsBtn.cloneNode(true);
                backToMainFromEsportsBtn.parentNode.replaceChild(newBack, backToMainFromEsportsBtn);

                newShow.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    mainMenu.style.display = 'none';
                    if (controlsGuide) controlsGuide.style.display = 'none';
                    esportsMenu.style.display = 'flex'; // gridではなくflexで縦並び
                    this.currentMenuContext = 'esports';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });

                newBack.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    esportsMenu.style.display = 'none';
                    mainMenu.style.display = 'flex';
                    if (controlsGuide) controlsGuide.style.display = 'block';
                    this.currentMenuContext = 'main';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });
            }

            // Sprintメニュー制御
            const showSprintBtn = document.getElementById('show-sprint-menu');
            const sprintMenu = document.getElementById('sprint-mode-select');
            const backToEsportsFromSprintBtn = document.getElementById('back-to-esports-from-sprint');

            if (showSprintBtn && sprintMenu && esportsMenu && backToEsportsFromSprintBtn) {
                const newShow = showSprintBtn.cloneNode(true);
                showSprintBtn.parentNode.replaceChild(newShow, showSprintBtn);

                const newBack = backToEsportsFromSprintBtn.cloneNode(true);
                backToEsportsFromSprintBtn.parentNode.replaceChild(newBack, backToEsportsFromSprintBtn);

                // 全国ランキングボタン
                if (this.showNationalRankingBtn && this.showNationalRankingBtn.parentNode) {
                    const newBtn = this.showNationalRankingBtn.cloneNode(true);
                    this.showNationalRankingBtn.parentNode.replaceChild(newBtn, this.showNationalRankingBtn);
                    this.showNationalRankingBtn = newBtn;
                    this.showNationalRankingBtn.addEventListener('click', () => {
                        this.sounds.playMenuClick();
                        if (this.rankingModal) {
                            // ゲーム中ならポーズする
                            if (this.isRunning && !this.isPaused) {
                                this.pause();
                            }
                            this.rankingModal.classList.add('active');
                            // デフォルトで40ラインを表示
                            const rankingTabsContainer = document.getElementById('ranking-tabs');
                            if (rankingTabsContainer) {
                                const tabBtns = rankingTabsContainer.querySelectorAll('.tab-btn');
                                tabBtns.forEach(b => b.classList.remove('active'));
                                const defaultTab = rankingTabsContainer.querySelector('[data-ranking-mode="40lines"]');
                                if (defaultTab) defaultTab.classList.add('active');
                            }
                            this.fetchRankingFromSupabase('40lines');

                            // キー入力対応
                            this.currentMenuContext = 'ranking';
                            this.currentMenuIndex = 1; // 40ラインタブ (DOM内ではclose-rankingが0番目、タブが1～6番目)
                            this.updateMenuItems();
                            this.updateMenuFocus();
                        }
                    });
                }

                // ランキングタブの制御
                const rankingTabsContainer = document.getElementById('ranking-tabs');
                if (rankingTabsContainer) {
                    const tabBtns = rankingTabsContainer.querySelectorAll('.tab-btn');
                    tabBtns.forEach(btn => {
                        const newTab = btn.cloneNode(true);
                        btn.parentNode.replaceChild(newTab, btn);
                        newTab.addEventListener('click', () => {
                            this.sounds.playMenuClick();
                            // 再取得
                            const updatedTabBtns = rankingTabsContainer.querySelectorAll('.tab-btn');
                            updatedTabBtns.forEach(b => b.classList.remove('active'));
                            newTab.classList.add('active');
                            const mode = newTab.getAttribute('data-ranking-mode');
                            this.fetchRankingFromSupabase(mode);
                        });
                    });
                }

                newShow.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    esportsMenu.style.display = 'none';
                    sprintMenu.style.display = 'flex';
                    this.currentMenuContext = 'sprint';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });

                newBack.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    sprintMenu.style.display = 'none';
                    esportsMenu.style.display = 'flex';
                    this.currentMenuContext = 'esports';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });


                // ランキングモーダル閉じる
                const closeRankingAction = () => {
                    this.sounds.playMenuClick();
                    if (this.rankingModal) {
                        this.rankingModal.classList.remove('active');
                    }
                    // esportsメニューに戻す
                    this.currentMenuContext = 'esports';
                    this.currentMenuIndex = 3; // 全国ランキングボタン
                    this.updateMenuItems();
                    this.updateMenuFocus();
                };

                if (this.closeRankingBtn) {
                    this.closeRankingBtn.addEventListener('click', closeRankingAction);
                }

                if (this.rankingModal) {
                    this.rankingModal.addEventListener('click', (e) => {
                        if (e.target === this.rankingModal) {
                            closeRankingAction();
                        }
                    });
                }
            }
            const showSurvivalBtn = document.getElementById('show-survival-menu');
            const survivalMenu = document.getElementById('survival-mode-select');
            const backToMainBtn = document.getElementById('back-to-main');

            if (showSurvivalBtn && survivalMenu && mainMenu && backToMainBtn) {
                const newShow = showSurvivalBtn.cloneNode(true);
                showSurvivalBtn.parentNode.replaceChild(newShow, showSurvivalBtn);

                const newBack = backToMainBtn.cloneNode(true);
                backToMainBtn.parentNode.replaceChild(newBack, backToMainBtn);

                newShow.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    // サバイバルは e-sports メニューから遷移するようになった
                    if (esportsMenu) esportsMenu.style.display = 'none';
                    else mainMenu.style.display = 'none'; // フォールバック

                    if (controlsGuide) controlsGuide.style.display = 'none';

                    survivalMenu.style.display = 'flex';
                    this.currentMenuContext = 'survival';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });

                newBack.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    survivalMenu.style.display = 'none';
                    // サバイバルからは e-sports メニューに戻る
                    if (esportsMenu) esportsMenu.style.display = 'flex';
                    else mainMenu.style.display = 'flex';

                    this.currentMenuContext = 'esports'; // ここも e-sports に戻す
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });
            }

            // Versus Mode Setup Menu Control
            const showVersusSetupBtn = document.getElementById('show-versus-setup');
            const versusSetupMenu = document.getElementById('versus-setup-menu');
            const startVersusMatchBtn = document.getElementById('start-versus-match');
            const backToMainFromVersusBtn = document.getElementById('back-to-main-from-versus');
            const cpuLevelSlider = document.getElementById('cpu-level-slider');
            const cpuLevelDisplay = document.getElementById('cpu-level-display');

            if (showVersusSetupBtn && versusSetupMenu && mainMenu && startVersusMatchBtn && backToMainFromVersusBtn) {
                // クローンしてリスナー重複排除
                const newShow = showVersusSetupBtn.cloneNode(true);
                showVersusSetupBtn.parentNode.replaceChild(newShow, showVersusSetupBtn);

                const newStart = startVersusMatchBtn.cloneNode(true);
                startVersusMatchBtn.parentNode.replaceChild(newStart, startVersusMatchBtn);

                const newBack = backToMainFromVersusBtn.cloneNode(true);
                backToMainFromVersusBtn.parentNode.replaceChild(newBack, backToMainFromVersusBtn);

                // Versus Type Radio Buttons
                const radioButtons = document.querySelectorAll('input[name="versus-type"]');
                const cpuSettingsContainer = document.getElementById('cpu-settings-container');
                const onlineSettingsContainer = document.getElementById('online-settings-container');

                const updateVersusUI = () => {
                    const type = document.querySelector('input[name="versus-type"]:checked')?.value;
                    if (type === 'online') {
                        if (cpuSettingsContainer) cpuSettingsContainer.style.display = 'none';
                        if (onlineSettingsContainer) onlineSettingsContainer.style.display = 'flex';
                        if (newStart) newStart.textContent = "ルーム入室・作成";
                    } else {
                        if (cpuSettingsContainer) cpuSettingsContainer.style.display = 'flex';
                        if (onlineSettingsContainer) onlineSettingsContainer.style.display = 'none';
                        if (newStart) newStart.textContent = "試合開始";
                    }
                };

                radioButtons.forEach(rb => {
                    rb.addEventListener('change', updateVersusUI);
                });

                newShow.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    mainMenu.style.display = 'none';
                    if (controlsGuide) controlsGuide.style.display = 'none';
                    versusSetupMenu.style.display = 'flex';
                    this.currentMenuContext = 'versus-setup';
                    this.currentMenuIndex = 0;

                    // 保存されたCPUレベルをUIに反映
                    const savedCpuLevel = this.settings.get('cpuLevel') || 1;
                    if (cpuLevelSlider) cpuLevelSlider.value = savedCpuLevel;
                    if (cpuLevelDisplay) cpuLevelDisplay.textContent = savedCpuLevel;

                    updateVersusUI(); // Initialize UI state

                    this.updateMenuItems();
                    this.updateMenuFocus();
                });

                newStart.addEventListener('click', () => {
                    this.sounds.playMenuClick();

                    const versusType = document.querySelector('input[name="versus-type"]:checked')?.value;
                    if (versusType === 'online') {
                        const roomId = document.getElementById('room-id-input')?.value;
                        if (roomId && window.networkManager) {
                            window.networkManager.joinRoom(roomId);
                        } else {
                            alert("ルームIDを入力してください");
                        }
                    } else {
                        versusSetupMenu.style.display = 'none';
                        this.toggleVersusMode(true);
                    }
                });

                const createRoomBtn = document.getElementById('create-room-btn');
                if (createRoomBtn) {
                    createRoomBtn.addEventListener('click', () => {
                        this.sounds.playMenuClick();
                        const roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
                        document.getElementById('room-id-input').value = roomId;
                        if (window.networkManager) {
                            window.networkManager.joinRoom(roomId);
                        }
                    });
                }

                // Lobby Buttons
                bindButton('lobby-ready-btn', () => {
                    if (window.networkManager) window.networkManager.toggleReady();
                });

                bindButton('copy-invite-link-btn', () => {
                    if (!window.networkManager || !window.networkManager.currentRoomId) return;
                    const roomId = window.networkManager.currentRoomId;
                    const url = new URL(window.location.href);
                    url.searchParams.set('room', roomId);

                    navigator.clipboard.writeText(url.toString()).then(() => {
                        const btn = document.getElementById('copy-invite-link-btn');
                        const originalText = btn.textContent;
                        btn.textContent = 'コピー完了！';
                        btn.style.color = '#00ff41';
                        btn.style.borderColor = '#00ff41';
                        setTimeout(() => {
                            btn.textContent = originalText;
                            btn.style.color = '#00f0ff';
                            btn.style.borderColor = '#00f0ff';
                        }, 2000);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                });
                bindButton('lobby-start-btn', () => {
                    if (window.networkManager) window.networkManager.requestStart();
                });
                bindButton('lobby-back-btn', () => {
                    if (window.networkManager) window.networkManager.leaveRoom();
                    document.getElementById('online-lobby-menu').style.display = 'none';
                    document.getElementById('versus-setup-menu').style.display = 'flex';
                    this.currentMenuContext = 'versus-setup';
                    this.updateMenuItems();
                });

                const lobbyWinSetsInput = document.getElementById('lobby-win-sets-input');
                if (lobbyWinSetsInput) {
                    lobbyWinSetsInput.addEventListener('change', (e) => {
                        if (this.isOnlineHost() && window.networkManager) {
                            window.networkManager.updateSettings({ winningSets: parseInt(e.target.value) });
                        }
                    });
                }

                newBack.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    versusSetupMenu.style.display = 'none';
                    mainMenu.style.display = 'flex';
                    if (controlsGuide) controlsGuide.style.display = 'block';
                    this.currentMenuContext = 'main';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });

                if (cpuLevelSlider && cpuLevelDisplay) {
                    cpuLevelSlider.addEventListener('input', (e) => {
                        const val = !!e.target ? e.target.value : cpuLevelSlider.value;
                        cpuLevelDisplay.textContent = val;
                        // 設定を即座に保存
                        this.settings.set('cpuLevel', parseInt(val));
                        this.settings.saveSettings();
                    });
                }
            }

            // Practice Mode Menu Control
            const showPracticeBtn = document.getElementById('start-practice');
            const practiceMenu = document.getElementById('practice-mode-select');
            const backToMainFromPracticeBtn = document.getElementById('back-to-main-from-practice');
            const startFreePracticeBtn = document.getElementById('start-practice-free');
            const openDpcMenuBtn = document.getElementById('btn-open-dpc-menu');

            // DPC Submenu elements
            const dpcMenu = document.getElementById('dpc-mode-select');
            const backToPracticeFromDpcBtn = document.getElementById('back-to-practice-from-dpc');
            const startDpcTBtn = document.getElementById('start-practice-dpc-t');
            const startDpcOBtn = document.getElementById('start-practice-dpc-o');
            const startDpcSBtn = document.getElementById('start-practice-dpc-s');
            const startDpcZBtn = document.getElementById('start-practice-dpc-z');
            const startDpcIBtn = document.getElementById('start-practice-dpc-i');
            const startDpcJBtn = document.getElementById('start-practice-dpc-j');
            const startDpcLBtn = document.getElementById('start-practice-dpc-l');
            const startDpcLeftOszBtn = document.getElementById('start-practice-dpc-left-osz');

            if (showPracticeBtn && practiceMenu && mainMenu && backToMainFromPracticeBtn) {
                const newShow = showPracticeBtn.cloneNode(true);
                showPracticeBtn.parentNode.replaceChild(newShow, showPracticeBtn);

                const newBack = backToMainFromPracticeBtn.cloneNode(true);
                backToMainFromPracticeBtn.parentNode.replaceChild(newBack, backToMainFromPracticeBtn);

                newShow.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    mainMenu.style.display = 'none';
                    if (controlsGuide) controlsGuide.style.display = 'none';
                    practiceMenu.style.display = 'flex';
                    this.currentMenuContext = 'practice';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });

                newBack.addEventListener('click', () => {
                    this.sounds.playMenuClick();
                    practiceMenu.style.display = 'none';
                    mainMenu.style.display = 'flex';
                    if (controlsGuide) controlsGuide.style.display = 'block';
                    this.currentMenuContext = 'main';
                    this.currentMenuIndex = 0;
                    this.updateMenuItems();
                    this.updateMenuFocus();
                });

                if (startFreePracticeBtn) {
                    const newBtn = startFreePracticeBtn.cloneNode(true);
                    startFreePracticeBtn.parentNode.replaceChild(newBtn, startFreePracticeBtn);
                    newBtn.addEventListener('click', () => {
                        this.sounds.playMenuClick();
                        practiceMenu.style.display = 'none';
                        this.start('practice');
                    });
                }

                if (openDpcMenuBtn && dpcMenu && backToPracticeFromDpcBtn) {
                    const newOpen = openDpcMenuBtn.cloneNode(true);
                    openDpcMenuBtn.parentNode.replaceChild(newOpen, openDpcMenuBtn);

                    const newDpcBack = backToPracticeFromDpcBtn.cloneNode(true);
                    backToPracticeFromDpcBtn.parentNode.replaceChild(newDpcBack, backToPracticeFromDpcBtn);

                    newOpen.addEventListener('click', () => {
                        this.sounds.playMenuClick();
                        practiceMenu.style.display = 'none';
                        dpcMenu.style.display = 'grid';
                        this.currentMenuContext = 'dpc-menu';
                        this.currentMenuIndex = 0;
                        this.updateMenuItems();
                        this.updateMenuFocus();
                    });

                    newDpcBack.addEventListener('click', () => {
                        this.sounds.playMenuClick();
                        dpcMenu.style.display = 'none';
                        practiceMenu.style.display = 'flex';
                        this.currentMenuContext = 'practice';
                        this.currentMenuIndex = 0;
                        this.updateMenuItems();
                        this.updateMenuFocus();
                    });
                }

                // DPC Buttons logic
                const setupDpcBtn = (btn, type) => {
                    if (btn) {
                        const newBtn = btn.cloneNode(true);
                        btn.parentNode.replaceChild(newBtn, btn);
                        newBtn.addEventListener('click', () => {
                            this.sounds.playMenuClick();
                            dpcMenu.style.display = 'none'; // Hide dpc submenu
                            this.start('practice', type);
                        });
                    }
                };

                setupDpcBtn(startDpcTBtn, 'dpc-t');
                setupDpcBtn(startDpcOBtn, 'dpc-o');
                setupDpcBtn(startDpcSBtn, 'dpc-s');
                setupDpcBtn(startDpcZBtn, 'dpc-z');
                setupDpcBtn(startDpcIBtn, 'dpc-i');
                setupDpcBtn(startDpcJBtn, 'dpc-j');
                setupDpcBtn(startDpcLBtn, 'dpc-l');
                setupDpcBtn(startDpcLeftOszBtn, 'dpc-left-osz');
            }
        }


        // グローバルな対戦終了イベント（子インスタンスからの要求を受け付け）
        // 重複登録防止のため、一旦削除（もしあれば）はできないが、メインインスタンスはシングルトン前提
        if (!window._versusExitListenerBound) {
            document.addEventListener('versus-exit', () => {
                this.setClickLock(500); // メインインスタンスをロック
                if (document.getElementById('versus-mode-container').style.display !== 'none') {
                    this.toggleVersusMode(false);
                }
            });
            window._versusExitListenerBound = true;
        }
    }

    destroy() {

        this.isDestroyed = true;

        // イベントリスナーの削除
        if (this.boundKeyHandler) window.removeEventListener('keydown', this.boundKeyHandler);
        if (this.boundKeyUpHandler) window.removeEventListener('keyup', this.boundKeyUpHandler);

        // マウスリスナーの削除
        if (this.canvas) {
            if (this.boundMouseDownHandler) this.canvas.removeEventListener('mousedown', this.boundMouseDownHandler);
            if (this.boundMouseMoveHandler) this.canvas.removeEventListener('mousemove', this.boundMouseMoveHandler);
            if (this.boundMouseUpHandler) {
                this.canvas.removeEventListener('mouseup', this.boundMouseUpHandler);
                this.canvas.removeEventListener('mouseleave', this.boundMouseUpHandler);
            }
        }

        // BGM停止
        this.sounds.stopBGM();
        this.isPaused = true;
        this.isRunning = false;
        this.gameOver = false;
    }

    checkAutoJoin() {
        const params = new URLSearchParams(window.location.search);
        const autoRoomId = params.get('room');
        if (autoRoomId && window.networkManager) {
            console.log('Auto-joining room detected:', autoRoomId);

            const attemptJoin = () => {
                // UIの初期化
                const mainMenu = document.getElementById('main-mode-select');
                const setupMenu = document.getElementById('versus-setup-menu');
                const onlineSettings = document.getElementById('online-settings-container');
                const roomIdInput = document.getElementById('room-id-input');
                const controlsGuide = document.querySelector('.controls-guide');

                if (mainMenu) mainMenu.style.display = 'none';
                if (setupMenu) setupMenu.style.display = 'block';
                if (onlineSettings) onlineSettings.style.display = 'flex';
                if (roomIdInput) roomIdInput.value = autoRoomId;
                if (controlsGuide) controlsGuide.style.display = 'none';

                const vsOnlineRadio = document.querySelector('input[name="versus-type"][value="online"]');
                if (vsOnlineRadio) vsOnlineRadio.checked = true;

                console.log('Requesting joinRoom...');
                window.networkManager.joinRoom(autoRoomId);
            };

            // Socket.io の接続待ちとUI反映のために少し長めに待機
            setTimeout(attemptJoin, 1000);
        }
    }

    // ========================================
    // タイトルに戻る処理
    // ========================================


    // --- Versus Mode Toggle Logic ---
    toggleVersusMode(showVersus) {
        const singlePlayerMode = document.getElementById('single-player-mode');
        const versusModeContainer = document.getElementById('versus-mode-container');

        if (showVersus) {
            if (singlePlayerMode) singlePlayerMode.style.display = 'none';
            if (versusModeContainer) versusModeContainer.style.display = 'flex';
            this.sounds.playMenuClick();

            // メインゲームを一時停止し、メニュー操作も無効化
            this.isPaused = true;
            this.menuNavigationEnabled = false;
            this.sounds.stopBGM();

            // P1インスタンス作成 (まだ存在しない場合)
            if (!this.p1) {
                // 設定とサウンドマネージャーは共有
                this.p1 = new TetrisGame(this.settings, this.sounds, 'p1-');
                this.p1.inputEnabled = true; // Force enable input for P1
            }
            // P2インスタンス作成 (CPU or 2P)
            if (!this.p2) {
                this.p2 = new TetrisGame(this.settings, this.sounds, 'p2-');
            }

            // argument override or UI selection
            const versusType = arguments.length > 1 ? arguments[1] : (document.querySelector('input[name="versus-type"]:checked')?.value || 'cpu');

            if (versusType === '2p') {
                this.p1.gamepadIndex = 0;
                this.p2.gamepadIndex = 1;
                this.p2.inputEnabled = true;
                this.p2.isCPU = false;
                this.p2.isOnlineRemote = false;
            } else if (versusType === 'online') {
                this.p1.gamepadIndex = 0;
                this.p2.gamepadIndex = null;
                this.p2.inputEnabled = false; // Input from network
                this.p2.isCPU = false;
                this.p2.isOnlineRemote = true; // IMPORTANT: Disable local update loop
            } else {
                this.p1.gamepadIndex = 0;
                this.p2.gamepadIndex = null;
                this.p2.inputEnabled = false; // CPUなので入力無効
                this.p2.isCPU = true;
                this.p2.isOnlineRemote = false;
            }

            // Update P2 Heading
            const p2Heading = document.getElementById('p2-player-heading');
            if (p2Heading) {
                if (versusType === 'cpu') {
                    const savedCpuLevel = this.settings.get('cpuLevel');
                    const cpuLevelSlider = document.getElementById('cpu-level-slider');
                    const cpuLevel = savedCpuLevel || (cpuLevelSlider ? parseInt(cpuLevelSlider.value) : 1);
                    p2Heading.textContent = `CPU (Lv.${cpuLevel})`;
                } else if (versusType === 'online') {
                    p2Heading.textContent = 'PLAYER 2 (ONLINE)';
                } else {
                    p2Heading.textContent = 'PLAYER 2';
                }
            }

            // CPUのレベルを設定 (保存された設定を優先、なければスライダーから取得)
            const savedCpuLevel = this.settings.get('cpuLevel');
            const cpuLevelSlider = document.getElementById('cpu-level-slider');
            const cpuLevel = savedCpuLevel || (cpuLevelSlider ? parseInt(cpuLevelSlider.value) : 1);
            this.p2.level = Math.max(1, Math.min(10, cpuLevel));

            // UI Adjustments for Online Mode
            const vsPauseBtn = document.getElementById('vs-pause-btn');
            const vsResetBtn = document.getElementById('vs-quick-reset-btn');
            if (vsPauseBtn) vsPauseBtn.style.display = (versusType === 'online') ? 'none' : 'block';
            if (vsResetBtn) vsResetBtn.style.display = (versusType === 'online') ? 'none' : 'block';


            // 対戦リンク
            this.p1.setOpponent(this.p2);
            this.p2.setOpponent(this.p1);

            // リザルト画面のボタンイベント設定 (P1用)
            // ※TetrisGame内ではなくここでバインドする（オーケストレーターの役割）
            const restartBtn = document.getElementById('p1-restart-btn');
            const backBtn = document.getElementById('p1-back-btn');

            // クローンしてリスナー重複削除
            if (restartBtn) {
                const newRestart = restartBtn.cloneNode(true);
                restartBtn.parentNode.replaceChild(newRestart, restartBtn);
                newRestart.addEventListener('click', () => {
                    if (this.uiClickLocked) return;
                    this.sounds.playMenuClick();
                    // 再戦
                    if (!this.p1 || !this.p2) {
                        console.warn('[versus] Cannot restart: P1 or P2 is missing.');
                        return;
                    }

                    const versusType = document.querySelector('input[name="versus-type"]:checked')?.value || 'cpu';
                    const cpuLevelSlider = document.getElementById('cpu-level-slider');
                    const cpuLevel = cpuLevelSlider ? parseInt(cpuLevelSlider.value) : 1;

                    if (versusType === 'online') {
                        window.networkManager.requestRestart();
                        const statusEl = document.getElementById('p1-vs-status-message');
                        if (statusEl) {
                            statusEl.textContent = '対戦相手の選択を待っています...';
                            statusEl.style.color = 'var(--accent-primary)';
                        }
                        // Disable menu navigation to "lock" inputs
                        this.menuNavigationEnabled = false;

                        // Disable buttons to prevent multiple requests
                        if (newRestart) {
                            newRestart.disabled = true;
                            newRestart.style.opacity = '0.5';
                            newRestart.classList.remove('menu-focused');
                        }
                        if (newBack) {
                            newBack.disabled = true;
                            newBack.style.opacity = '0.5';
                            newBack.classList.remove('menu-focused');
                        }
                        return;
                    }

                    this.p2.inputEnabled = (versusType === '2p');
                    this.p2.isCPU = (versusType === 'cpu');

                    this.p1.start('versus');
                    this.p2.start('versus', 'normal', cpuLevel);
                });
            }
            if (backBtn) {
                const newBack = backBtn.cloneNode(true);
                backBtn.parentNode.replaceChild(newBack, backBtn);
                newBack.addEventListener('click', () => {
                    if (this.uiClickLocked) return;
                    this.sounds.playMenuClick();

                    const versusType = document.querySelector('input[name="versus-type"]:checked')?.value || 'cpu';
                    if (versusType === 'online') {
                        window.networkManager.backToLobby();
                        return;
                    }

                    // タイトルに戻る
                    this.toggleVersusMode(false);
                });
            }

            // 対戦開始 (オンライン以外のみ即時開始)
            if (versusType !== 'online') {
                this.p1.start('versus');
                this.p2.start('versus', 'normal', cpuLevel);
            }

        } else {
            // 誤操作防止ロック
            this.uiClickLocked = true;
            setTimeout(() => { this.uiClickLocked = false; }, 500);

            if (versusModeContainer) versusModeContainer.style.display = 'none';

            // オーバーレイを非表示
            const p1GameOver = document.getElementById('p1-game-over-overlay');
            const p2GameOver = document.getElementById('p2-game-over-overlay');
            if (p1GameOver) p1GameOver.classList.remove('active');
            if (p2GameOver) p2GameOver.classList.remove('active');

            // ボタンの状態をリセット
            const restartBtn = document.getElementById('p1-restart-btn');
            const backBtn = document.getElementById('p1-back-btn');
            if (restartBtn) {
                restartBtn.disabled = false;
                restartBtn.style.opacity = '1';
            }
            if (backBtn) {
                backBtn.disabled = false;
                backBtn.style.opacity = '1';
            }

            // ステータスメッセージをクリア
            const p1Status = document.getElementById('p1-vs-status-message');
            const p2Status = document.getElementById('p2-vs-status-message');
            if (p1Status) p1Status.textContent = '';
            if (p2Status) p2Status.textContent = '';

            // メインメニューの各セクションを初期状態に戻す
            const mainMenu = document.getElementById('main-mode-select');
            const survivalMenu = document.getElementById('survival-mode-select');
            const versusSetupMenu = document.getElementById('versus-setup-menu');
            const onlineLobbyMenu = document.getElementById('online-lobby-menu');

            if (window.networkManager && window.networkManager.currentRoomId) {
                if (onlineLobbyMenu) onlineLobbyMenu.style.display = 'flex';
                if (mainMenu) mainMenu.style.display = 'none';
                this.currentMenuContext = 'online-lobby';
            } else {
                if (mainMenu) mainMenu.style.display = 'flex';
                this.currentMenuContext = 'main';
            }

            if (survivalMenu) survivalMenu.style.display = 'none';
            if (versusSetupMenu) versusSetupMenu.style.display = 'none';

            if (singlePlayerMode) singlePlayerMode.style.display = 'block';
            this.sounds.playMenuClick();

            // メインメニュー操作を有効化
            this.menuNavigationEnabled = true;
            this.isRunning = false; // メインゲームは停止状態（タイトル画面）
            this.isPaused = false;  // ポーズ状態解除
            this.gameOver = false;  // ゲームオーバー状態をリセット

            // 対戦終了処理
            if (this.p1) {
                this.p1.destroy();
                this.p1 = null;
            }
            if (this.p2) {
                this.p2.destroy();
                this.p2 = null;
            }

            // メインメニューに戻るためのBGM再開などは適宜
            this.sounds.setBGMContext('menu');
            this.sounds.startBGM();

            // メインインスタンスのイベントリスナーを復元 (ボタンのバインドを戻す)
            this.setupEventListeners();

            // サブタイトルをデフォルトに戻す
            const subtitle = this.getElement('subtitle');
            if (subtitle) {
                subtitle.textContent = '次の5個を見通せ、HOLDで戦略を';
            }

            // メインメニュー項目の再取得とフォーカスリセット
            // 少し遅延させてDOMの表示切替反映を待つ
            setTimeout(() => {
                const controlsGuide = document.querySelector('.controls-guide');
                if (controlsGuide) controlsGuide.style.display = 'block';
                this.updateMenuItems();
                this.currentMenuIndex = 0;
                this.updateMenuFocus();
            }, 50);
        }
    }

    // ========================================
    // ヘルパー: ID解決
    // ========================================
    getElement(id) {
        return document.getElementById(this.prefix + id);
    }

    setClickLock(ms = 500) {
        this.uiClickLocked = true;
        if (this._lockTimeout) clearTimeout(this._lockTimeout);
        this._lockTimeout = setTimeout(() => {
            this.uiClickLocked = false;
            this._lockTimeout = null;
        }, ms);
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
        const notification = this.getElement('tspin-notification');
        if (!notification) return;

        // 前の通知タイマーをクリア
        if (this.tspinTimeout) {
            clearTimeout(this.tspinTimeout);
        }

        // 特別なボーナス通知の場合
        if (type.startsWith('SURVIVAL BONUS')) {
            notification.className = 'tspin-notification survival-bonus';
            notification.textContent = type;
            this.tspinTimeout = setTimeout(() => {
                notification.className = 'tspin-notification';
            }, 2500);
            return;
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

    showBTBNotification() {
        const btbPop = document.getElementById('btb-pop');
        if (!btbPop) return;

        // 前のアニメーションをリセット
        btbPop.classList.remove('show');
        void btbPop.offsetWidth; // 強制再描画

        if (this.btbPopTimeout) {
            clearTimeout(this.btbPopTimeout);
        }

        btbPop.classList.add('show');

        // パーティー感のあるパーティクル
        this.createParticles(150, 150, '#FFD700', 15);
        this.createParticles(150, 150, '#FF8C00', 15);

        this.btbPopTimeout = setTimeout(() => {
            btbPop.classList.remove('show');
            this.btbPopTimeout = null;
        }, 1500);
    }


    // ========================================
    // 対戦機能
    // ========================================
    setOpponent(opponent) {
        this.opponent = opponent;
    }

    receiveGarbage(lines) {
        this.garbageQueue += lines;
        this.updateScore(); // メーター更新
    }

    // ========================================
    // CPU AI Logic
    // ========================================

    // ボードの評価
    getAIHeuristic(board, pieceType, pX, pY) {
        let aggregateHeight = 0;
        let completeLines = 0;
        let holes = 0;
        let bumpiness = 0;

        const heights = this.getHeights(board);

        // 各列の高さを計算
        for (let x = 0; x < BOARD_WIDTH; x++) {
            aggregateHeight += heights[x];
        }

        // 凸凹を計算
        for (let x = 0; x < BOARD_WIDTH - 1; x++) {
            bumpiness += Math.abs(heights[x] - heights[x + 1]);
        }

        // 穴を計算 (上部にブロックがある空マス)
        for (let x = 0; x < BOARD_WIDTH; x++) {
            let blockFound = false;
            for (let y = 0; y < BOARD_HEIGHT; y++) {
                if (board[y][x]) {
                    blockFound = true;
                } else if (blockFound && !board[y][x]) {
                    holes++;
                }
            }
        }

        // 完成ライン数を計算 (シミュレーション上のボードにはまだ消去が反映されていないので、ここでカウント)
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            if (board[y].every(cell => cell !== 0)) {
                completeLines++;
            }
        }

        // --- 評価の主眼: テトリスとT-spinの優先、B2B維持、状況に応じた防御 ---
        let lineScore = 0;
        const currentMaxHeight = Math.max(...heights);
        const isDefensiveMode = this.garbageQueue > 0;

        // Combo (REN) Awareness
        // If we are in a combo (combo > 0), prioritize KEEPING it alive.
        const isKombo = this.combo > 0;

        // 高さが危険な場合(12段以上)や防御が必要な場合は、1ラインでも消すことを優先（守備的）
        if (currentMaxHeight > 12 || isDefensiveMode) {
            const defensiveScores = {
                0: 0,
                1: 10.0, // 防御時は消去の価値を高める
                2: 18.0,
                3: 24.0,
                4: 35.0  // TETRIS! (高所ではリスクを抑えるため少し下げる 45.0 -> 35.0)
            };
            lineScore = defensiveScores[completeLines] || 0;

            // お邪魔が溜まっている時は、消去そのものに追加ボーナス
            if (isDefensiveMode && completeLines > 0) {
                lineScore += 10.0;
            }
        } else if (isKombo) {
            // REN継続モード: 単発消しでもボーナス
            const comboScores = {
                0: 0,
                1: 15.0, // Combo維持を推奨
                2: 20.0,
                3: 25.0,
                4: 50.0  // TETRISももちろん良し
            };
            lineScore = comboScores[completeLines] || 0;

            // コンボが続くほど価値を高める？ (現状は固定で十分)
        } else {
            // 安全かつお邪魔がない時は「テトリス」以外をペナルティ扱いにして「待ち」を誘発
            const tacticalScores = {
                0: 0,
                1: -12.0, // 単発消しは大減点
                2: -8.0,
                3: -4.0,
                4: 50.0   // TETRIS!
            };
            lineScore = tacticalScores[completeLines] || 0;

            // B2B維持ロジック: すでにB2B状態なら、テトリス/T-spin以外での消去に更なるペナルティ
            if (this.isBackToBack && completeLines > 0 && completeLines < 4) {
                // T-spin判定はこの後なので、ここでは一旦全ライン消しにペナルティ(T-spinボーナスで相殺される)
                lineScore -= 10.0;
            }
        }

        // T-spin検出 (SRSに準拠したより正確な判定)
        let tSpinBonus = 0;
        if (pieceType === 'T') {
            // Tミノの周辺4コーナーをチェック
            const centerX = pX + 1;
            const centerY = pY + 1;
            let filledCorners = 0;
            const corners = [
                [centerX - 1, centerY - 1], [centerX + 1, centerY - 1],
                [centerX - 1, centerY + 1], [centerX + 1, centerY + 1]
            ];
            for (const [cx, cy] of corners) {
                if (cy < 0 || cy >= BOARD_HEIGHT || cx < 0 || cx >= BOARD_WIDTH || board[cy][cx]) {
                    filledCorners++;
                }
            }
            // 3点以上埋まっていて、かつラインが消えるならT-spinとみなす
            if (filledCorners >= 3 && completeLines > 0) {
                tSpinBonus = 55.0; // B2B維持を含め、最強の評価
            }
        }

        // --- Smart Stacking: Well & Flatness ---
        // Identify "Wells" (1-wide gaps with significant depth)
        // A single deep well is GOOD (for Tetris). Multiple deep wells are BAD (messy).
        let wellScore = 0;
        let deepWells = 0;

        for (let x = 0; x < BOARD_WIDTH; x++) {
            const hLeft = (x === 0) ? BOARD_HEIGHT : heights[x - 1]; // Treat walls as infinite height for well detection? No, walls are solid.
            const hRight = (x === BOARD_WIDTH - 1) ? BOARD_HEIGHT : heights[x + 1];

            const hCurrent = heights[x];

            // Wall handling: if x=0, hLeft is effectively infinity (solid wall). 
            // Actually, for "depth", we compare neighbors.
            // If x=0, well depth is hRight - hCurrent.

            let dLeft = (x === 0) ? 99 : (heights[x - 1] - hCurrent);
            let dRight = (x === BOARD_WIDTH - 1) ? 99 : (heights[x + 1] - hCurrent);

            // A well is defined by being lower than BOTH sides.
            if (dLeft > 0 && dRight > 0) {
                const depth = Math.min(dLeft, dRight);

                if (depth >= 2) {
                    deepWells++;
                    // Bonus for the FIRST deep well (Ideal for I-piece)
                    // Currently, bumpiness penalizes this by 'depth'.
                    // We want to offset that penalty and add value.
                    // Bumpiness weight is -0.8 (increased from -0.3). 
                    // Depth 4 adds 4*0.8 = 3.2 penalty.
                    // We need around +1.0 per depth to offset and slightly reward.
                    wellScore += depth * 1.0;
                }
            }
        }

        // Penalize multiple wells (messy)
        if (deepWells > 1) {
            wellScore -= (deepWells - 1) * 30.0; // ペナルティを大幅強化 (10.0 -> 30.0)
        }

        // 高所での待ちを抑制 (10段以上で溝がある場合は更なるペナルティ)
        if (currentMaxHeight > 10 && deepWells > 0) {
            wellScore -= 20.0;
        }


        // 重み付け
        const heightWeight = -0.5;
        const holeWeight = -15.0; // 穴は厳禁
        const bumpWeight = -0.8; // 凸凹をより嫌う (Flat Stacking)

        // DEATH PREVENTION (Spawn Blocking Check)
        // ... (Already added in previous step, ensuring it persists if I edit around)
        // Actually, this block is replacing lines 4456-4459. 
        // My previous edit added prevention logic BEFORE this return.  
        // Wait, I need to make sure I don't overwrite the Death Prevention logic if it was inserted *before* the weights.
        // My previous edit inserted `// DEATH PREVENTION` *before* `return (heightWeight...`
        // Line 4456 is `// 重み付け`.
        // The Death Prevention logic was inserted at roughly 4458. 
        // I should view the file again to be safe about where I am replacing.
        // But for "Combo Awareness", that is earlier in the function (lines 4401+). 
        // I will split this into two edits: 
        // 1. Combo Logic (lines 4401-4432)
        // 2. Well Logic (inserted before weights or as part of heuristic calculation)

        /* Splitting into separate tool calls for safety */

        // DEATH PREVENTION (Spawn Blocking Check)
        // Spawn is usually around x=3-6, y=19 (index). 
        // If blocks exist in the spawn zone, the next piece will die immediately.
        // We check a safe vertical range around the spawn point (e.g., y=18, 19).
        let spawnBlocked = false;
        const spawnY = BOARD_HEIGHT - VISIBLE_HEIGHT - 1; // 19
        // Check center columns (3, 4, 5, 6)
        for (let c = 3; c <= 6; c++) {
            // If block exists at or above spawn Y (indexes <= spawnY)
            // Wait, smaller Y index = higher up. 
            // 0 is top. 19 is spawn. 
            // If block is at 19, it blocks spawn. 
            // If block is at 18, it definitely blocks spawn.
            if (board[spawnY][c] || board[spawnY - 1][c]) {
                spawnBlocked = true;
                break;
            }
        }

        if (spawnBlocked) {
            return -1000000; // Massive penalty for suicide
        }

        return (heightWeight * aggregateHeight) +
            lineScore +
            tSpinBonus +
            (holeWeight * holes) +
            (bumpWeight * bumpiness) +
            wellScore;
    }

    simulateAIDrop(board, type, rotation, x) {
        if (!TETROMINOS[type]) return null;
        const shape = TETROMINOS[type].shape[rotation];

        // 有効な横位置かチェック (衝突判定)
        if (this.checkCollisionWithBoard(board, x, 0, shape)) return null;

        // どこまで落ちるか
        let y = 0;
        while (!this.checkCollisionWithBoard(board, x, y + 1, shape)) {
            y++;
        }

        // ボードをクローンしてミノを固定
        const newBoard = board.map(row => [...row]);
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (shape[r][c]) {
                    const targetY = y + r;
                    const targetX = x + c;
                    if (targetY >= 0 && targetY < BOARD_HEIGHT && targetX >= 0 && targetX < BOARD_WIDTH) {
                        newBoard[targetY][targetX] = TETROMINOS[type].color;
                    }
                }
            }
        }
        return newBoard;
    }

    // シミュレーション用にライン消去を反映したボードを返す
    simulateLineClear(board) {
        const cleanedBoard = board.filter(row => row.some(cell => cell === 0));
        while (cleanedBoard.length < BOARD_HEIGHT) {
            cleanedBoard.unshift(new Array(BOARD_WIDTH).fill(0));
        }
        return cleanedBoard;
    }

    checkCollisionWithBoard(board, x, y, shape) {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (shape[r][c]) {
                    const nextX = x + c;
                    const nextY = y + r;
                    if (nextX < 0 || nextX >= BOARD_WIDTH || nextY >= BOARD_HEIGHT) return true;
                    if (nextY >= 0 && board[nextY][nextX]) return true;
                }
            }
        }
        return false;
    }

    findBestAIMove() {
        if (!this.currentPiece) return;

        let bestScore = -Infinity;
        let bestX = 0;
        let bestRotation = 0;
        let bestUseHold = false;

        // 現在のミノとホールド中のミノを両方試す
        const piecesToTry = [
            { type: this.currentPiece, isHold: false }
        ];

        // ホールドが可能な場合のみホールドを試す
        if (this.canHold) {
            piecesToTry.push({ type: this.holdPiece || this.nextQueue[0], isHold: true });
        }

        const nextType1 = this.nextQueue[0];
        const nextType2 = this.nextQueue[1];

        // Dynamic Beam Width based on Level
        // Dynamic Beam Width based on Level
        let beamWidth1 = 8;
        let beamWidth2 = 2;

        if (this.level >= 9) {
            beamWidth1 = 12;
            beamWidth2 = 4;
        } else if (this.level >= 7) {
            beamWidth1 = 10;
            beamWidth2 = 3;
        }

        // 1手目の全候補を収集
        const moveCandidates1 = [];
        for (const p of piecesToTry) {
            if (!p.type) continue;
            const piece = TETROMINOS[p.type];

            // Oミノの場合は回転を試行しない（0のみ）
            const maxRot1 = (p.type === 'O') ? 1 : piece.shape.length;

            for (let rotation = 0; rotation < maxRot1; rotation++) {
                for (let x = -2; x < BOARD_WIDTH; x++) {
                    const newBoard1 = this.simulateAIDrop(this.board, p.type, rotation, x);
                    if (newBoard1) {
                        const score1 = this.getAIHeuristic(newBoard1, p.type, x, this.getSimulatedY(this.board, p.type, rotation, x));
                        moveCandidates1.push({
                            score1,
                            type1: p.type,
                            rot1: rotation,
                            x1: x,
                            board1: newBoard1,
                            isHold: p.isHold
                        });
                    }
                }
            }
        }

        // 1手目の候補を有望な上位数手に絞り込む (ビームサーチ)
        moveCandidates1.sort((a, b) => b.score1 - a.score1);
        const topMoves1 = moveCandidates1.slice(0, beamWidth1);

        for (const m1 of topMoves1) {
            // --- 2手目（Next 1）のシミュレーション ---
            const cleanedBoard1 = this.simulateLineClear(m1.board1);
            const moveCandidates2 = [];
            const piece2 = TETROMINOS[nextType1];

            const maxRot2 = (nextType1 === 'O') ? 1 : piece2.shape.length;

            for (let rot2 = 0; rot2 < maxRot2; rot2++) {
                for (let x2 = -2; x2 < BOARD_WIDTH; x2++) {
                    const newBoard2 = this.simulateAIDrop(cleanedBoard1, nextType1, rot2, x2);
                    if (newBoard2) {
                        const score2 = this.getAIHeuristic(newBoard2, nextType1, x2, this.getSimulatedY(cleanedBoard1, nextType1, rot2, x2));
                        moveCandidates2.push({ score2, board2: newBoard2 });
                    }
                }
            }

            // 2手目も上位数手に絞り込む
            moveCandidates2.sort((a, b) => b.score2 - a.score2);
            const topMoves2 = moveCandidates2.slice(0, beamWidth2);

            for (const m2 of topMoves2) {
                // --- 3手目（Next 2）のシミュレーション ---
                const cleanedBoard2 = this.simulateLineClear(m2.board2);
                let bestNext3Score = -Infinity;
                const piece3 = TETROMINOS[nextType2];

                const maxRot3 = (nextType2 === 'O') ? 1 : piece3.shape.length;

                for (let rot3 = 0; rot3 < maxRot3; rot3++) {
                    for (let x3 = -2; x3 < BOARD_WIDTH; x3++) {
                        const newBoard3 = this.simulateAIDrop(cleanedBoard2, nextType2, rot3, x3);
                        if (newBoard3) {
                            const score3 = this.getAIHeuristic(newBoard3, nextType2, x3, this.getSimulatedY(cleanedBoard2, nextType2, rot3, x3));
                            if (score3 > bestNext3Score) {
                                bestNext3Score = score3;
                            }
                        }
                    }
                }

                // 3手合計のスコアで評価 (わずかにランダム性を加えてタイを回避)
                const totalScore = m1.score1 + m2.score2 + bestNext3Score + (Math.random() * 0.1);

                if (totalScore > bestScore) {
                    bestScore = totalScore;
                    bestX = m1.x1;
                    bestRotation = m1.rot1;
                    bestUseHold = m1.isHold;
                }
            }
        }

        this.aiTargetX = bestX;
        this.aiTargetRotation = bestRotation;
        this.aiShouldHold = bestUseHold;

        // ホールドが必要な場合は即座に実行
        if (this.aiShouldHold) {
            this.hold();
            // ホールド後に新しいミノのベストムーブを再計算
            this.findBestAIMove();
            return;
        }

        // Calculate Target Y for pathfinding
        const bestY = this.getSimulatedY(this.board, this.currentPiece, bestRotation, bestX);

        // Calculate Optimal Path
        this.aiActionQueue = this.getOptimalPath(bestX, bestY, bestRotation);
        /* 
        // Fallback if pathfinding fails (should be rare/impossible unless bug)
        if (!this.aiActionQueue) {
             // Fallback to naive logic (will be handled in executeAIMove if queue is empty)
             this.aiActionQueue = [];
        }
        */

        this.aiState = 'moving';
    }

    runAI(deltaTime) {
        if (this.gameOver || this.isPaused || !this.isRunning) return;

        if (this.aiState === 'idle') {
            // ミノが出現して指定時間待機
            // Lv1: 200ms -> Lv10: ~10ms (Current Lv5 equivalent)
            const thinkingDelay = Math.max(10, 200 - (this.level - 1) * 21);
            this.aiLastActionTime += deltaTime;
            if (this.aiLastActionTime > thinkingDelay) {
                this.findBestAIMove();
                this.aiLastActionTime = 0;
            }
        } else if (this.aiState === 'moving') {
            this.aiLastActionTime += deltaTime;

            // Dynamic Move Delay (Action Speed)
            let moveDelay = 30; // Lv1-5 (Default)
            if (this.level >= 8) moveDelay = 10; // Fast (Lv10 Target)
            else if (this.level >= 6) moveDelay = 20; // Medium Fast

            // 指定の操作間隔で動かす
            if (this.aiLastActionTime >= moveDelay) {
                this.executeAIMove();
                this.aiLastActionTime = 0;
            }
        }
    }

    executeAIMove() {
        if (!this.currentPiece) return;

        // Finesse Execution Logic
        if (this.aiActionQueue && this.aiActionQueue.length > 0) {
            const action = this.aiActionQueue[0];
            let actionDone = false;
            let inputsUsed = 0;

            switch (action.type) {
                case 'tap':
                case 'move': // Handle both names
                    if (!action.started) {
                        inputsUsed = 1;
                        action.started = true;
                    }
                    var success = false;
                    if (action.dir === 'left') success = this.moveLeft();
                    else success = this.moveRight();

                    if (!success) { // Failed (collision)
                        this.aiActionQueue = []; // Abort plan
                        return; // Fallback next frame
                    }
                    actionDone = true;
                    break;

                case 'rotate':
                    if (!action.started) {
                        inputsUsed = 1;
                        action.started = true;
                    }
                    var success = false;
                    if (action.dir === 'left') success = this.rotateLeft();
                    else success = this.rotateRight();

                    if (!success) {
                        this.aiActionQueue = [];
                        return;
                    }
                    actionDone = true;
                    break;

                case 'das':
                    if (!action.started) {
                        inputsUsed = 1;
                        action.started = true;
                    }
                    // Loop move until target reached
                    let moved = false;
                    let stuck = false;

                    if (action.dir === 'left') {
                        if (this.currentX > action.toX) {
                            if (this.moveLeft()) moved = true;
                            else stuck = true;
                        }
                    } else {
                        if (this.currentX < action.toX) {
                            if (this.moveRight()) moved = true;
                            else stuck = true;
                        }
                    }

                    if (stuck && !moved) {
                        // Stuck (e.g. wall or block)
                        this.aiActionQueue = [];
                        return;
                    }

                    if (!moved) {
                        // Reached target
                        actionDone = true;
                    }
                    break;

                case 'drop':
                    this.moveDown(); // Soft drop (no input count usually)
                    actionDone = true;
                    break;

                case 'hardDrop':
                    inputsUsed = 1;
                    this.hardDrop();
                    actionDone = true;
                    this.aiState = 'idle'; // Finished
                    break;
            }

            // Apply Input Count
            // Note: We only count for 'practice' mode stats, but AI doesn't usually track stats?
            // User requested "CPU also ... 100% optimization rate". 
            // This implies the rate IS displayed for CPU? Or they are watching the display?
            // If CPU is playing, `this.inputEnabled` might be false?
            // If `inputEnabled` is false (Auto Demo), stats might not update?
            // Let's force update if it's the tracked metrics.
            if (inputsUsed > 0) {
                this.currentPieceActualMoves += inputsUsed;
            }

            if (actionDone) {
                this.aiActionQueue.shift();
            }
            return;
        }

        // --- Fallback / Recovery Logic (Old Logic) ---
        // If queue is empty but we haven't dropped (e.g. queue was cleared due to error),
        // or if we are in recovery mode.

        let moveAttempted = false;
        let rotationAttempted = false;
        let moveSuccess = false;
        let rotationSuccess = false;

        // 1. X座標を合わせる (コード上の実行は優先)
        if (this.currentX !== this.aiTargetX) {
            moveAttempted = true;
            if (this.currentX < this.aiTargetX) {
                moveSuccess = this.moveRight();
            } else {
                moveSuccess = this.moveLeft();
            }
            if (moveSuccess) {
                this.dropCounter = 0;
            }
        }

        // 2. 回転を合わせる (同時実行)
        if (this.currentRotation !== this.aiTargetRotation) {
            rotationAttempted = true;
            // 最短経路を計算 (4方向なので、差が3なら逆回転の方が速い)
            const diff = (this.aiTargetRotation - this.currentRotation + 4) % 4;
            if (diff === 3) {
                rotationSuccess = this.rotateLeft();
            } else {
                rotationSuccess = this.rotateRight();
            }
            if (rotationSuccess) {
                this.dropCounter = 0;
            }
        }

        // 3. 進行状況のチェック
        const stillNeedsMove = this.currentX !== this.aiTargetX;
        const stillNeedsRotation = this.currentRotation !== this.aiTargetRotation;

        if (!stillNeedsMove && !stillNeedsRotation) {
            // 目標到達
            this.hardDrop();
            this.currentPieceActualMoves++; // Count HD
            this.aiState = 'idle';
            this.aiFailCount = 0;
            return;
        }

        // 4. 失敗判定とリカバリー
        // 試みたアクションがすべて失敗した場合、または長時間同じ場所で停滞している場合
        const actionFailed = (moveAttempted && !moveSuccess) || (rotationAttempted && !rotationSuccess);

        if (actionFailed) {
            this.aiFailCount++;

            // 【再強化】詰まった時のリカバリー（あがき動作）
            // 数フレームごとに異なる回転や小刻みな移動を試して隙間を探す
            if (this.aiFailCount >= 2) {
                // Clear Queue if we are stuck to allow fallback logic to take over completely
                this.aiActionQueue = [];

                // 目標座標への方向を計算
                let moveDir = 0;
                if (this.currentX < this.aiTargetX) moveDir = 1;
                else if (this.currentX > this.aiTargetX) moveDir = -1;

                // あがき中も常に目標方向への移動入力を試みる（長押し効果）
                if (moveDir === 1) this.moveRight();
                if (moveDir === -1) this.moveLeft();

                // 回転ロジック (あがき):
                // User Request: "Right x4 -> Left x4 -> Alternate 2 times each"
                // failCount starts around 2 when entering this block.
                const f = this.aiFailCount - 1; // 1-based index for simplicity (starts at 1)
                let rotateDir = 0; // 0: None, 1: Right, -1: Left

                // Phase 1: Right x4 (Frames 1-4)
                if (f <= 4) {
                    rotateDir = 1;
                }
                // Phase 2: Left x4 (Frames 5-8)
                else if (f <= 8) {
                    rotateDir = -1;
                }
                // Phase 3: Alternate 2 times each (RR LL RR LL...)
                else {
                    // Sequence from 9+: 
                    // 9,10 -> R
                    // 11,12 -> L
                    // 13,14 -> R
                    // ...
                    // (f - 9) // 2
                    // 0 -> Even -> R
                    // 1 -> Odd -> L
                    const cycle = Math.floor((f - 9) / 2);
                    rotateDir = (cycle % 2 === 0) ? 1 : -1;
                }

                if (rotateDir !== 0) {
                    const isIT = (this.currentPiece === 'I' || this.currentPiece === 'T');
                    const isAligned = (this.currentX === this.aiTargetX);

                    if (!isIT || isAligned) {
                        if (rotateDir === 1) this.rotateRight();
                        else if (rotateDir === -1) this.rotateLeft();
                    }
                }
            }

            // あがき失敗後のリカバリー策 (2周程度 = 20-30フレーム目安)
            if (this.aiFailCount > 30) {
                if (this.canHold && !this.aiShouldHold) {
                    // ホールドして仕切り直し
                    this.hold();
                    this.aiState = 'idle';
                    this.aiFailCount = 0;
                    return;
                } else {
                    // ホールドできない、または既にホールド済なら、
                    // ターゲットをリセットして再思考 (ランダム性により別の場所を選ぶ可能性に期待)
                    this.aiState = 'idle';
                    this.aiFailCount = 0;
                    return;
                }
            }
        } else if (moveSuccess || rotationSuccess) {
            // 何らかの進展があれば失敗カウントを少しずつ下げる（蓄積リセット）
            this.aiFailCount = Math.max(0, this.aiFailCount - 1);
        }
    }

    // サバイバルモード用：せり上がりロジック (既存) + 対戦ガベージ処理
    addGarbageLine() {
        if (this.garbageQueue <= 0) return;

        // 出現位置（可視範囲の最上段中央付近）にお邪魔ミノが到達するかチェック
        const spawnX = Math.floor((this.BOARD_WIDTH || 10) / 2) - 2;
        const visibleTop = (this.BOARD_HEIGHT || 40) - (this.VISIBLE_HEIGHT || 20);
        const targetRows = [visibleTop, visibleTop + 1];

        let garbageReachesTop = false;
        for (let r of targetRows) {
            for (let c = 0; c < (this.BOARD_WIDTH || 10); c++) {
                if (this.board[r][c] !== 0) {
                    garbageReachesTop = true;
                    break;
                }
            }
            if (garbageReachesTop) break;
        }

        /*
        if (garbageReachesTop) {
            this.showGameOver();
            return;
        }
        */

        this.showGarbageWarning(); // 簡易演出

        // 一度に最大4ラインまでせり上がり
        const linesToRise = Math.min(this.garbageQueue, 4);

        if (this.gameMode === 'versus') {
            for (let k = 0; k < linesToRise; k++) {
                let holeIndex;
                if (this.lastVersusHoleIndex !== null && Math.random() < 0.7) {
                    holeIndex = this.lastVersusHoleIndex;
                } else {
                    holeIndex = Math.floor(Math.random() * BOARD_WIDTH);
                    this.lastVersusHoleIndex = holeIndex;
                }

                for (let y = 0; y < BOARD_HEIGHT - 1; y++) {
                    this.board[y] = [...this.board[y + 1]];
                }
                this.board[BOARD_HEIGHT - 1] = new Array(BOARD_WIDTH).fill('#7d7d7d');
                this.board[BOARD_HEIGHT - 1][holeIndex] = 0;
            }
        } else if (this.gameMode === 'survival') {
            const holeIndex = Math.floor(Math.random() * BOARD_WIDTH);
            for (let k = 0; k < linesToRise; k++) {
                for (let y = 0; y < BOARD_HEIGHT - 1; y++) {
                    this.board[y] = [...this.board[y + 1]];
                }
                const currentHole = this.survivalType === 'serial' ? holeIndex : Math.floor(Math.random() * BOARD_WIDTH);
                this.board[BOARD_HEIGHT - 1] = new Array(BOARD_WIDTH).fill('#7d7d7d');
                this.board[BOARD_HEIGHT - 1][currentHole] = 0;
            }
            this.totalReceivedAttacks += linesToRise;
        }

        this.garbageQueue -= linesToRise;

        // ピースをせり上がり分だけ持ち上げる
        if (this.currentPiece) {
            this.currentY -= linesToRise;
            // 持ち上げた先で衝突した場合は既にGameOver判定済み or ここで即時固定などの処理が必要だが、
            // 簡易的に補正のみ行う
        }

        this.draw();
        this.showMessage('GARBAGE RECEIVED!', 'warning');
        this.updateScore(); // メーター更新

        // Broadcast the board change immediately so the opponent sees the garbage rise
        if (this.gameMode === 'versus' && window.networkManager && !this.isOnlineRemote) {
            this.broadcastLock(); // This sends pieceLocked but effectively syncs the board
        }

        if (!this.inputEnabled) this.aiState = 'idle';
    }

    showGarbageWarning() {
        this.shakeBoard();
        // ボードを赤くフラッシュさせる（簡易的にCSSクラス付与などで対応可能だが、ここでは揺れのみ）
    }

    showRenNotification(renCount) {
        const notification = this.getElement('ren-notification');
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
        const notification = this.getElement('tspin-notification');

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
        const settingsModal = document.getElementById('settings-modal');
        const closeSettings = document.getElementById('close-settings');
        const saveSettings = document.getElementById('save-settings');
        const resetDefaults = document.getElementById('reset-defaults');
        const messageDiv = document.getElementById('keybind-message');

        let currentEditingAction = null;

        // 設定ボタンのイベントリスナーはsetupEventListenersで登録済み

        // スライダーのリアルタイム表示更新
        const dasSlider = document.getElementById('setting-das');
        const arrSlider = document.getElementById('setting-arr');
        const dasValue = document.getElementById('value-das');
        const arrValue = document.getElementById('value-arr');
        const practiceGravitySlider = document.getElementById('setting-practice-gravity');
        const practiceGravityValue = document.getElementById('value-practice-gravity');
        const practiceLockDelaySlider = document.getElementById('setting-practice-lock-delay');
        const practiceLockDelayValue = document.getElementById('value-practice-lock-delay');

        dasSlider.addEventListener('input', (e) => {
            dasValue.textContent = e.target.value;
            this.settings.set('dasDelay', parseInt(e.target.value));
            this.settings.saveSettings();
        });

        arrSlider.addEventListener('input', (e) => {
            arrValue.textContent = e.target.value;
            this.settings.set('arrInterval', parseInt(e.target.value));
            this.settings.saveSettings();
        });

        const softdropSlider = document.getElementById('setting-softdrop');
        const softdropValue = document.getElementById('value-softdrop');
        softdropSlider.addEventListener('input', (e) => {
            softdropValue.textContent = e.target.value;
            this.settings.set('softDropSpeed', parseInt(e.target.value));
            this.settings.saveSettings();
        });

        practiceGravitySlider.addEventListener('input', (e) => {
            practiceGravityValue.textContent = e.target.value;
            this.settings.set('practiceGravity', parseInt(e.target.value));
            this.settings.saveSettings();
        });

        practiceLockDelaySlider.addEventListener('input', (e) => {
            practiceLockDelayValue.textContent = e.target.value;
            this.settings.set('practiceLockDelay', parseInt(e.target.value));
            this.settings.saveSettings();
        });

        const seVolumeSlider = document.getElementById('setting-se-volume');
        const seVolumeValue = document.getElementById('value-se-volume');
        seVolumeSlider.addEventListener('input', (e) => {
            seVolumeValue.textContent = e.target.value;
            this.settings.set('seVolume', parseInt(e.target.value) / 100);
            this.sounds.updateVolume();
            if (this._seTestTimeout) clearTimeout(this._seTestTimeout);
            this._seTestTimeout = setTimeout(() => this.sounds.playMenuMove(), 100);
        });

        const seMutedCheckbox = document.getElementById('setting-se-muted');
        seMutedCheckbox.addEventListener('change', (e) => {
            this.settings.set('seMuted', e.target.checked);
            this.sounds.updateVolume();
        });

        const bgmVolumeSlider = document.getElementById('setting-bgm-volume');
        const bgmVolumeValue = document.getElementById('value-bgm-volume');
        bgmVolumeSlider.addEventListener('input', (e) => {
            bgmVolumeValue.textContent = e.target.value;
            this.settings.set('bgmVolume', parseInt(e.target.value) / 100);
            this.sounds.updateVolume();
        });

        const bgmMutedCheckbox = document.getElementById('setting-bgm-muted');
        bgmMutedCheckbox.addEventListener('change', (e) => {
            this.settings.set('bgmMuted', e.target.checked);
            this.sounds.updateVolume();
        });

        const bgmTypeSelect = document.getElementById('setting-bgm-type');
        bgmTypeSelect.addEventListener('change', (e) => {
            this.settings.set('bgmType', e.target.value);
            document.getElementById('game-bgm-playlist-container').style.display = e.target.value === 'custom' ? 'block' : 'none';
            this.sounds.stopBGM();
            this.sounds.updateVolume();
            this.sounds.startBGM();
        });

        const menuBgmTypeSelect = document.getElementById('setting-menu-bgm-type');
        menuBgmTypeSelect.addEventListener('change', (e) => {
            this.settings.set('menuBgmType', e.target.value);
            document.getElementById('menu-bgm-file-group').style.display = e.target.value === 'custom' ? 'flex' : 'none';
            this.sounds.stopBGM();
            this.sounds.updateVolume();
            this.sounds.startBGM();
        });

        // カスタムBGMファイル選択 (メニュー) - 簡易的に最初の1曲を使用
        const menuBgmFileBtn = document.getElementById('btn-select-menu-bgm');
        const menuBgmFileInput = document.getElementById('setting-menu-bgm-file');
        if (menuBgmFileBtn && menuBgmFileInput) {
            menuBgmFileBtn.addEventListener('click', () => menuBgmFileInput.click());
            menuBgmFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (event) => {
                    this.settings.set('customMenuPlaylist', [{ name: file.name, data: event.target.result }]);
                    document.getElementById('menu-bgm-filename').textContent = file.name;
                    await this.settings.saveSettings();
                    this.sounds.stopBGM();
                    this.sounds.updateVolume();
                    this.sounds.startBGM();
                };
                reader.readAsDataURL(file);
            });
        }

        // カスタムBGMファイル選択 (プレイ中) - プレイリストに追加
        const gameBgmAddBtn = document.getElementById('btn-add-game-bgm');
        const gameBgmFileInput = document.getElementById('setting-bgm-file-input');
        if (gameBgmAddBtn && gameBgmFileInput) {
            gameBgmAddBtn.addEventListener('click', () => {
                const playlist = this.settings.get('customGamePlaylist');
                if (playlist.length >= 5) {
                    this.showMessage('プレイリストは5曲までです', 'error');
                    return;
                }
                gameBgmFileInput.click();
            });

            gameBgmFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = async (event) => {
                    const playlist = this.settings.get('customGamePlaylist');
                    playlist.push({
                        name: file.name,
                        data: event.target.result
                    });

                    await this.settings.saveSettings();
                    this.renderPlaylist('game');
                    this.sounds.stopBGM();
                    this.sounds.updateVolume();
                    this.sounds.startBGM();

                    // Reset input
                    gameBgmFileInput.value = '';
                };
                reader.readAsDataURL(file);
            });
        }

        const practiceInfiniteLockCheckbox = document.getElementById('setting-practice-infinite-lock');
        practiceInfiniteLockCheckbox.addEventListener('change', (e) => {
            practiceLockDelaySlider.disabled = e.target.checked;
        });

        // タブ切り替え
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;
                if (target) {
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabPanes.forEach(p => p.classList.remove('active'));
                    btn.classList.add('active');
                    const targetEl = document.getElementById(target);
                    if (targetEl) targetEl.classList.add('active');
                }
            });
        });

        // サブタブ切り替え
        const subTabBtns = document.querySelectorAll('.sub-tab-btn');
        const subTabPanes = document.querySelectorAll('.sub-tab-pane');

        subTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.target;

                // 同じグループのボタンのactiveを切り替え
                const parent = btn.parentElement;
                if (parent) {
                    parent.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                }

                // ペインの切り替え
                subTabPanes.forEach(p => p.classList.remove('active'));
                const targetPane = document.getElementById(target);
                if (targetPane) targetPane.classList.add('active');
            });
        });

        // モーダルを閉じる
        const closeModal = () => {
            settingsModal.classList.remove('active');
            currentEditingAction = null;
            this.clearAllListeningStates();
            this.isPaused = false; // ゲームを再開
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

        // Player 2 キーバインド変更ボタン
        document.querySelectorAll('.btn-rebind-p2').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.startKeyListening(action, 2);
            });
        });

        // Player 2 ゲームパッドのリバインドボタン
        document.querySelectorAll('.btn-rebind-gp-p2').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.startGamepadListening(action, 2);
            });
        });

        // すべてリセット
        const resetBtn = document.getElementById('reset-defaults');
        if (resetBtn) {
            resetBtn.onclick = () => {
                if (confirm('すべて設定をデフォルトに戻しますか？（記録はリセットされません）')) {
                    this.settings.resetToDefaults();
                    this.keyBindings.resetToDefaults();
                    this.loadKeyBindingsToUI();
                    this.loadGameSettingsToUI();
                    this.sounds.playMenuClick();
                    messageDiv.textContent = 'すべての設定をデフォルトに戻しました';
                    messageDiv.className = 'keybind-message info';
                    setTimeout(() => { messageDiv.textContent = ''; }, 2000);
                }
            };
        }

        // 記録をリセット
        const resetRecordsBtn = document.getElementById('reset-records');
        if (resetRecordsBtn) {
            resetRecordsBtn.onclick = () => {
                if (confirm('記録をすべてリセットしますか？')) {
                    this.resetRecords();
                    this.sounds.playMenuClick();
                    messageDiv.textContent = '記録をリセットしました';
                    messageDiv.className = 'keybind-message info';
                    setTimeout(() => { messageDiv.textContent = ''; }, 2000);
                }
            };
        }

        // キー設定のみリセット
        const resetKeybindingsBtn = document.getElementById('reset-keybindings');
        if (resetKeybindingsBtn) {
            resetKeybindingsBtn.onclick = () => {
                if (confirm('全てのキー設定をデフォルトに戻しますか？')) {
                    this.keyBindings.resetToDefaults();
                    this.loadKeyBindingsToUI();
                    this.sounds.playMenuClick();
                    messageDiv.textContent = 'キー設定をリセットしました';
                    messageDiv.className = 'keybind-message info';
                    setTimeout(() => { messageDiv.textContent = ''; }, 2000);
                }
            };
        }

        // 操作感のみリセット
        const resetHandlingBtn = document.getElementById('reset-handling');
        if (resetHandlingBtn) {
            resetHandlingBtn.onclick = () => {
                if (confirm('DAS/ARR/ソフトドロップ速度をデフォルトに戻しますか？')) {
                    this.settings.set('dasDelay', this.settings.defaults.dasDelay);
                    this.settings.set('arrInterval', this.settings.defaults.arrInterval);
                    this.settings.set('softDropSpeed', this.settings.defaults.softDropSpeed);
                    this.loadGameSettingsToUI();
                    this.sounds.playMenuClick();
                    messageDiv.textContent = '操作感の設定をリセットしました';
                    messageDiv.className = 'keybind-message info';
                    setTimeout(() => { messageDiv.textContent = ''; }, 2000);
                }
            };
        }

        // 保存
        saveSettings.addEventListener('click', async () => {
            this.keyBindings.saveBindings();
            if (this.p2) {
                this.p2.keyBindings.saveBindings();
            } else {
                const p2 = new KeyBindings(2);
                // 現在のUIからの反映が必要
                const actions = ['moveLeft', 'moveRight', 'softDrop', 'hardDrop', 'rotateRight', 'rotateLeft', 'hold', 'hold2'];
                actions.forEach(action => {
                    // ここでは本来 startKeyListening で即時保存される設計だが、一応
                });
                // 実際には startKeyListening が内部で keyBindings.setBinding を呼んでおり、
                // loadKeyBindingsToUI で P2 用の KeyBindings(2) を使って表示している。
                // 課題: 設定画面で P2 を保存するには、P2 用の KeyBindings オブジェクトを管理し続ける必要がある。
            }

            // プレイヤー名を保存
            const nameInput = document.getElementById('setting-player-name');
            if (nameInput) {
                this.settings.set('playerName', nameInput.value || 'ななし');
            }

            // DAS/ARR設定を保存
            this.settings.set('dasDelay', parseInt(document.getElementById('setting-das').value));
            this.settings.set('arrInterval', parseInt(document.getElementById('setting-arr').value));
            this.settings.set('softDropSpeed', parseInt(document.getElementById('setting-softdrop').value));

            this.settings.set('practiceGravity', parseInt(document.getElementById('setting-practice-gravity').value));
            this.settings.set('practiceLockDelay', parseInt(document.getElementById('setting-practice-lock-delay').value));
            this.settings.set('practiceInfiniteLockDelay', document.getElementById('setting-practice-infinite-lock').checked);
            await this.settings.saveSettings();

            messageDiv.textContent = '設定を保存しました';
            messageDiv.className = 'keybind-message success';
            setTimeout(() => {
                messageDiv.textContent = '';
                closeModal();
            }, 1500);
        });
        const resetPracticeBtn = document.getElementById('reset-practice');
        if (resetPracticeBtn) {
            resetPracticeBtn.addEventListener('click', () => {
                if (confirm('プラクティス設定をリセットしますか？')) {
                    this.settings.set('practiceGravity', 1000);
                    this.settings.set('practiceLockDelay', 500);
                    this.loadGameSettingsToUI();
                }
            });
        }


        // 背景設定のリスナー
        document.querySelectorAll('.btn-bg-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.set('bgType', btn.dataset.bgType);
                this.settings.set('bgValue', btn.dataset.bgValue);
                this.applyBackground();
                document.querySelectorAll('.btn-bg-preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        document.querySelectorAll('.btn-apply-custom').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.bgType;
                if (!type) return;
                let value = type === 'color' ? document.getElementById('setting-bg-color').value : document.getElementById('setting-bg-image').value;
                if (type === 'image' && !value) return;
                this.settings.set('bgType', type);
                this.settings.set('bgValue', value);
                this.applyBackground();
                document.querySelectorAll('.btn-bg-preset').forEach(b => b.classList.remove('active'));
            });
        });

        const bgFileInput = document.getElementById('setting-bg-file');
        const addBgImageBtn = document.getElementById('btn-add-bg-image');
        if (addBgImageBtn && bgFileInput) {
            addBgImageBtn.addEventListener('click', () => {
                const playlist = this.settings.get('customBgPlaylist');
                if (playlist.length >= 5) {
                    this.showMessage('背景画像は5枚までです', 'error');
                    return;
                }
                bgFileInput.click();
            });

            bgFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const playlist = this.settings.get('customBgPlaylist');
                    playlist.push({
                        name: file.name,
                        data: event.target.result
                    });

                    this.settings.set('bgType', 'image');
                    await this.settings.saveSettings();
                    this.renderPlaylist('bg');
                    this.applyBackground(); // ランダムに1つ適用

                    // Reset input
                    bgFileInput.value = '';
                };
                reader.readAsDataURL(file);
            });
        }
    }

    loadGameSettingsToUI() {
        document.getElementById('setting-das').value = this.settings.get('dasDelay');
        document.getElementById('value-das').textContent = this.settings.get('dasDelay');
        document.getElementById('setting-arr').value = this.settings.get('arrInterval');
        document.getElementById('value-arr').textContent = this.settings.get('arrInterval');
        document.getElementById('setting-softdrop').value = this.settings.get('softDropSpeed');
        document.getElementById('value-softdrop').textContent = this.settings.get('softDropSpeed');
        document.getElementById('setting-practice-gravity').value = this.settings.get('practiceGravity');
        document.getElementById('value-practice-gravity').textContent = this.settings.get('practiceGravity');
        document.getElementById('setting-practice-lock-delay').value = this.settings.get('practiceLockDelay');
        document.getElementById('value-practice-lock-delay').textContent = this.settings.get('practiceLockDelay');
        document.getElementById('setting-practice-infinite-lock').checked = this.settings.get('practiceInfiniteLockDelay');
        document.getElementById('setting-practice-lock-delay').disabled = this.settings.get('practiceInfiniteLockDelay');

        const bgValue = this.settings.get('bgValue');
        const bgType = this.settings.get('bgType');
        if (bgType === 'color') {
            document.getElementById('setting-bg-color').value = bgValue;
        } else if (bgType === 'image') {
            document.getElementById('setting-bg-image').value = bgValue.startsWith('data:') ? '' : bgValue;
        }

        document.querySelectorAll('.btn-bg-preset').forEach(btn => {
            if (btn.dataset.bgType === bgType && btn.dataset.bgValue === bgValue) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        document.getElementById('setting-se-volume').value = Math.round(this.settings.get('seVolume') * 100);
        document.getElementById('value-se-volume').textContent = Math.round(this.settings.get('seVolume') * 100);
        document.getElementById('setting-se-muted').checked = this.settings.get('seMuted');
        document.getElementById('setting-bgm-volume').value = Math.round(this.settings.get('bgmVolume') * 100);
        document.getElementById('value-bgm-volume').textContent = Math.round(this.settings.get('bgmVolume') * 100);
        document.getElementById('setting-bgm-muted').checked = this.settings.get('bgmMuted');
        document.getElementById('setting-bgm-type').value = this.settings.get('bgmType') || 'synthwave';
        document.getElementById('setting-menu-bgm-type').value = this.settings.get('menuBgmType') || 'lofi';

        this.renderPlaylist('bgm', 'game');
        document.getElementById('game-bgm-playlist-container').style.display = this.settings.get('bgmType') === 'custom' ? 'block' : 'none';

        this.renderPlaylist('bg');

        // プレイヤー名を反映
        const nameInput = document.getElementById('setting-player-name');
        if (nameInput) {
            nameInput.value = this.settings.get('playerName') || 'ななし';
        }

        // Menu BGM filename (legacy but kept for simplicity)
        document.getElementById('menu-bgm-filename').textContent = this.settings.get('customMenuPlaylist')?.[0]?.name || '';
        document.getElementById('menu-bgm-file-group').style.display = this.settings.get('menuBgmType') === 'custom' ? 'flex' : 'none';
    }

    renderPlaylist(category, type = '') {
        const playlist = category === 'bg'
            ? this.settings.get('customBgPlaylist')
            : (type === 'game' ? this.settings.get('customGamePlaylist') : this.settings.get('customMenuPlaylist'));

        const containerId = category === 'bg' ? 'bg-playlist-items' : `${type}-bgm-playlist-items`;
        const itemsContainer = document.getElementById(containerId);
        if (!itemsContainer) return;

        itemsContainer.innerHTML = '';
        if (!playlist || playlist.length === 0) {
            const msg = category === 'bg' ? '画像が追加されていません' : '曲が追加されていません';
            itemsContainer.innerHTML = `<div style="font-size: 0.8rem; color: #666; text-align: center; padding: 10px;">${msg}</div>`;
            return;
        }

        playlist.forEach((itemData, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';

            const name = document.createElement('span');
            name.className = 'playlist-item-name';
            name.textContent = itemData.name;
            name.title = itemData.name;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-delete-track';
            deleteBtn.innerHTML = '×';
            deleteBtn.title = '削除';
            deleteBtn.onclick = async () => {
                if (confirm(`${itemData.name} をリストから削除しますか？`)) {
                    playlist.splice(index, 1);
                    await this.settings.saveSettings();
                    this.renderPlaylist(category, type);

                    if (category === 'bgm') {
                        if (this.sounds.isPlayingBGM) {
                            this.sounds.stopBGM();
                            this.sounds.startBGM();
                        }
                    } else {
                        // 背景削除時、現在の背景を再適用
                        this.applyBackground();
                    }
                }
            };

            item.appendChild(name);
            item.appendChild(deleteBtn);
            itemsContainer.appendChild(item);
        });
    }

    applyBackground() {
        const bgType = this.settings.get('bgType') || 'preset';
        let bgValue = this.settings.get('bgValue');
        const body = document.body;
        const html = document.documentElement;

        // Clean up injected style from head script
        const overrideStyle = document.getElementById('bg-override-style');
        if (overrideStyle) overrideStyle.remove();

        // 既存の背景クラスを削除
        body.className = body.className.replace(/\bbg-preset-\S+/g, '');
        html.className = html.className.replace(/\bbg-preset-\S+/g, '');

        body.style.background = '';

        if (bgType === 'preset') {
            html.classList.add(`bg-preset-${bgValue}`);
        } else if (bgType === 'color') {
            body.style.background = bgValue;
        } else if (bgType === 'image') {
            const playlist = this.settings.get('customBgPlaylist');
            if (playlist && playlist.length > 0) {
                // プレイリストからランダムに選択
                const randomIndex = Math.floor(Math.random() * playlist.length);
                bgValue = playlist[randomIndex].data;
            } else if (!bgValue || bgValue.startsWith('data:')) {
                // プレイリストが空で、bgValueが以前のデータURLだった場合はデフォルトに
                html.classList.add('bg-preset-default');
                return;
            }

            if (bgValue) {
                body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${bgValue}')`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundAttachment = 'fixed';
                // キャッシュして次回起動時に即座に適用できるようにする
                try {
                    localStorage.setItem('tetrisCachedBg', bgValue);
                } catch (e) { }
            }
        }
    }

    loadKeyBindingsToUI() {
        const actions = ['moveLeft', 'moveRight', 'softDrop', 'hardDrop', 'rotateRight', 'rotateLeft', 'hold', 'hold2', 'pause', 'reset', 'returnToTitle'];

        // Player 1
        actions.forEach(action => {
            const keyInput = document.getElementById(`key-${action}`);
            if (keyInput) keyInput.value = this.keyBindings.getKeyDisplay(this.keyBindings.getBinding(action));
            const gpInput = document.getElementById(`gp-${action}`);
            if (gpInput) gpInput.value = this.keyBindings.getGamepadButtonDisplay(this.keyBindings.getGamepadBinding(action));
        });

        // Player 2
        // P2インスタンスがある場合はそちらから、ない場合は一時的に作成して読み込む
        let p2Bindings = this.p2 ? this.p2.keyBindings : new KeyBindings(2);
        actions.forEach(action => {
            const keyInput = document.getElementById(`key-p2-${action}`);
            if (keyInput) keyInput.value = p2Bindings.getKeyDisplay(p2Bindings.getBinding(action));
            const gpInput = document.getElementById(`gp-p2-${action}`);
            if (gpInput) gpInput.value = p2Bindings.getGamepadButtonDisplay(p2Bindings.getGamepadBinding(action));
        });
    }

    startKeyListening(action, playerIdx = 1) {
        this.clearAllListeningStates();
        const prefix = playerIdx === 1 ? '' : 'p2-';
        const input = document.getElementById(`key-${prefix}${action}`);
        const btn = document.querySelector(`.btn-rebind${playerIdx === 1 ? '' : '-p2'}[data-action="${action}"]`);
        input.classList.add('listening');
        btn.classList.add('active');
        this.showMessage('新しいキーを押してください...', 'info');

        const keyHandler = (e) => {
            e.preventDefault();
            const targetBindings = playerIdx === 1 ? this.keyBindings : (this.p2 ? this.p2.keyBindings : new KeyBindings(2));
            const duplicate = targetBindings.isDuplicate(e.code, action);
            if (duplicate) {
                this.showMessage(`このキーは既に「${this.getActionLabel(duplicate)}」に割り当てられています`, 'error');
                return;
            }
            targetBindings.setBinding(action, e.code);
            targetBindings.saveBindings(); // 即時保存
            input.value = targetBindings.getKeyDisplay(e.code);
            input.classList.remove('listening');
            btn.classList.remove('active');
            this.showMessage('キーを設定しました', 'success');
            document.removeEventListener('keydown', keyHandler);
        };
        document.addEventListener('keydown', keyHandler);
    }

    clearAllListeningStates() {
        document.querySelectorAll('.key-input, .gp-input').forEach(el => el.classList.remove('listening'));
        document.querySelectorAll('.btn-rebind, .btn-rebind-gp').forEach(el => el.classList.remove('active'));
        this.isGamepadListening = false;
        if (this.gamepadListeningInterval) {
            clearInterval(this.gamepadListeningInterval);
            this.gamepadListeningInterval = null;
        }
    }

    startGamepadListening(action, playerIdx = 1) {
        this.clearAllListeningStates();
        const prefix = playerIdx === 1 ? '' : 'p2-';
        const input = document.getElementById(`gp-${prefix}${action}`);
        const btn = document.querySelector(`.btn-rebind-gp${playerIdx === 1 ? '' : '-p2'}[data-action="${action}"]`);
        input.classList.add('listening');
        btn.classList.add('active');
        this.showMessage('ゲームパッドのボタンを押してください...', 'info');
        this.isGamepadListening = true;

        this.gamepadListeningInterval = setInterval(() => {
            const gamepads = navigator.getGamepads();
            for (const gp of gamepads) {
                if (!gp) continue;
                for (let i = 0; i < gp.buttons.length; i++) {
                    if (gp.buttons[i].pressed) {
                        const targetBindings = playerIdx === 1 ? this.keyBindings : (this.p2 ? this.p2.keyBindings : new KeyBindings(2));
                        const duplicate = targetBindings.isGamepadDuplicate(i, action);
                        if (duplicate) {
                            this.showMessage(`既に使用されています: ${this.getActionLabel(duplicate)}`, 'error');
                            return;
                        }
                        targetBindings.setGamepadBinding(action, i);
                        targetBindings.saveBindings(); // 即時保存
                        input.value = targetBindings.getGamepadButtonDisplay(i);
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
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = `keybind-message ${type}`;
        }
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
            hold2: 'HOLD2',
            pause: 'ポーズ',
            reset: 'クイックリセット',
            returnToTitle: 'タイトルに戻る'
        };
        return labels[action] || action;
    }

    resetRecords() {
        this.bestScore = 0;
        this.bestTime = Infinity;
        this.bestT20 = Infinity;
        this.bestRen = 0;
        this.bestSurvival = 0;
        this.bestSurvivalSerial = 0;

        this.saveHighScores();
        this.updateBestDisplay();
        this.sounds.playMenuClick();

        // 通知を表示
        this.showMessage('記録をリセットしました', 'info');
    }

    // ========================================
    // Optimization Rate Calculation (BFS)
    // ========================================
    calculateFinesse(pieceType, targetRotation, targetX, targetY) {
        // BFS to find shortest path from spawn state
        // Actual spawn logic:
        const startX = Math.floor(BOARD_WIDTH / 2) - 2; // Fixed as per spawnPiece
        const startY = BOARD_HEIGHT - VISIBLE_HEIGHT;   // Fixed as per spawnPiece
        const startRot = 0;

        // Queue: [x, y, rot, moves]
        const queue = [[startX, startY, startRot, 0]];
        const visited = new Set();
        const stateKey = (x, y, r) => `${x},${y},${r}`;
        visited.add(stateKey(startX, startY, startRot));

        // Iteration limit
        let iterations = 0;
        const MAX_ITER = 6000;

        // Check if spawn *is* target (Rare)
        if (startX === targetX && startY === targetY && startRot === targetRotation) return 1; // Just Hard Drop

        while (queue.length > 0 && iterations < MAX_ITER) {
            iterations++;
            const [cx, cy, cr, moves] = queue.shift();

            // Check if we reached (targetX, targetY, targetRotation)
            if (cx === targetX && cy === targetY && cr === targetRotation) {
                return moves + 1; // +1 for Hard Drop
            }

            // Check if we are directly ABOVE target with same X and Rot, and no obstruction
            if (cx === targetX && cr === targetRotation && cy < targetY) {
                let cleanDrop = true;
                for (let y = cy + 1; y <= targetY; y++) {
                    if (this.checkCollision(cx, y, cr)) {
                        cleanDrop = false;
                        break;
                    }
                }
                if (cleanDrop) {
                    return moves + 1;
                }
            }

            // Possible Actions:

            // 1. Rotate CW
            let nextRot = (cr + 1) % 4;
            let kicked = this.tryRotateBFS(cx, cy, cr, nextRot, pieceType);
            if (kicked && !visited.has(stateKey(kicked.x, kicked.y, nextRot))) {
                visited.add(stateKey(kicked.x, kicked.y, nextRot));
                queue.push([kicked.x, kicked.y, nextRot, moves + 1]);
            }

            // 2. Rotate CCW
            nextRot = (cr + 3) % 4;
            kicked = this.tryRotateBFS(cx, cy, cr, nextRot, pieceType);
            if (kicked && !visited.has(stateKey(kicked.x, kicked.y, nextRot))) {
                visited.add(stateKey(kicked.x, kicked.y, nextRot));
                queue.push([kicked.x, kicked.y, nextRot, moves + 1]);
            }

            // 3. Move Left (Tap: 1 step, Cost 1)
            // Discrete Input: Single Tap
            if (!this.checkCollision(cx - 1, cy, cr)) {
                if (!visited.has(stateKey(cx - 1, cy, cr))) {
                    visited.add(stateKey(cx - 1, cy, cr));
                    queue.push([cx - 1, cy, cr, moves + 1]);
                }
            }

            // 4. Move Right (Tap: 1 step, Cost 1)
            // Discrete Input: Single Tap
            if (!this.checkCollision(cx + 1, cy, cr)) {
                if (!visited.has(stateKey(cx + 1, cy, cr))) {
                    visited.add(stateKey(cx + 1, cy, cr));
                    queue.push([cx + 1, cy, cr, moves + 1]);
                }
            }

            // 5. DAS Left (Move to Wall, Cost 1)
            // Input: Hold Left (1 input)
            let lx = cx - 1;
            while (!this.checkCollision(lx, cy, cr)) {
                lx--;
            }
            lx++; // Back up to last valid position
            if (lx !== cx) { // Only if we actually moved
                if (!visited.has(stateKey(lx, cy, cr))) {
                    visited.add(stateKey(lx, cy, cr));
                    queue.push([lx, cy, cr, moves + 1]);
                }
            }

            // 6. DAS Right (Move to Wall, Cost 1)
            // Input: Hold Right (1 input)
            let rx = cx + 1;
            while (!this.checkCollision(rx, cy, cr)) {
                rx++;
            }
            rx--; // Back up to last valid position
            if (rx !== cx) {
                if (!visited.has(stateKey(rx, cy, cr))) {
                    visited.add(stateKey(rx, cy, cr));
                    queue.push([rx, cy, cr, moves + 1]);
                }
            }

            // 7. Soft Drop
            if (!this.checkCollision(cx, cy + 1, cr)) {
                if (!visited.has(stateKey(cx, cy + 1, cr))) {
                    visited.add(stateKey(cx, cy + 1, cr));
                    queue.push([cx, cy + 1, cr, moves + 1]);
                }
            }
        }

        return 0;
    }

    tryRotateBFS(x, y, oldRot, newRot, type) {
        const key = `${oldRot}-${newRot}`;
        const kicks = (type === 'I') ? I_KICKS[key] : SRS_KICKS[key];

        if (!kicks) return null;

        for (const [dx, dy] of kicks) {
            // dy is inverted in checkCollision logic (y - dy)
            if (!this.checkCollision(x + dx, y - dy, newRot)) {
                return { x: x + dx, y: y - dy };
            }
        }
        return null;
    }

    // AI用: 最適操作手順を復元するBFS
    getOptimalPath(targetX, targetY, targetRotation) {
        const startX = Math.floor(BOARD_WIDTH / 2) - 2;
        const startY = BOARD_HEIGHT - VISIBLE_HEIGHT;
        const startRot = 0;

        // Queue: [x, y, rot, path]
        // Path is array of actions: { type: 'tap'|'das'|'rotate'|'drop', dir: 'left'|'right'|1|-1, toX?: number }
        const queue = [[startX, startY, startRot, []]];
        const visited = new Set();
        const stateKey = (x, y, r) => `${x},${y},${r}`;
        visited.add(stateKey(startX, startY, startRot));

        let iterations = 0;
        const MAX_ITER = 6000;

        // If spawn is target
        if (startX === targetX && startRot === targetRotation) {
            // Only need hard drop
            return [{ type: 'hardDrop' }]; // Will process drop last
        }

        while (queue.length > 0 && iterations < MAX_ITER) {
            iterations++;
            const [cx, cy, cr, path] = queue.shift();

            if (cx === targetX && cr === targetRotation) {
                // Verify hard drop landing from current Y
                let landY = cy;
                while (!this.checkCollision(cx, landY + 1, cr)) {
                    landY++;
                }

                if (landY === targetY) {
                    return [...path, { type: 'hardDrop' }];
                }
                // If obstructed (landY < targetY), continue BFS to find soft drop path
            }

            // 1. Rotate
            // Left
            let nextR = (cr + 3) % 4;
            let check = this.tryRotateBFS(cx, cy, cr, nextR, this.currentPiece);
            if (check) {
                if (!visited.has(stateKey(check.x, check.y, nextR))) {
                    visited.add(stateKey(check.x, check.y, nextR));
                    queue.push([check.x, check.y, nextR, [...path, { type: 'rotate', dir: 'left' }]]);
                }
            }
            // Right
            nextR = (cr + 1) % 4;
            check = this.tryRotateBFS(cx, cy, cr, nextR, this.currentPiece);
            if (check) {
                if (!visited.has(stateKey(check.x, check.y, nextR))) {
                    visited.add(stateKey(check.x, check.y, nextR));
                    queue.push([check.x, check.y, nextR, [...path, { type: 'rotate', dir: 'right' }]]);
                }
            }

            // 2. Move Left (Tap)
            if (!this.checkCollision(cx - 1, cy, cr)) {
                if (!visited.has(stateKey(cx - 1, cy, cr))) {
                    visited.add(stateKey(cx - 1, cy, cr));
                    queue.push([cx - 1, cy, cr, [...path, { type: 'tap', dir: 'left' }]]);
                }
            }

            // 3. Move Right (Tap)
            if (!this.checkCollision(cx + 1, cy, cr)) {
                if (!visited.has(stateKey(cx + 1, cy, cr))) {
                    visited.add(stateKey(cx + 1, cy, cr));
                    queue.push([cx + 1, cy, cr, [...path, { type: 'tap', dir: 'right' }]]);
                }
            }

            // 4. DAS Left
            let lx = cx - 1;
            while (!this.checkCollision(lx, cy, cr)) lx--;
            lx++;
            if (lx !== cx && lx !== cx - 1) { // DAS must move more than 1 (otherwise Tap is preferred/same cost)
                if (!visited.has(stateKey(lx, cy, cr))) {
                    visited.add(stateKey(lx, cy, cr));
                    queue.push([lx, cy, cr, [...path, { type: 'das', dir: 'left', toX: lx }]]);
                }
            }

            // 5. DAS Right
            let rx = cx + 1;
            while (!this.checkCollision(rx, cy, cr)) rx++;
            rx--;
            if (rx !== cx && rx !== cx + 1) {
                if (!visited.has(stateKey(rx, cy, cr))) {
                    visited.add(stateKey(rx, cy, cr));
                    queue.push([rx, cy, cr, [...path, { type: 'das', dir: 'right', toX: rx }]]);
                }
            }
        }
        return null; // Fail
    }

    // ========================================
    // 全国ランキング (Supabase)
    // ========================================
    // プレイヤー固有IDの取得 (ブラウザ単位で永続化)
    getPlayerId() {
        let id = localStorage.getItem('tetris_player_id');
        if (!id) {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                id = crypto.randomUUID();
            } else {
                // Fallback implementation
                id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
            localStorage.setItem('tetris_player_id', id);
        }
        return id;
    }

    async submitScoreToSupabase(mode, value) {
        if (!window.supabaseClient) return;

        const playerName = this.settings.get('playerName') || 'ななし';
        const playerId = this.getPlayerId();
        const roundedValue = Math.floor(value);

        // モードごとの勝敗判定基準 (低い方が良いか高い方が良いか)
        const isLowerBetter = (mode === '40lines' || mode === 't20');

        try {
            // 1. 既存の記録を確認 (player_id で検索)
            const { data: existing, error: fetchError } = await window.supabaseClient
                .from('ranking')
                .select('*')
                .eq('player_id', playerId)
                .eq('game_mode', mode)
                .maybeSingle();

            if (fetchError) throw fetchError;

            if (!existing) {
                // 新規登録
                const { error: insertError } = await window.supabaseClient
                    .from('ranking')
                    .insert([{
                        player_id: playerId,
                        player_name: playerName,
                        game_mode: mode,
                        time_ms: roundedValue,
                        created_at: new Date().toISOString()
                    }]);

                if (insertError) throw insertError;

                let modeLabel = mode;
                if (mode === '40lines') modeLabel = '40ライン';
                if (mode === 'marathon') modeLabel = 'マラソン';
                if (mode === 't20') modeLabel = 'T20';
                if (mode === 'ren4') modeLabel = '4列REN';
                if (mode === 'survival_normal') modeLabel = '通常サバイバル';
                if (mode === 'survival_serial') modeLabel = '課金穴サバイバル';

                this.showMessage(`${modeLabel}ランキングに初登録されました！`, 'success');
            } else {
                const isBetter = isLowerBetter ? (roundedValue < existing.time_ms) : (roundedValue > existing.time_ms);

                if (isBetter) {
                    // 更新 (名前も最新のものに更新)
                    const { error: updateError } = await window.supabaseClient
                        .from('ranking')
                        .update({
                            time_ms: roundedValue,
                            player_name: playerName,
                            created_at: new Date().toISOString()
                        })
                        .eq('player_id', playerId)
                        .eq('game_mode', mode);

                    if (updateError) throw updateError;
                    this.showMessage('自己ベスト更新！ランキングを更新しました！', 'success');
                } else {
                    console.log('Previous record was better. No update.');
                }
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    }

    async fetchRankingFromSupabase(mode = '40lines') {
        if (!window.supabaseClient) {
            if (this.rankingListContainer) {
                this.rankingListContainer.innerHTML = '<p style="text-align: center; color: #ff3d00;">Supabaseが初期化されていません</p>';
            }
            return;
        }

        if (this.rankingListContainer) {
            this.rankingListContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 40px;">読み込み中...</p>';
        }

        try {
            const isLowerBetter = (mode === '40lines' || mode === 't20');
            const { data, error } = await window.supabaseClient
                .from('ranking')
                .select('*')
                .eq('game_mode', mode)
                .order('time_ms', { ascending: isLowerBetter })
                .limit(100);

            if (error) throw error;
            this.renderRankingList(data, mode);
        } catch (error) {
            console.error('Error fetching ranking:', error);
            if (this.rankingListContainer) {
                this.rankingListContainer.innerHTML = '<p style="text-align: center; color: #ff3d00;">データの取得に失敗しました</p>';
            }
        }
    }

    renderRankingList(data, mode) {
        if (!this.rankingListContainer) return;

        if (!data || data.length === 0) {
            this.rankingListContainer.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px;">[${mode}] データがありません</p>`;
            return;
        }

        // ラベルの決定
        let valueLabel = 'タイム';
        let titleLabel = '40ラインランキング';
        if (mode === 'marathon') { valueLabel = 'スコア'; titleLabel = 'マラソンランキング'; }
        if (mode === 't20') { titleLabel = 'T20スプリントランキング'; }
        if (mode === 'ren4') { valueLabel = '最大REN'; titleLabel = '4列RENランキング'; }
        if (mode === 'survival_normal') { valueLabel = '生存時間'; titleLabel = '通常サバイバルランキング'; }
        if (mode === 'survival_serial') { valueLabel = '生存時間'; titleLabel = '課金穴サバイバルランキング'; }

        // モーダルタイトルを更新
        const modalTitle = document.querySelector('#ranking-modal .modal-title');
        if (modalTitle) modalTitle.textContent = `🏆 全国${titleLabel}`;

        let html = '<table class="ranking-table">';
        html += `<thead><tr><th>順位</th><th>プレイヤー名</th><th>${valueLabel}</th><th>日付</th></tr></thead>`;
        html += '<tbody>';

        data.forEach((row, index) => {
            const rank = index + 1;
            let displayValue = '';

            if (mode === '40lines' || mode === 't20') {
                displayValue = this.formatTimeShort(row.time_ms);
            } else if (mode === 'marathon') {
                displayValue = row.time_ms.toLocaleString();
            } else if (mode === 'ren4') {
                displayValue = `${row.time_ms} REN`;
            } else if (mode === 'survival_normal' || mode === 'survival_serial') {
                displayValue = this.formatTime(row.time_ms);
            }

            const date = new Date(row.created_at).toLocaleDateString();

            let rankClass = '';
            if (rank === 1) rankClass = 'rank-gold';
            else if (rank === 2) rankClass = 'rank-silver';
            else if (rank === 3) rankClass = 'rank-bronze';

            html += `<tr class="${rankClass}">
                <td>${rank}</td>
                <td>${this.escapeHTML(row.player_name)}</td>
                <td style="font-family: monospace; font-weight: bold; color: var(--accent-primary);">${displayValue}</td>
                <td style="font-size: 0.8rem; color: var(--text-muted);">${date}</td>
            </tr>`;
        });

        html += '</tbody></table>';
        this.rankingListContainer.innerHTML = html;
    }

    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[m];
        });
    }
}

// バトルマネージャー
// ========================================
const globalSettings = new GameSettings();
const globalSoundManager = new SoundManager(globalSettings);

// 背景を早期に適用（ちらつき防止）
function applyBackgroundEarly() {
    // index.htmlのhead内スクリプトで適用済みのため、ここでは何もしない
}

// DOMが読み込まれたら再度チェック（index.htmlのインラインスクリプトを補完）
document.addEventListener('DOMContentLoaded', applyBackgroundEarly);

async function initApp() {
    // Cleanup previous instance
    if (window.game) {
        console.log('[DEBUG] Cleaning up old game instance...');
        window.game.destroy();
    }

    await globalSettings.loadAudioData();
    window.game = new TetrisGame(globalSettings, globalSoundManager);

    // 背景を最終適用（プレイリストからのランダム選出などを含む）
    window.game.applyBackground();

    // 初回ロードのちらつき防止用クラスを解除（以降はアニメーションを有効に）
    setTimeout(() => {
        document.body.classList.remove('bg-no-transition');
    }, 100);

    window.game.updateMenuItems();

    // 対戦モードのラジオボタンのchangeイベントリスナーを追加
    const versusTypeRadios = document.querySelectorAll('input[name="versus-type"]');
    const cpuSettingsContainer = document.getElementById('cpu-settings-container');

    versusTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (cpuSettingsContainer) {
                if (e.target.value === 'cpu') {
                    cpuSettingsContainer.style.display = 'flex';
                } else {
                    cpuSettingsContainer.style.display = 'none';
                }
                // メニューアイテムを更新
                if (window.game) {
                    window.game.updateMenuItems();
                }
            }
        });
    });

    window._tryStartBGM = function () {
        if (window.bgmStarted) return;
        if (globalSoundManager.audioCtx && globalSoundManager.audioCtx.state === 'suspended') {
            globalSoundManager.audioCtx.resume();
        }
        globalSoundManager.setBGMContext('menu');
        globalSoundManager.updateVolume();
        globalSoundManager.startBGM();
        window.bgmStarted = true;
        document.removeEventListener('click', window._tryStartBGM);
        document.removeEventListener('keydown', window._tryStartBGM);
    };

    document.addEventListener('click', window._tryStartBGM);
    document.addEventListener('keydown', window._tryStartBGM);

    window.game.draw();
}

window.addEventListener('load', initApp);
