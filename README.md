# Online Tetris (Versus & Sprint)

Socket.IO を使用したリアルタイム対戦機能付きのテトリスゲームです。
Render などの Node.js ホスティングサービスにデプロイして、インターネット経由で誰とでも遊ぶことができます。

## 特徴

-   **オンライン対戦**: ルーム作成とURL共有による簡単マッチング。
-   **VS 2P (ローカル)**: 1台のPCで2人対戦（ゲームパッド対応）。
-   **豊富なモード**:
    -   マラソン / 40ライン / T20スプリント
    -   無限4列REN / サバイバル
    -   VS CPU (レベル調整可能)
-   **カスタマイズ**: 背景変更、キーコンフィグ、ゲームパッド感度調整。

## 遊び方 (オンライン対戦)

1.  **サーバーの起動**:
    ```bash
    npm install
    npm start
    ```
2.  **ブラウザでアクセス**: `http://localhost:3000` (またはデプロイされたURL)。
3.  **ルーム作成**: 「対戦モード」→「Online」→「作成」を選択。
4.  **招待**: 「招待リンクをコピー」して対戦相手に送ります。
5.  **対戦開始**: 全員が「準備完了」になったらホストが「開始」を押します。

## デプロイ方法

[Render.com](https://render.com/) で GitHub リポジトリと連携するだけで公開可能です。
詳細は [deployment.md](./deployment.md) を参照してください。

## 技術スタック

-   **Frontend**: Vanilla HTML/JS, Canvas API, CSS
-   **Backend**: Node.js, Express, Socket.IO
-   **Database**: Supabase (ランキング用)
