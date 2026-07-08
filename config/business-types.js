// 業種ごとのヒアリング項目・見積もりロジック・画像生成可否を定義するコンフィグ。
// 新しい業種を追加する場合はこのオブジェクトにキーを増やすだけで良い設計にしている。
//
// 各業種の設定項目:
//   label                 : 表示名
//   supportsImageGeneration: ビフォーアフター画像生成を提供するか(true/false)
//     ※特殊清掃は現場写真が非常にセンシティブな内容になり得るため、
//       ビフォーアフター画像生成は提供しない(false)。見積もりのみ対応する。
//   hearingQuestions      : ヒアリング項目(チップ選択式)
//   sizeQuestionId        : 面積・規模の目安として使う質問のid(概算見積もりの坪数換算に使用)
//   multiplierQuestionId  : 費用の係数として使う質問のid
//   costModel             : { baseFee, perTsuboFee, multiplier } ※単価はすべて仮の試算値

const BUSINESS_TYPES = {
  housecleaning: {
    label: "ハウスクリーニング",
    supportsImageGeneration: true,
    hearingQuestions: [
      { id: "room_type", label: "掃除したい場所", chips: ["キッチン", "浴室", "トイレ", "リビング", "全体", "その他"] },
      { id: "room_size", label: "広さの目安", chips: ["1R/1K", "1LDK", "2LDK", "3LDK以上"] },
      { id: "concern", label: "気になる汚れ", chips: ["油汚れ", "カビ", "水垢", "ホコリ・チリ", "特になし"] },
      { id: "timing", label: "希望時期", chips: ["できるだけ早く", "今月中", "来月以降", "未定"] }
    ],
    sizeQuestionId: "room_size",
    multiplierQuestionId: "concern",
    costModel: {
      baseFee: 8000,
      perTsuboFee: 1500,
      multiplier: { "油汚れ": 1.15, "カビ": 1.2, "水垢": 1.1, "ホコリ・チリ": 1.0, "特になし": 1.0 }
    }
  },

  estateCleanup: {
    label: "遺品整理・生前整理",
    supportsImageGeneration: true,
    hearingQuestions: [
      { id: "room_type", label: "対象のお部屋・お住まい", chips: ["1R/1K", "1LDK", "2LDK", "3LDK以上", "戸建て"] },
      { id: "situation", label: "状況を教えてください", chips: ["遺品整理", "生前整理", "空き家の片付け", "その他"] },
      { id: "volume", label: "お荷物の量の目安", chips: ["少ない", "普通", "多い", "非常に多い"] },
      { id: "timing", label: "希望時期", chips: ["できるだけ早く", "今月中", "来月以降", "未定"] }
    ],
    sizeQuestionId: "room_type",
    multiplierQuestionId: "volume",
    costModel: {
      baseFee: 30000,
      perTsuboFee: 3000,
      multiplier: { "少ない": 0.7, "普通": 1.0, "多い": 1.3, "非常に多い": 1.6 }
    }
  },

  specialCleaning: {
    label: "特殊清掃",
    supportsImageGeneration: false, // 現場写真がセンシティブなため、ビフォーアフター画像生成は提供しない
    hearingQuestions: [
      { id: "room_type", label: "対象のお部屋・建物", chips: ["1R/1K", "1LDK", "2LDK以上", "戸建て", "その他"] },
      { id: "situation", label: "状況を教えてください(差し支えない範囲で)", chips: ["孤独死・事故死等", "臭気・害虫のご相談", "火災・水害後の清掃", "その他"] },
      { id: "urgency", label: "緊急度", chips: ["すぐに対応してほしい", "数日以内", "1週間以内", "未定"] },
      { id: "timing", label: "希望時期", chips: ["できるだけ早く", "今月中", "来月以降", "未定"] }
    ],
    sizeQuestionId: "room_type",
    multiplierQuestionId: "urgency",
    costModel: {
      baseFee: 80000,
      perTsuboFee: 6000,
      multiplier: { "すぐに対応してほしい": 1.4, "数日以内": 1.2, "1週間以内": 1.0, "未定": 1.0 }
    }
  }
};

// 面積・規模の目安チップ → 概算坪数マッピング(全業種共通で利用)
const ROOM_SIZE_TSUBO = {
  "1R/1K": 8,
  "1LDK": 15,
  "2LDK": 25,
  "2LDK以上": 30,
  "3LDK以上": 35,
  "戸建て": 45
};
