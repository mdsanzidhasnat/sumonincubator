/*
 * Bulk Import — page controller. Wires the dropzone and file input, enforces
 * client-side limits, posts the file as multipart to the import endpoint and
 * renders the summary + per-row results via BulkImportRender.
 */
(function () {
  'use strict';

  var $ = function (id) {
    return document.getElementById(id);
  };
  var banner = $('banner');
  var dropzone = $('dropzone');
  var fileInput = $('fileInput');
  var fileStatus = $('fileStatus');
  var submitBtn = $('submitBtn');
  var summaryCard = $('summaryCard');
  var resultsCard = $('resultsCard');
  var summaryEl = $('summary');
  var resultsEl = $('results');

  var MAX_BYTES = 5 * 1024 * 1024;
  var ALLOWED_EXT = /\.(csv|xlsx)$/i;
  var selectedFile = null;

  function formatSize(bytes) {
    return bytes >= 1024 * 1024
      ? (bytes / (1024 * 1024)).toFixed(1) + ' MB'
      : Math.ceil(bytes / 1024) + ' KB';
  }

  function showBanner(type, html) {
    banner.className = 'banner ' + type;
    banner.innerHTML = html;
    banner.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function hideBanner() {
    banner.className = 'banner';
    banner.innerHTML = '';
  }

  function setFile(file) {
    selectedFile = file || null;
    fileStatus.textContent = file ? file.name + ' \u00b7 ' + formatSize(file.size) : '';
    submitBtn.disabled = !selectedFile;
  }

  function handleFile(file) {
    hideBanner();
    if (!file) {
      setFile(null);
      return;
    }
    if (!ALLOWED_EXT.test(file.name)) {
      showBanner('error', 'Unsupported file: ' + file.name + '. Use a .csv or .xlsx file.');
      setFile(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      showBanner('error', '"' + file.name + '" exceeds the 5 MB limit.');
      setFile(null);
      return;
    }
    if (file.size === 0) {
      showBanner('error', '"' + file.name + '" is empty.');
      setFile(null);
      return;
    }
    setFile(file);
  }

  fileInput.addEventListener('change', function () {
    var files = fileInput.files;
    if (files && files.length > 0) handleFile(files[0]);
    fileInput.value = '';
  });

  dropzone.addEventListener('click', function () {
    fileInput.click();
  });

  dropzone.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fileInput.click();
    }
  });

  ['dragenter', 'dragover'].forEach(function (eventName) {
    dropzone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropzone.classList.add('drag');
    });
  });

  ['dragleave', 'drop'].forEach(function (eventName) {
    dropzone.addEventListener(eventName, function (event) {
      event.preventDefault();
      dropzone.classList.remove('drag');
    });
  });

  dropzone.addEventListener('drop', function (event) {
    var files = event.dataTransfer && event.dataTransfer.files;
    if (files && files.length > 0) handleFile(files[0]);
  });

  async function submit() {
    if (!selectedFile) return;
    hideBanner();
    summaryCard.hidden = true;
    resultsCard.hidden = true;

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    var formData = new FormData();
    formData.append('file', selectedFile);

    try {
      var res = await fetch('/api/v1/products/import', { method: 'POST', body: formData });
      var data = await res.json().catch(function () {
        return null;
      });
      if (!res.ok) {
        var message =
          (data && data.error && data.error.message) || 'Import failed (' + res.status + ').';
        throw new Error(message);
      }
      renderResult(data);
    } catch (err) {
      showBanner('error', 'Import failed: ' + err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
    }
  }

  function renderResult(result) {
    summaryCard.hidden = false;
    resultsCard.hidden = false;
    summaryEl.innerHTML = BulkImportRender.summary(result);
    resultsEl.innerHTML = BulkImportRender.results(result.failed);
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  submitBtn.addEventListener('click', submit);
})();
