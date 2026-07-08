# reno-housecleaning HANDOVER.md

## プロジェクト概要
ハウスクリーニング業者向け ビフォーアフター見積もりツール(RENO派生)。
起案書: `docs/起案書.md` 参照。

## 開発体制(重要)
- Claude担当(全体の7割想定): AIチャットヒアリング、ビフォーアフター画像生成、概算見積もりロジック、PDF提案書生成、フロントエンドUI
- 開発部引き継ぎ(残り3割): ユーザー管理(業者アカウントの認証・権限)、契約・請求まわり、本番運用・サポート体制
- → 実装時は認証・契約まわりをなるべく疎結合に保ち、開発部が後から差し込みやすい設計にすること

## インフラ構成
- Supabase: 共有プロジェクト `sfhtvtcmgueystyuhzvd`(Taskra/Tavera/RENOと共有)を使用
- テーブルprefix: 他アプリと混在しないよう `housecleaning_` に統一
  - 例: `housecleaning_users`, `housecleaning_quotes`, `housecleaning_usage`
  - 新規テーブルは必ずCREATE TABLE文と同じマイグレーション内でRLSを有効化すること(RENO本体で過去にRLS漏れが発生した実績あり。同じミスをしない)
- ホスティング: GitHub Pages(このリポジトリ)
- AIプロキシ: RENO本体と同様、Supabase Edge Function経由でサーバーサイドから呼び出す想定(Edge Function名は仮に `housecleaning-agent`。secretキーはEdge Function側にのみ保持し、フロントには一切露出させない)

## 参考にしたRENO本体(dat0925/reno)の実装パターン
- 単一 `index.html` 構成、GitHub Pagesで公開
- チップ選択式のヒアリングUI(`.chip` / `.qf-chip`)
- jsPDF + html2canvasでビフォーアフター画像入りのPDF提案書を生成
- 認証はGoogle OAuth(管理者)+ PIN(ゲスト)の二本立て

## 業種コンフィグ設計方針
将来的に「片付け系・ビフォーアフターが成立する業種」(遺品整理・生前整理等)へ展開できるよう、ヒアリング項目・見積もりロジック・サンプル画像を業種ごとのコンフィグとして分離する。
第一弾はハウスクリーニング設定のみ実装。`config/business-types.js` 参照。

## 進捗ログ
- 2026-07-08: リポジトリ作成、起案書格納、HANDOVER.md作成、業種コンフィグ雛形(ハウスクリーニング分)作成

## 次にやること
1. `config/business-types.js` のハウスクリーニング設定をもとに、ヒアリングチャットUIを実装(index.html)
2. ビフォーアフター画像生成のAPI連携(Edge Function経由、secretキーはEdge Function側のみ)
3. 概算見積もりロジックの実装(costModelをベースに調整)
4. PDF提案書テンプレートの実装(RENOのgeneratePDFを参考に移植)
5. Supabaseに `housecleaning_` prefixのテーブルを設計・作成(RLS必須)
