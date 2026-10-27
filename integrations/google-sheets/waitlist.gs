// Google Apps Script for the cuckyouleet waitlist sheet.
// Setup steps are in integrations/google-sheets/README.md.

const SHEET_NAME = "Waitlist";
const HEADER = ["Signed up (UTC)", "Email", "Note", "Source"];
const EMAIL = /^[a-z0-9._%][a-z0-9._%+-]*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

function doPost(e) {
  const secret = PropertiesService.getScriptProperties().getProperty("WAITLIST_SECRET");
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return json({ ok: false, error: "bad_json" });
  }
  if (!secret || body.secret !== secret) return json({ ok: false, error: "unauthorized" });

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL.test(email)) return json({ ok: false, error: "invalid_email" });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const book = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADER);
      sheet.setFrozenRows(1);
    }
    const last = sheet.getLastRow();
    if (last > 1) {
      const found = sheet
        .getRange(2, 2, last - 1, 1)
        .createTextFinder(email)
        .matchEntireCell(true)
        .findNext();
      if (found) return json({ ok: true, duplicate: true });
    }
    sheet.appendRow([new Date().toISOString(), plain(email, 254), plain(body.note, 1000), plain(body.source, 40)]);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Stops "=", "+", "-" and "@" at the start of a cell from running as a formula.
function plain(value, max) {
  const text = String(value || "").slice(0, max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
