// 業種ごとのヒアリング項目・見積もりロジック・サンプル画像を定義するコンフィグ
// 第一弾: ハウスクリーニング。将来的に他の「片付け系」業種を追加する際は
// このオブジェクトにキーを増やすだけで良い設計にしている。

const BUSINESS_TYPES = {
  housecleaning: {
    label: "ハウスクリーニング",
    hearingQuestions: [
      {
        id: "room_type",
        label: "掃除したい場所",
        chips: ["キッチン", "浴室", "トイレ", "リビング", "全体", "その他"]
      },
      {
        id: "room_size",
        label: "広さの目安",
        chips: ["1R/1K", "1LDK", "2LDK", "3LDK以上"]
      },
      {
        id: "concern",
        label: "気になる汚れ",
        chips: ["油汚れ", "カビ", "水垢", "ホコリ・チリ", "特になし"]
      },
      {
        id: "timing",
        label: "希望時期",
        chips: ["できるだけ早く", "今月中", "来月以降", "未定"]
      }
    ],
    // ※単価は仮の試算値。実際の事業者ヒアリング後に調整すること
    costModel: {
      baseFee: 8000,
      perTsuboFee: 1500,
      concernMultiplier: {
        "油汚れ": 1.15,
        "カビ": 1.2,
        "水垢": 1.1,
        "ホコリ・チリ": 1.0,
        "特になし": 1.0
      }
    },
    sampleImages: {
      before: "samples/before_kitchen_placeholder.jpg",
      after: "samples/after_kitchen_placeholder.jpg"
    }
  }

  // 将来追加予定(例):
  // estateCleanup: { label: "遺品整理・生前整理", ... }
};
