import { SYSTEM_RULES } from "./safety";
import type { ChunkRecord } from "./vectorStore";

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

function prettyDocument(doc: string): string {
  return doc
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bWho Cst\b/g, "WHO CST");
}

/**
 * Format retrieved chunks into the structured context block. Sources shown to
 * the user come from this metadata, never from LLM-invented citations.
 */
export function buildContext(chunks: ChunkRecord[]): string {
  if (!chunks.length) return "";

  return chunks
    .map((chunk, i) => {
      const m = chunk.metadata;
      const lines = [
        `[SOURCE ${i + 1}]`,
        `Document: ${prettyDocument(m.document)}`,
        `Session: ${m.session ?? "n/a"}`,
        `Section: ${m.section ?? "n/a"}`,
        `Page: ${m.page ?? "n/a"}`,
        `Content: ${chunk.text.trim()}`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");
}

/**
 * The user-turn content: RETRIEVED WHO CST CONTEXT + USER QUESTION, kept clearly
 * separated from the SYSTEM RULES (which live in the system/instruction slot).
 * Shared by every provider so grounding behaviour is identical across models.
 */
export function buildUserPrompt(question: string, context: string): string {
  const hasContext = context.trim().length > 0;

  const contextBlock = hasContext
    ? `NGỮ CẢNH TÀI LIỆU WHO CST ĐƯỢC TRÍCH XUẤT:\n\n${context}`
    : `NGỮ CẢNH TÀI LIỆU WHO CST:\n\n(Không có đoạn trích WHO CST nào có độ tương đồng cao cho câu hỏi này.)`;

  return `${contextBlock}

CÂU HỎI CỦA NGƯỜI DÙNG:
${question}

HƯỚNG DẪN TRẢ LỜI CỤ THỂ:
1. Sử dụng kiến thức từ tài liệu WHO CST ở trên để giải thích và hướng dẫn người dùng một cách gần gũi, thực tế và dễ áp dụng.
2. Trả lời hoàn toàn bằng tiếng Việt tự nhiên. Dịch toàn bộ thuật ngữ sang tiếng Việt thân thiện (ví dụ: 'Early pretend play' -> 'Trò chơi giả vờ đơn giản', 'Advanced pretend play' -> 'Trò chơi giả vờ nâng cao', 'engagement' -> 'sự tham gia và tương tác của trẻ', 'challenging behaviour' -> 'hành vi khó khăn').
3. KHÔNG lặp lại cụm từ 'Theo tài liệu WHO CST...' hay 'Tài liệu cho biết...'. Hãy xưng là Bino và đóng vai trò người bạn đồng hành cùng gia đình.
4. ĐỊNH DẠNG VĂN BẢN: TUYỆT ĐỐI KHÔNG dùng ký hiệu Markdown như **, ***, #, ##, ###, dấu gạch chéo ngược \\*, hay backticks. Sử dụng văn bản thuần sạch sẽ, ngắt dòng rõ ràng giữa các đoạn và các bước (1., 2., 3. hoặc - ).
5. CẤU TRÚC CHO GỢI Ý HOẠT ĐỘNG HOẶC HƯỚNG DẪN THỰC HÀNH:
   - Lời giới thiệu ngắn gọn, ấm áp
   - Tên hoạt động
   - Mục tiêu: (ngắn gọn)
   - Chuẩn bị: (vật dụng quen thuộc, dễ kiếm tại nhà)
   - Cách thực hiện: (các bước đánh số 1, 2, 3 cụ thể, chỉ rõ người lớn làm gì, nói câu ngắn gì, chờ trẻ phản hồi ra sao)
   - Thời gian: (khoảng 5-10 phút)
   - Điều chỉnh theo bé: (hướng dẫn đơn giản hóa nếu bé gặp khó khăn, và cách mở rộng nếu bé làm tốt)
   - Lưu ý: (tạo niềm vui, không ép buộc trẻ)
6. Nếu câu hỏi còn rộng (chưa rõ độ tuổi hay khả năng của bé): Hãy đưa ra ngay MỘT hoạt động hữu ích, an toàn và điển hình trước; sau đó có thể kết thúc bằng một câu ngắn thân thiện gợi ý phụ huynh chia sẻ thêm độ tuổi của bé để gợi ý sát hơn.
7. Tuyệt đối không chẩn đoán bệnh tật hay kết luận y khoa (như tự kỷ, ADHD). Khi được hỏi về chẩn đoán, luôn hướng dẫn phụ huynh tham khảo ý kiến bác sĩ chuyên khoa phát triển.`;
}

/**
 * Build the OpenAI-style message list, keeping the three parts clearly
 * separated: SYSTEM RULES (system message) / CONTEXT + USER QUESTION (user).
 */
export function buildMessages(
  question: string,
  context: string,
  history: ChatTurn[] = [],
): { role: "system" | "user" | "assistant"; content: string }[] {
  return [
    { role: "system", content: SYSTEM_RULES },
    ...history.slice(-6),
    { role: "user", content: buildUserPrompt(question, context) },
  ];
}
