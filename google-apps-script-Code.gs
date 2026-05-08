/**
 * Bozyaka Devamsızlık Sistemi - Google Sheets Kayıt API
 * Kurulum:
 * 1) Google Sheets oluştur.
 * 2) Uzantılar > Apps Script aç.
 * 3) Bu dosyadaki kodu Code.gs içine yapıştır.
 * 4) SHEET_NAME değerini istersen değiştir.
 * 5) Dağıt > Yeni dağıtım > Web uygulaması:
 *    - Şu kişi olarak çalıştır: Ben
 *    - Kimlerin erişimi var: Herkes
 * 6) Web uygulaması URL'sini sistemde Riskli Öğrenci İzlem > Google Sheets Bağlantısı alanına yapıştır.
 */

const SHEET_NAME = 'Riskli Öğrenci Çalışmaları';
const SECRET_KEY = ''; // İstersen örn: 'bozyaka2026' yaz. Web panelde aynı anahtarı girmek gerekir.

const HEADERS = [
  'KAYIT_ID',
  'KAYIT_TARIHI',
  'GUNCELLEME_TARIHI',
  'OGRETMEN',
  'SINIF',
  'SEVIYE',
  'NO',
  'AD_SOYAD',
  'CINSIYET',
  'OZURSUZ',
  'OZURLU',
  'TOPLAM',
  'GORUSME_TARIHI',
  'GORUSME_TURU',
  'DEVAMSIZLIK_NEDENI',
  'YAPILAN_CALISMALAR',
  'VELI_BILGILENDIRME',
  'SONUC',
  'SONRAKI_TAKIP_TARIHI',
  'CALISMA_DURUMU',
  'ACIKLAMA',
  'KAYNAK'
];

function doGet(e) {
  const params = e && e.parameter ? e.parameter : {};
  const action = params.action || 'list';
  const callback = params.callback || '';

  if (SECRET_KEY && params.key !== SECRET_KEY) {
    return outputJson_({ ok: false, error: 'Yetkisiz istek.' }, callback);
  }

  if (action === 'setup') {
    const sh = getSheet_();
    return outputJson_({ ok: true, sheet: sh.getName(), headers: HEADERS }, callback);
  }

  if (action === 'list') {
    const records = readRecords_();
    return outputJson_({ ok: true, count: records.length, records: records }, callback);
  }

  return outputJson_({ ok: false, error: 'Bilinmeyen action.' }, callback);
}

function doPost(e) {
  try {
    const raw = (e && e.parameter && e.parameter.payload) ? e.parameter.payload : (e && e.postData ? e.postData.contents : '{}');
    const payload = JSON.parse(raw || '{}');

    if (SECRET_KEY && payload.key !== SECRET_KEY) {
      return outputJson_({ ok: false, error: 'Yetkisiz istek.' });
    }

    const record = payload.record || payload;
    const saved = appendRecord_(record);
    return outputJson_({ ok: true, saved: saved });
  } catch (err) {
    return outputJson_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);

  const lastCol = Math.max(sh.getLastColumn(), HEADERS.length);
  const firstRow = sh.getRange(1, 1, 1, lastCol).getValues()[0];
  const needsHeader = HEADERS.some((h, i) => firstRow[i] !== h);

  if (needsHeader) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#0f172a').setFontColor('#ffffff');
    sh.autoResizeColumns(1, HEADERS.length);
  }
  return sh;
}

function appendRecord_(r) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sh = getSheet_();
    const now = new Date();
    const actions = Array.isArray(r.actions) ? r.actions.join(' | ') : String(r.actions || '');
    const row = [
      String(r.id || Utilities.getUuid()),
      r.createdAt || now.toISOString(),
      r.updatedAt || now.toISOString(),
      r.teacher || '',
      r.sinif || '',
      r.seviye || '',
      r.no || '',
      r.adSoyad || '',
      r.cinsiyet || '',
      numberOrBlank_(r.ozursuz),
      numberOrBlank_(r.ozurlu),
      numberOrBlank_(r.toplam),
      r.date || '',
      r.type || '',
      r.reason || '',
      actions,
      r.parent || '',
      r.result || '',
      r.nextDate || '',
      r.status || '',
      r.note || '',
      'WEB_PANEL'
    ];
    sh.appendRow(row);
    return { no: r.no || '', updatedAt: r.updatedAt || now.toISOString() };
  } finally {
    lock.releaseLock();
  }
}

function readRecords_() {
  const sh = getSheet_();
  const values = sh.getDataRange().getValues();
  if (values.length <= 1) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(row => row.some(v => v !== '')).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return {
      id: String(obj.KAYIT_ID || obj.NO || ''),
      createdAt: toIso_(obj.KAYIT_TARIHI),
      updatedAt: toIso_(obj.GUNCELLEME_TARIHI),
      teacher: String(obj.OGRETMEN || ''),
      sinif: String(obj.SINIF || ''),
      seviye: String(obj.SEVIYE || ''),
      no: String(obj.NO || ''),
      adSoyad: String(obj.AD_SOYAD || ''),
      cinsiyet: String(obj.CINSIYET || ''),
      ozursuz: Number(obj.OZURSUZ) || 0,
      ozurlu: Number(obj.OZURLU) || 0,
      toplam: Number(obj.TOPLAM) || 0,
      date: dateOnly_(obj.GORUSME_TARIHI),
      type: String(obj.GORUSME_TURU || ''),
      reason: String(obj.DEVAMSIZLIK_NEDENI || ''),
      actions: String(obj.YAPILAN_CALISMALAR || '').split('|').map(s => s.trim()).filter(Boolean),
      parent: String(obj.VELI_BILGILENDIRME || ''),
      result: String(obj.SONUC || ''),
      nextDate: dateOnly_(obj.SONRAKI_TAKIP_TARIHI),
      status: String(obj.CALISMA_DURUMU || ''),
      note: String(obj.ACIKLAMA || '')
    };
  });
}

function outputJson_(obj, callback) {
  const json = JSON.stringify(obj);
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function numberOrBlank_(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : '';
}

function toIso_(v) {
  if (!v) return '';
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function dateOnly_(v) {
  if (!v) return '';
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v).slice(0, 10);
}
