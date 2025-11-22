export type StageType =
  | "INITIAL"
  | "STAGE_1_INITIAL_REPLY"
  | "STAGE_1_WAIT_FOR_REPLY"
  | "STAGE_2_CREATIVE_1"
  | "STAGE_2_CREATIVE_2"
  | "STAGE_3_LAUNCH"
  | "STAGE_3_LAUNCH_WAIT_USER"
  | "STAGE_3_WAIT_CLIENT_RESPONSE"
  | "STAGE_4_PANIC"
  | "STAGE_4_WAIT_RESOLUTION"
  | "STAGE_5_ORDERS_COMING"
  | "STAGE_5_REPORT"
  | "STAGE_6_REPORT_WAIT"
  | "STAGE_7_REPORT_DATA"
  | "STAGE_7_REPORT_DATA_2"
  | "STAGE_8_REPORT_SUBMIT"
  | "STAGE_8_REPORT_SENT"
  | "STAGE_9_EXPLAIN"
  | "STAGE_10_SETTINGS"
  | "FINAL";

export interface Message {
  id: number;
  type: "user" | "bot" | "system" | "system-alert" | "bot-image" | "user-image" | "bot-audio";
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  timestamp: Date;
}
