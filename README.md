# הילה — ההילה של העסק שלך ✨

פלטפורמה לבעלי עסקים קטנים: עמוד נחיתה מעוצב (1–2 עמודים) + זימון תורים ופגישות אונליין — בעברית, RTL, מותאם לנייד.

## החבילות

| חבילה | מחיר | מה מקבלים |
|---|---|---|
| **חינם** | ₪0 | עמוד נחיתה, כתובת אישית, 3 ערכות עיצוב, רקעים ופונטים בסיסיים, סטטיסטיקות |
| **עיצוב** | ₪9.90/חודש | כל ערכות העיצוב, רקעים חיים והילות, כל הפונטים העבריים, כל סגנונות הכפתורים, אנימציות |
| **עסקים** | ₪49.99/חודש | הכל + עמוד זימון תורים: שירותים ומחירים, שעות פעילות, אימות לקוח ב־SMS (דמו), אישור אוטומטי/ידני, ביטול בקליק |

> תשלומים במצב **דמו** — שדרוג מחליף את החבילה מיד ללא חיוב. חיבור סליקה (Grow/PayPal/Stripe) נכנס ב־`src/lib/actions/plan.ts`.

## איך זה בנוי

- **Next.js 16** (App Router, Server Actions, Proxy) + **Tailwind v4**
- **PostgreSQL + Prisma** — `Business`, `Site` (תוכן+עיצוב כ־JSON), `Service`, `WorkingHour`, `Appointment`, `OtpCode`, `Visit`
- **אימות** לבעלי עסקים בלבד (JWT cookie, bcrypt). לקוחות קצה לא נרשמים — קובעים תור עם שם, טלפון וקוד OTP (דמו: הקוד מוצג על המסך; ספק SMS אמיתי נכנס ב־`src/app/api/otp/route.ts`)
- **מערכת העיצוב** — `src/lib/design.ts`: ערכות, רקעים (כולל חיים ומונפשים), פונטים עבריים, כפתורים ואפקטים. אכיפת חבילה גם בשמירה וגם בזמן רנדור (`resolveDesign`)
- **חישוב משבצות** — `src/lib/slots.ts`: שעות פעילות − תורים תפוסים − buffer, לפי שעון ישראל (Asia/Jerusalem)

## מבנה עמודים

- `/` שיווק · `/signup` `/login` — בעלי עסקים
- `/dashboard` — סקירה, `editor` (עורך + תצוגה חיה), `appointments`, `services`, `hours`, `plan`, `settings`
- `/{slug}` — העמוד הציבורי של העסק · `/{slug}/book` — אשף קביעת תור · `/cancel/{token}` — ביטול ללקוח

## הרצה מקומית

```bash
npm install
# Postgres מקומי (או Docker: docker run -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres)
cp .env.example .env            # ולעדכן DATABASE_URL/DIRECT_URL/AUTH_SECRET
npx prisma db push
node scripts/seed-demo.mjs      # עסק דמו: /dana · demo@hila.co.il / demo1234
npm run dev
```

## פריסה (Vercel)

1. חיבור הריפו לפרויקט Vercel; Postgres דרך Vercel Postgres/Neon (`DATABASE_URL`).
2. משתני סביבה: `AUTH_SECRET` (מחרוזת אקראית ארוכה).
3. ה־build מריץ `prisma db push` + seeding של עסק הדמו אוטומטית.
