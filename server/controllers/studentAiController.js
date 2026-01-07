import OpenAI from "openai";

export const studentAssist = async (req, res) => {
  try {
    const { text } = req.body;

    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "AI is not configured" });
    }
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Missing 'text' string" });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });


    const systemPrompt = `
את/ה עוזר/ת לתלמיד/ה לנסח דיווח אנונימי למערכת בית-ספרית, ברגישות ובכבוד.

מטרות:
1) לכתוב "student_message" אמפתי וקצר בעברית שמדבר ישירות לתלמיד/ה (עד 3 או 4 משפטים).
   - להתחיל בהכרה/אמפתיה (למשל: "זה נשמע לא נעים" / "תודה ששיתפת").
   - להסביר בעדינות מה חסר/לא ברור או מה כדאי לחדד (בלי להאשים ורק אם יש חוסר או אי בהירות).
   - להציע צעד קטן: מה להוסיף כדי שהמורה תוכל לעזור (מתי/איפה/מה קרה).
   - לא לבקש פרטים מזהים (שם, כיתה, טלפון, כתובת, רשתות).

2) להציע ניסוח חלופי "rewrite" שהוא:
   - ברור, מכבד, לא תוקפני, ללא פרטים מזהים.
   - לא להוסיף עובדות שלא נכתבו.
   - לשמור על המשמעות של התלמיד/ה.

3) להעריך סיכון:
   - "high" רק אם יש סכנה מיידית: כוונה לפגיעה עצמית/אובדנות, נשק, אלימות חמורה/איום מיידי, תקיפה מינית שקורית עכשיו, או סכנה "כרגע".
   - "low" אם יש מצוקה/בריונות/אלימות אך לא ברור שזה מיידי.
   - "none" אחרת.
   - "reason" להסביר בקצרה למה.

חוקים:
- טון חם, תומך, לא שיפוטי.
- לא לבקש פרטים מזהים.
- פלט חייב להיות JSON תקין בלבד, בלי טקסט מסביב.

מבנה הפלט (JSON בלבד):
{
  "rewrite": "",
  "risk": { "level": "none", "reason": "" },
  "student_message": "",
  "suggested_actions": []
}

אם risk.level הוא "high" אז suggested_actions חייב לכלול:
[
  { "type": "emergency", "label": "משטרה 100", "value": "100" },
  { "type": "hotline", "label": "ער״ן 1201", "value": "1201" }
]
`;


    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: text },
      ],
    });

    const content = response.choices?.[0]?.message?.content ?? "";

    let data;
    try {
      data = JSON.parse(content);
    } catch {
      data = {
        rewrite: text,
        risk: { level: "none", reason: "parse_failed" },
        student_message: "אפשר לערוך את הדיווח כדי שיהיה ברור יותר, ואז לשלוח.",
        suggested_actions: [],
      };
    }

    // validation
    if (!data?.risk?.level) data.risk = { level: "none", reason: "missing_risk" };
    if (typeof data.rewrite !== "string") data.rewrite = text;
    if (!Array.isArray(data.suggested_actions)) data.suggested_actions = [];

    return res.json(data);
    
  } catch (err) {
    console.error("studentAssist failed:", err);
    return res.status(500).json({ error: "AI request failed" });
  }
};
