# Firebase クラウド同期セットアップガイド

## 必要なステップ

### 1. Firebaseプロジェクトを作成

1. https://console.firebase.google.com/ にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名: `hanamaru-excel`（任意）
4. Google Analyticsは不要（任意）

### 2. Webアプリを登録

1. 左メニューの「>」アイコン（Web）をクリック
2. アプリ名: `hanamaru-excel`
3. 「Firebase Hostingを設定する」はチェック不要
4. 「アプリを登録」をクリック
5. 表示された設定情報（apiKey, authDomain等）をメモ

### 3. 認証を有効化

1. 左メニュー → 「Authentication」→「开始使用」
2. 「匿名」タブを有効化
3. 保存

### 4. Firestoreを有効化

1. 左メニュー → 「Firestore Database」→「データベースを作成」
2. テストモードを選択
3. リージョンは最寄りを選択
4. 完了

### 5. index.htmlを編集

`index.html` 内の `firebaseConfig` を書き換え:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",        // ← APIキー
  authDomain: "hanamaru-excel.firebaseapp.com",  // ← ドメイン
  projectId: "hanamaru-excel", // ← プロジェクトID
  storageBucket: "hanamaru-excel.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### 6. Firestoreセキュリティルール

Firebase Console → Firestore → ルール:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. デプロイ

```bash
git add -A
git commit -m "☁️ Firebase config added"
git push
```

## 動作フロー

```
ユーザーが「接続する」をクリック
    │
    ▼
匿名認証でログイン
    │
    ▼
Firestore にユーザードキュメント作成
    │
    ▼
以后、saveState()ごとに自動同期（2秒デバウンス）
    │
    ▼
別デバイスで同じURLにアクセス → ログインで同期復元
```

## 注意事項

- 匿名認証はブラウザ単位。デバイスを変えると別ユーザーになる
- 同期は「大きい方のデータ」を採用（ローカル vs クラウド）
- Firebase無料枠: 1GBストレージ / 50K読み取り / 20K書き込み / 日
