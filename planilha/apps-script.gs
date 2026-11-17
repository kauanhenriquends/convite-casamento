// Cole este código em Extensões > Apps Script, dentro da planilha de confirmados.
// Depois implante como "App da Web" (passo a passo no LEIA-ME.md).

var ABA = 'Confirmados';
var CABECALHO = ['Data', 'Nome', 'Presença', 'Pessoas', 'Recado'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // evita linhas trocadas se duas pessoas confirmarem juntas
  try {
    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var aba = planilha.getSheetByName(ABA) || planilha.insertSheet(ABA);
    if (aba.getLastRow() === 0) {
      aba.appendRow(CABECALHO);
      aba.setFrozenRows(1);
      aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    }

    var p = (e && e.parameter) || {};
    var vai = p.presenca === 'sim';
    var pessoas = vai ? Math.min(20, Math.max(1, parseInt(p.pessoas, 10) || 1)) : 0;

    aba.appendRow([
      new Date(),
      limpar(p.nome, 80),
      vai ? 'Confirmado' : 'Não vai',
      pessoas,
      limpar(p.recado, 300)
    ]);

    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false });
  } finally {
    lock.releaseLock();
  }
}

// Impede que um texto vire fórmula na planilha (ex.: começar com "=").
function limpar(valor, max) {
  var t = String(valor || '').replace(/\s+/g, ' ').trim().slice(0, max);
  return /^[=+\-@]/.test(t) ? "'" + t : t;
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
