/*
 * Bulk Import — pure render helpers. No DOM access; each function returns an
 * HTML string so the page controller can swap results into place.
 */
(function (global) {
  'use strict';

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function stat(label, value, tone) {
    return (
      '<div class="stat ' + tone + '">' +
      '<div class="stat-label">' + escapeHtml(label) + '</div>' +
      '<div class="stat-value">' + value + '</div>' +
      '</div>'
    );
  }

  function pill(tone, text) {
    return '<span class="pill ' + tone + '">' + escapeHtml(text) + '</span>';
  }

  /*
   * result: { total, created, skipped, failed: [{ row, sku, message }] }.
   * Rows that could not be created live in `failed`; duplicates among them
   * are already counted in `skipped`, so "Errors" = failed.length - skipped.
   */
  function summary(result) {
    var errors = Math.max(0, result.failed.length - result.skipped);
    return (
      stat('Created', result.created, 'ok') +
      stat('Skipped', result.skipped, 'warn') +
      stat('Errors', errors, 'bad') +
      stat('Total rows', result.total, '')
    );
  }

  function isSkipped(message) {
    return /(skip|already exists)/i.test(String(message));
  }

  function results(failed) {
    if (!failed || failed.length === 0) {
      return '<p class="empty">All rows imported successfully.</p>';
    }
    var rows = failed
      .map(function (item) {
        var tone = isSkipped(item.message) ? 'warn' : 'bad';
        var status = isSkipped(item.message) ? 'Skipped' : 'Error';
        return (
          '<tr>' +
          '<td class="row-num">' + item.row + '</td>' +
          '<td class="sku">' + escapeHtml(item.sku || '\u2014') + '</td>' +
          '<td>' + pill(tone, status) + '</td>' +
          '<td>' + escapeHtml(item.message) + '</td>' +
          '</tr>'
        );
      })
      .join('');
    return (
      '<table><thead><tr>' +
      '<th>Row</th><th>SKU</th><th>Status</th><th>Message</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table>'
    );
  }

  global.BulkImportRender = {
    summary: summary,
    results: results,
    escapeHtml: escapeHtml,
  };
})(window);
