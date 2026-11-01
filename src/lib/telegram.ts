/**
 * PressZero Telegram Notification & Webhook Engine
 * Powers 24/7 autonomous alerts and two-way interaction directly with the creator's phone.
 */

export interface CommentAlertPayload {
  platform: string;
  user: string;
  comment: string;
  intent: string;
  reply: string;
  postUrl?: string | null;
}

export interface TelegramSendMessageOptions {
  parseMode?: "HTML" | "MarkdownV2";
  disableNotification?: boolean;
}

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸 Instagram Reel",
  facebook: "📘 Facebook Reel",
  youtube: "🔴 YouTube Short",
  x: "🐦 X (Twitter)",
  reddit: "👾 Reddit Thread",
  generic: "💬 Social Community",
};

/**
 * Escapes special HTML characters for Telegram HTML parse mode.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Sends a message via Telegram Bot API.
 */
export async function sendTelegramMessage(
  text: string,
  options?: TelegramSendMessageOptions
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[Telegram] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env variables.");
    return { success: false, error: "Credentials not configured" };
  }

  const endpoint = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: options?.parseMode || "HTML",
    disable_web_page_preview: false,
    disable_notification: options?.disableNotification ?? false,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.ok) {
      return { success: true };
    } else {
      console.error("[Telegram API Error]:", data.description);
      return { success: false, error: data.description };
    }
  } catch (err: any) {
    console.error("[Telegram Network Error]:", err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a structured, high-priority alert to the creator's Telegram
 * when a new comment or interaction is detected.
 */
export async function sendCommentAlert(
  data: CommentAlertPayload
): Promise<{ success: boolean; error?: string }> {
  const platformLabel = PLATFORM_ICONS[data.platform.toLowerCase()] || "💬 Social Community";
  const safeUser = escapeHtml(data.user);
  const safeComment = escapeHtml(data.comment);
  const safeIntent = escapeHtml(data.intent);
  const safeReply = escapeHtml(data.reply);

  const lines = [
    `🚨 <b>PressZero 24/7 Agent Alert</b>`,
    `Platform: <b>${platformLabel}</b>`,
    `From: <b>@${safeUser}</b>`,
    ``,
    `💬 <b>Incoming Comment:</b>`,
    `<i>"${safeComment}"</i>`,
    ``,
    `🎯 <b>Triage Intent:</b> <code>${safeIntent}</code>`,
    ``,
    `🤖 <b>Auto-Reply Sent:</b>`,
    `<blockquote>${safeReply}</blockquote>`,
  ];

  if (data.postUrl) {
    lines.push(``);
    lines.push(`🔗 <a href="${data.postUrl}">View Post & Thread</a>`);
  }

  lines.push(``);
  lines.push(`⚡ <i>Autonomous 24/7 Cloud Manager • PressZero</i>`);

  return sendTelegramMessage(lines.join("\n"));
}
