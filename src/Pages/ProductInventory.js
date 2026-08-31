import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
// ============================================================
// API
// ============================================================

const API_URL =
  "https://vanyabackenddatabase-vahr.onrender.com/products";

// ============================================================
// STYLES
// ============================================================

const adminStyles = `
  :root {
    --primary-green: #1a3c34;
    --primary-green-hover: #142e28;
    --accent-gold: #c5a059;
    --light-bg: #fdfbf7;
    --card-bg: #ffffff;
    --text-dark: #222222;
    --text-muted: #666666;
    --white: #ffffff;
    --danger: #ff5252;
    --border: #e5e5e5;
    --success: #2e7d32;
    --blue: #2563eb;
    --blue-hover: #1d4ed8;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background-color: var(--light-bg);
  }

  .admin-container {
    padding: 32px 4%;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: var(--text-dark);
    max-width: 1500px;
    margin: 0 auto;
    min-height: 100vh;
  }

  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 2px solid var(--accent-gold);
    padding-bottom: 16px;
    gap: 16px;
  }

  .admin-header h1 {
    font-size: 1.8rem;
    color: var(--primary-green);
    margin: 0 0 4px 0;
  }

  .admin-header p {
    margin: 0;
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .header-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .btn-add,
  .btn-bulk,
  .btn-export {
    color: white;
    border: none;
    padding: 12px 18px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.92rem;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
  }

  .btn-add {
    background: var(--primary-green);
  }

  .btn-add:hover {
    background: var(--primary-green-hover);
  }

  .btn-bulk {
    background: var(--blue);
  }

  .btn-bulk:hover {
    background: var(--blue-hover);
  }

  .btn-export {
    background: #64748b;
  }

  .btn-export:hover {
    background: #475569;
  }

  .btn-add:active,
  .btn-bulk:active,
  .btn-export:active {
    transform: scale(0.98);
  }

  .btn-small {
    border: none;
    border-radius: 7px;
    padding: 8px 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.82rem;
  }

  .btn-gold {
    background: var(--accent-gold);
    color: white;
  }

  .btn-green {
    background: var(--primary-green);
    color: white;
  }

  .btn-red {
    background: #fff0f0;
    color: var(--danger);
    border: 1px solid #ffcaca;
  }

  .btn-outline {
    background: white;
    color: var(--primary-green);
    border: 1px solid var(--primary-green);
  }

  .table-wrapper {
    background: var(--card-bg);
    border-radius: 12px;
    overflow-x: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid var(--border);
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 1300px;
  }

  th,
  td {
    padding: 16px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
    text-align: left;
  }

  th {
    background: #fafafa;
    border-bottom: 2px solid var(--border);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
  }

  .prod-img-mini {
    width: 45px;
    height: 55px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .thumbnail-container {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .status-badge {
    padding: 6px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    background: #e8f5e9;
    color: #2e7d32;
    display: inline-block;
  }

  .action-btns {
    display: flex;
    gap: 8px;
  }

  .btn-edit,
  .btn-delete {
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.85rem;
    transition: background 0.2s;
  }

  .btn-edit {
    background: none;
    border: 1px solid var(--accent-gold);
    color: var(--accent-gold);
  }

  .btn-delete {
    background: none;
    border: 1px solid var(--danger);
    color: var(--danger);
  }

  .variant-summary {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 320px;
  }

  .variant-colour-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    padding-bottom: 6px;
    border-bottom: 1px dashed #eee;
  }

  .colour-chip {
    background: #f5f1e8;
    color: #765c27;
    padding: 5px 9px;
    border-radius: 14px;
    font-size: 0.75rem;
    font-weight: 700;
  }

  .size-chip {
    background: #f2f4f7;
    color: #444;
    padding: 4px 8px;
    border-radius: 10px;
    font-size: 0.72rem;
  }

  .variant-images-mini {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    margin-top: 5px;
  }

  .variant-image-mini {
    width: 40px;
    height: 48px;
    object-fit: cover;
    border-radius: 5px;
    border: 1px solid #ddd;
  }

  /* ============================================================
     MODAL
  ============================================================ */

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(3px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 16px;
  }

  .modal-content {
    background: var(--card-bg);
    padding: 28px;
    border-radius: 16px;
    width: 950px;
    max-width: 100%;
    max-height: 94vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  }

  .bulk-modal {
    width: 1100px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 11px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    outline: none;
    font-size: 0.95rem;
    background: #fff;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  /* ============================================================
     VARIANT BUILDER
  ============================================================ */

  .variant-builder {
    background: #faf8f2;
    border: 1px solid #eadfc9;
    border-radius: 12px;
    padding: 18px;
    margin-top: 18px;
  }

  .variant-builder-title {
    color: var(--primary-green);
    font-size: 1.05rem;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .variant-builder-description {
    color: var(--text-muted);
    font-size: 0.8rem;
    margin-bottom: 18px;
  }

  .colour-card {
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 16px;
    overflow: hidden;
  }

  .colour-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 14px;
    background: #f7f7f7;
    border-bottom: 1px solid var(--border);
  }

  .colour-card-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }

  .colour-name-input {
    max-width: 220px;
  }

  .colour-card-body {
    padding: 14px;
  }

  .colour-image-section {
    margin-bottom: 18px;
    padding: 14px;
    background: #fcfcfc;
    border: 1px solid #e9e9e9;
    border-radius: 10px;
  }

  .colour-image-title {
    font-weight: 700;
    color: var(--primary-green);
    font-size: 0.9rem;
    margin-bottom: 12px;
  }

  .image-upload-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .image-upload-box {
    border: 1px dashed #cfcfcf;
    border-radius: 9px;
    padding: 12px;
    background: white;
  }

  .image-upload-box label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    color: #555;
    margin-bottom: 7px;
  }

  .image-upload-box input {
    width: 100%;
    font-size: 0.8rem;
  }

  .image-preview-row {
    display: flex;
    gap: 7px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .image-preview-wrapper {
    position: relative;
  }

  .image-preview {
    width: 65px;
    height: 78px;
    object-fit: cover;
    border-radius: 7px;
    border: 1px solid #ddd;
  }

  .remove-image-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: none;
    background: #ff5252;
    color: white;
    font-size: 12px;
    cursor: pointer;
    line-height: 20px;
    padding: 0;
  }

  .size-table-wrapper {
    overflow-x: auto;
  }

  .size-table {
    width: 100%;
    min-width: 680px;
    border-collapse: collapse;
  }

  .size-table th,
  .size-table td {
    padding: 8px;
    border: 1px solid var(--border);
    font-size: 0.78rem;
  }

  .size-table input {
    width: 100%;
    min-width: 90px;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
  }

  .size-name-box {
    width: 90px;
    font-weight: 700;
    background: #f7f7f7;
  }

  .add-size-row {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .saree-variant-row {
    display: grid;
    grid-template-columns: 1.1fr 1fr 1fr 1fr 1fr auto;
    gap: 8px;
    align-items: end;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 9px;
    margin-bottom: 8px;
    background: #fff;
  }

  .variant-field label {
    display: block;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .variant-field input {
    width: 100%;
    padding: 9px;
    border: 1px solid var(--border);
    border-radius: 7px;
  }

  .add-colour-button {
    width: 100%;
    margin-top: 4px;
    border: 2px dashed #cdbd9a;
    background: transparent;
    color: #765c27;
    padding: 12px;
    border-radius: 9px;
    cursor: pointer;
    font-weight: 700;
  }

  .info-box {
    background: #eef7f4;
    border: 1px solid #cde3dc;
    color: #27594d;
    padding: 10px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    margin-bottom: 15px;
  }

  /* ============================================================
     BULK IMPORT
  ============================================================ */

/* =========================================================
   BULK MODAL
========================================================= */

.bulk-modal {
  width: min(900px, 94vw);
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}


/* =========================================================
   HEADER
========================================================= */

.bulk-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 28px 18px;
  border-bottom: 1px solid #eef1f4;
}

.bulk-modal-title {
  margin: 0;
  font-size: 22px;
  font-weight: 750;
  color: var(--primary-green);
}

.bulk-modal-subtitle {
  margin: 6px 0 0;
  font-size: 13px;
  color: #64748b;
}

.bulk-close-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 9px;
  background: #f5f6f7;
  color: #475569;
  font-size: 25px;
  line-height: 1;
  cursor: pointer;
}

.bulk-close-btn:hover {
  background: #eceff1;
}


/* =========================================================
   UPLOAD AREA
========================================================= */

.bulk-upload-wrapper {
  padding: 24px 28px 10px;
}

.bulk-upload-area {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 210px;

  box-sizing: border-box;

  border: 1.5px dashed #cbd5e1;
  border-radius: 14px;

  background: #fafbfc;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.bulk-upload-area:hover {
  border-color: var(--primary-green);
  background: #f8faf9;
}

.bulk-upload-area.bulk-upload-selected {
  border-color: var(--primary-green);
  background: #f7fbf8;
}

.bulk-upload-area input {
  display: none;
}


/* =========================================================
   UPLOAD ICON
========================================================= */

.bulk-upload-icon {
  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 12px;

  border-radius: 14px;

  background: #ffffff;

  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.07);

  font-size: 28px;
}


/* =========================================================
   UPLOAD TEXT
========================================================= */

.bulk-upload-main-text {
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.bulk-upload-sub-text {
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
}

.bulk-upload-format {
  margin-top: 12px;

  padding: 5px 10px;

  border-radius: 20px;

  background: #eef2f4;

  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}


/* =========================================================
   SELECTED FILE
========================================================= */

.bulk-selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  margin: 12px 28px 0;
  padding: 12px 14px;

  border: 1px solid #e2e8f0;
  border-radius: 10px;

  background: #ffffff;
}

.bulk-selected-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.bulk-selected-icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 9px;
  background: #f1f5f9;

  font-size: 20px;
}

.bulk-selected-name {
  max-width: 500px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 13px;
  font-weight: 650;
  color: #1e293b;
}

.bulk-selected-status {
  margin-top: 3px;
  font-size: 11px;
  color: #16a34a;
}

.bulk-remove-file {
  border: none;
  background: transparent;

  color: #dc2626;

  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
}

.bulk-remove-file:hover {
  text-decoration: underline;
}


/* =========================================================
   PREVIEW
========================================================= */

.bulk-preview-section {
  margin: 20px 28px 0;
}

.bulk-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 10px;
}

.bulk-preview-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.bulk-preview-count {
  margin-top: 3px;
  font-size: 12px;
  color: #64748b;
}

.bulk-preview-badge {
  padding: 6px 10px;

  border-radius: 20px;

  background: #f1f5f9;

  font-size: 11px;
  font-weight: 700;
  color: #475569;
}


/* =========================================================
   TABLE
========================================================= */

.bulk-preview {
  width: 100%;
  overflow-x: auto;

  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.bulk-preview table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.bulk-preview th {
  padding: 10px 12px;

  text-align: left;
  white-space: nowrap;

  background: #f8fafc;

  border-bottom: 1px solid #e2e8f0;

  font-weight: 700;
  color: #334155;
}

.bulk-preview td {
  padding: 9px 12px;

  max-width: 180px;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  border-bottom: 1px solid #f1f5f9;

  color: #475569;
}

.bulk-preview tbody tr:last-child td {
  border-bottom: none;
}

.bulk-preview tbody tr:hover {
  background: #fafafa;
}

.bulk-preview-note {
  margin-top: 7px;

  font-size: 11px;
  color: #64748b;
}


/* =========================================================
   PROGRESS
========================================================= */

.bulk-progress-section {
  margin: 20px 28px 0;
}

.bulk-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 8px;

  font-size: 12px;
  color: #475569;
}

.bulk-progress-header strong {
  color: var(--primary-green);
}

.bulk-progress {
  width: 100%;
  height: 8px;

  overflow: hidden;

  border-radius: 10px;

  background: #e2e8f0;
}

.bulk-progress-bar {
  height: 100%;

  border-radius: 10px;

  background: var(--primary-green);

  transition: width 0.3s ease;
}


/* =========================================================
   RESULT
========================================================= */

.bulk-result {
  display: flex;
  align-items: center;
  gap: 10px;

  margin: 18px 28px 0;
  padding: 12px 14px;

  border-radius: 9px;

  background: #f0fdf4;

  border: 1px solid #bbf7d0;

  color: #15803d;

  font-size: 13px;
  font-weight: 600;
}

.bulk-result-icon {
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #dcfce7;

  font-weight: 800;
}


/* =========================================================
   ERROR
========================================================= */

.bulk-error {
  margin: 18px 28px 0;
  padding: 13px 15px;

  border-radius: 9px;

  background: #fff7f7;

  border: 1px solid #fecaca;

  color: #b91c1c;

  font-size: 12px;
}

.bulk-error-title {
  font-weight: 700;
  margin-bottom: 7px;
}

.bulk-error ul {
  margin: 0;
  padding-left: 20px;
}

.bulk-error li {
  margin-bottom: 4px;
}


/* =========================================================
   FOOTER
========================================================= */

.bulk-modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 24px;
  padding: 18px 28px;

  border-top: 1px solid #eef1f4;

  background: #ffffff;
}

.bulk-cancel-btn {
  padding: 10px 18px;

  border: none;
  border-radius: 8px;

  background: #f1f5f9;

  color: #475569;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.bulk-cancel-btn:hover {
  background: #e2e8f0;
}

.bulk-import-btn {
  padding: 10px 20px;

  border: none;
  border-radius: 8px;

  background: var(--primary-green);

  color: #ffffff;

  font-size: 13px;
  font-weight: 700;

  cursor: pointer;

  transition: opacity 0.2s ease;
}

.bulk-import-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.bulk-import-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .bulk-modal {
    width: 95vw;
    max-height: 92vh;
    border-radius: 14px;
  }

  .bulk-modal-header {
    padding: 18px;
  }

  .bulk-modal-title {
    font-size: 18px;
  }

  .bulk-upload-wrapper {
    padding: 18px 18px 8px;
  }

  .bulk-upload-area {
    min-height: 180px;
  }

  .bulk-selected-file {
    margin-left: 18px;
    margin-right: 18px;
  }

  .bulk-preview-section {
    margin-left: 18px;
    margin-right: 18px;
  }

  .bulk-progress-section {
    margin-left: 18px;
    margin-right: 18px;
  }

  .bulk-result,
  .bulk-error {
    margin-left: 18px;
    margin-right: 18px;
  }

  .bulk-modal-footer {
    padding: 15px 18px;
  }

  .bulk-selected-name {
    max-width: 180px;
  }

  .bulk-import-btn {
    padding: 10px 14px;
  }

}
  /* ============================================================
     MOBILE
  ============================================================ */

  .mobile-card-container {
    display: none;
  }

  @media (max-width: 768px) {

    .admin-container {
      padding: 16px 12px;
    }

    .admin-header {
      flex-direction: column;
      align-items: stretch;
    }

    .header-buttons {
      display: grid;
      grid-template-columns: 1fr;
    }

    .btn-add,
    .btn-bulk,
    .btn-export {
      width: 100%;
    }

    .table-wrapper {
      display: none;
    }

    .mobile-card-container {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .product-card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.03);
      border: 1px solid var(--border);
    }

    .card-top {
      display: flex;
      gap: 14px;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }

    .card-main-img {
      width: 75px;
      height: 95px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
      border: 1px solid var(--border);
    }

    .card-info {
      flex-grow: 1;
      min-width: 0;
    }

    .card-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
      font-size: 0.85rem;
    }

    .card-field label {
      display: block;
      color: var(--text-muted);
      font-size: 0.7rem;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    .card-field span {
      font-weight: 600;
    }

    .card-actions {
      display: flex;
      gap: 10px;
      border-top: 1px solid var(--border);
      padding-top: 12px;
    }

    .card-actions button {
      flex: 1;
      padding: 10px;
    }

    .modal-overlay {
      padding: 0;
      align-items: flex-end;
    }

    .modal-content {
      width: 100%;
      max-height: 94vh;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      padding: 24px 20px;
    }

    .saree-variant-row {
      grid-template-columns: 1fr 1fr;
    }

    .image-upload-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// ============================================================
// SUB CATEGORIES
// ============================================================

const subCategoriesMap = {
  "SILK SAREES": [
    "Chiffons",
    "Jeorget",
    "Marshmellow",
    "Kashmiri Silk"
  ],

  "COTTON Sarees": [
    "Malaii Cotton",
    "2 cut cotton sarees",
    "Kalankari",
    "Meena Cotton",
    "Kota Cotton",
    "Mangalagiri Cotton",
    "Vimal Cotton"
  ],

  "Wedding Collections": [
    "Russian Collection",
    "Benarus",
    "Raw Mango",
    "Pure Tussar",
    "Kantha Work",
    "Chinia Jeroget",
    "Mushroom Silk",
    "Spacework",
    "Mysore Crepe",
    "Khadi Jeorget",
    "HO Crepe",
    "Digital Prints",
    "Pattu",
    "Maheswari Silk"
  ],

  "DesignerSarees": [
    "Designer Silk",
    "Designer Organza",
    "Designer Georgette",
    "Designer Crepe",
    "Hand Painted Sarees",
    "Embroidered Sarees",
    "Mirror Work Sarees",
    "Sequence Work Sarees",
    "Premium Designer Sarees"
  ],

  "PartyWear": [
    "Party Wear Silk",
    "Party Wear Georgette",
    "Party Wear Net Sarees",
    "Sequence Sarees",
    "Embroidered Party Wear",
    "Fancy Sarees",
    "Bollywood Style Sarees",
    "Reception Sarees"
  ],

  "Weaving Mistake Sarees": [],
  "Dress Materials": [],
  "Budget Friendly Sarees": [],
  "Work Sarees": [],
  "Damage Sarees": [],
  "Pattu Sarees": [],
  "Designer Sarees": [],
  "Readymade Blouses": [],
  "Handloom Sarees": [],
  "Exclusive Sarees": []
};

// ============================================================
// DEFAULT SIZES
// ============================================================

const DEFAULT_DRESS_SIZES = [
  "S",
  "M",
  "L",
  "XL",
  "XXL"
];

// ============================================================
// HELPERS
// ============================================================

const isDressCategory = (category = "") => {
  const value = category.toLowerCase();

  return (
    value.includes("dress") ||
    value.includes("frock") ||
    value.includes("kurta") ||
    value.includes("gown") ||
    value.includes("top") ||
    value.includes("shirt") ||
    value.includes("pant")
  );
};

const calculateDiscount = (price, oldPrice) => {
  const p = Number(price);
  const op = Number(oldPrice);

  if (!op || !p || op <= 0 || p >= op) {
    return 0;
  }

  return Math.round(((op - p) / op) * 100);
};

const createEmptyDressColour = () => ({
  colour: "",

  mainImage: "",
  mainImageFile: null,

  thumbnails: [],
  thumbnailFiles: [],

  sizes: DEFAULT_DRESS_SIZES.map(size => ({
    size,
    price: "",
    oldPrice: "",
    discount: 0,
    stock: ""
  }))
});

const createEmptySareeColour = () => ({
  colour: "",

  price: "",
  oldPrice: "",
  discount: 0,
  stock: "",

  mainImage: "",
  mainImageFile: null,

  thumbnails: [],
  thumbnailFiles: []
});

const normalizeVariants = product => {
  if (Array.isArray(product?.variants)) {
    return product.variants;
  }

  if (typeof product?.variants === "string") {
    try {
      const parsed = JSON.parse(product.variants);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {}
  }

  return [];
};

const normalizeVariantForEdit = (
  variant,
  product,
  dress
) => {
  const existingMain =
    variant.mainImage ||
    variant.main_image ||
    variant.image ||
    "";

  const existingThumbs =
    Array.isArray(variant.thumbnails)
      ? variant.thumbnails
      : Array.isArray(variant.thumbnailImages)
      ? variant.thumbnailImages
      : [];

  if (dress) {
    return {
      ...variant,

      colour: variant.colour || "",

      mainImage: existingMain,

      mainImageFile: null,

      thumbnails: existingThumbs,

      thumbnailFiles: [],

      sizes: Array.isArray(variant.sizes)
        ? variant.sizes.map(size => ({
            size: size.size || "",
            price: size.price ?? "",
            oldPrice:
              size.oldPrice ??
              size.old_price ??
              "",
            discount:
              size.discount ?? 0,
            stock: size.stock ?? ""
          }))
        : DEFAULT_DRESS_SIZES.map(size => ({
            size,
            price: "",
            oldPrice: "",
            discount: 0,
            stock: ""
          }))
    };
  }

  return {
    ...variant,

    colour: variant.colour || "",

    price: variant.price ?? "",

    oldPrice:
      variant.oldPrice ??
      variant.old_price ??
      "",

    discount: variant.discount ?? 0,

    stock: variant.stock ?? "",

    mainImage: existingMain,

    mainImageFile: null,

    thumbnails: existingThumbs,

    thumbnailFiles: []
  };
};

// ============================================================
// CSV HELPERS
// ============================================================

const parseCSVLine = line => {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      char === "," &&
      !insideQuotes
    ) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());

  return result;
};

const parseCSV = text => {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter(line => line.trim());

  if (!lines.length) {
    return [];
  }

  const headers = parseCSVLine(lines[0]).map(
    header =>
      header
        .trim()
        .replace(/^"|"$/g, "")
        .toLowerCase()
  );

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);

    const row = {};

    headers.forEach((header, index) => {
      row[header] =
        values[index] !== undefined
          ? values[index]
          : "";
    });

    return row;
  });
};

const csvEscape = value => {
  const stringValue =
    value === null ||
    value === undefined
      ? ""
      : String(value);

  return `"${stringValue.replace(
    /"/g,
    '""'
  )}"`;
};

const downloadCSV = (
  rows,
  filename
) => {
  if (!rows.length) {
    alert("No data available.");
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map(row =>
      headers
        .map(header =>
          csvEscape(row[header])
        )
        .join(",")
    )
  ].join("\n");

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
// ============================================================
// DOWNLOAD EXCEL TEMPLATE
// ============================================================

// ============================================================
// DOWNLOAD SAMPLE CSV
// ============================================================

const downloadSampleCSV = () => {
  const csvData = [
    [
      "name",
      "category",
      "sub_category",
      "price",
      "old_price",
      "stock",
      "type",
      "img_url",
    ],

    [
      "Fresh Red Apples",
      "Fruits",
      "Apple",
      "120",
      "150",
      "50",
      "Regular",
      "https://example.com/apple.jpg",
    ],

    [
      "Fresh Bananas",
      "Fruits",
      "Banana",
      "60",
      "75",
      "100",
      "Regular",
      "https://example.com/banana.jpg",
    ],

    [
      "Tata Salt",
      "Grocery",
      "Salt",
      "25",
      "30",
      "80",
      "Regular",
      "https://example.com/salt.jpg",
    ],

    [
      "Aashirvaad Atta 5kg",
      "Grocery",
      "Flour",
      "280",
      "320",
      "40",
      "Regular",
      "https://example.com/atta.jpg",
    ],

    [
      "Premium Almonds",
      "Dry Fruits",
      "Almonds",
      "650",
      "750",
      "25",
      "Premium",
      "https://example.com/almonds.jpg",
    ],
  ];

  // Convert rows into CSV
  const csv = csvData
    .map((row) =>
      row
        .map((value) => {
          // Escape quotes and wrap values containing commas
          const escaped = String(value).replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    )
    .join("\n");

  // Create downloadable file
  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "sample_products_bulk_upload.csv";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
// ============================================================
// COMPONENT
// ============================================================

export default function AdminProductManager() {

  const [products, setProducts] =
    useState([]);

  const [isModalOpen, setModalOpen] =
    useState(false);

  const [isBulkModalOpen, setBulkModalOpen] =
    useState(false);

  const [currentProduct, setCurrentProduct] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  // ============================================================
  // BULK STATES
  // ============================================================

  const [bulkRows, setBulkRows] =
    useState([]);

  const [bulkFileName, setBulkFileName] =
    useState("");

  const [bulkUploading, setBulkUploading] =
    useState(false);

  const [bulkProgress, setBulkProgress] =
    useState(0);

  const [bulkResult, setBulkResult] =
    useState("");

  const [bulkErrors, setBulkErrors] =
    useState([]);

  const bulkFileRef = useRef(null);
const [bulkUploadType, setBulkUploadType] = useState("");
  // ============================================================
  // FORM
  // ============================================================

  const [formData, setFormData] =
    useState({
      name: "",
      cat: "SILK SAREES",
      subCat: "",
      type: "New Arrival",

      price: "",
      oldPrice: "",
      discount: "",
      stock: "",

      img: "",
      thumbnails: [],

      imgFile: null,
      thumbnailFiles: [],

      variants: []
    });

  // ============================================================
  // FETCH
  // ============================================================

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res =
        await fetch(
          `${API_URL}/all`
        );

      if (!res.ok) {
        throw new Error(
          "Failed to fetch products"
        );
      }

      const data =
        await res.json();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {
      console.error(err);

      setErrorMessage(
        "Unable to load products."
      );
    }
  };

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = (
    category = "SILK SAREES"
  ) => {

    const dress =
      isDressCategory(category);

    setFormData({
      name: "",
      cat: category,
      subCat: "",
      type: "New Arrival",

      price: "",
      oldPrice: "",
      discount: "",
      stock: "",

      img: "",
      thumbnails: [],

      imgFile: null,
      thumbnailFiles: [],

      variants: [
        dress
          ? createEmptyDressColour()
          : createEmptySareeColour()
      ]
    });
  };

  // ============================================================
  // OPEN MODAL
  // ============================================================

  const handleOpenModal = (
    product = null
  ) => {

    setErrorMessage("");

    if (product) {

      setCurrentProduct(product);

      const rawVariants =
        normalizeVariants(product);

      const dress =
        isDressCategory(
          product.category
        );

      let variants =
        rawVariants.length
          ? rawVariants
          : [];

      if (!variants.length) {

        if (dress) {

          variants = [{
            colour: "",
            mainImage: "",
            thumbnails: [],
            sizes:
              DEFAULT_DRESS_SIZES.map(
                size => ({
                  size,
                  price:
                    Number(
                      product.price
                    ) || "",
                  oldPrice:
                    Number(
                      product.old_price
                    ) || "",
                  discount:
                    Number(
                      product.discount
                    ) || 0,
                  stock: ""
                })
              )
          }];

        } else {

          variants = [{
            colour: "",

            price:
              Number(
                product.price
              ) || "",

            oldPrice:
              Number(
                product.old_price
              ) || "",

            discount:
              Number(
                product.discount
              ) || 0,

            stock:
              product.stock || "",

            mainImage: "",
            thumbnails: []
          }];
        }
      }

      const normalizedVariants =
        variants.map(
          variant =>
            normalizeVariantForEdit(
              variant,
              product,
              dress
            )
        );

      setFormData({
        name:
          product.name || "",

        cat:
          product.category ||
          "SILK SAREES",

        subCat:
          product.subCategory ||
          product.sub_category ||
          "",

        type:
          product.type ||
          "New Arrival",

        price:
          Number(
            product.price
          ) || "",

        oldPrice:
          Number(
            product.old_price
          ) || "",

        discount:
          Number(
            product.discount
          ) || 0,

        stock:
          product.stock || "",

        img:
          product.img_url || "",

        thumbnails:
          Array.isArray(
            product.thumbnails
          )
            ? product.thumbnails
            : [],

        imgFile: null,

        thumbnailFiles: [],

        variants:
          normalizedVariants
      });

    } else {

      setCurrentProduct(null);

      resetForm(
        "SILK SAREES"
      );
    }

    setModalOpen(true);
  };

// ============================================================
// RESET BULK UPLOAD STATE
// ============================================================

// ============================================================
// RESET BULK UPLOAD
// ============================================================

const resetBulkUpload = type => {

  setBulkRows([]);

  setBulkFileName("");

  setBulkErrors([]);

  setBulkResult("");

  setBulkProgress(0);

  setBulkUploadType(type);

  if (bulkFileRef.current) {
    bulkFileRef.current.value = "";
  }

  setBulkModalOpen(true);
};




  // ============================================================
  // CATEGORY
  // ============================================================

  const handleCategoryChange = category => {

    const dress =
      isDressCategory(category);

    setFormData(prev => ({
      ...prev,

      cat: category,

      subCat: "",

      variants: [
        dress
          ? createEmptyDressColour()
          : createEmptySareeColour()
      ]
    }));
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async id => {

    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {

      const res =
        await fetch(
          `${API_URL}/delete/${id}`,
          {
            method: "DELETE"
          }
        );

      if (!res.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      await fetchProducts();

    } catch (err) {

      console.error(err);

      alert(
        "Failed to delete product."
      );
    }
  };

  // ============================================================
  // COLOUR
  // ============================================================

  const addColour = () => {

    setFormData(prev => {

      const dress =
        isDressCategory(
          prev.cat
        );

      return {
        ...prev,

        variants: [
          ...prev.variants,

          dress
            ? createEmptyDressColour()
            : createEmptySareeColour()
        ]
      };
    });
  };

  const removeColour = index => {

    setFormData(prev => {

      if (
        prev.variants.length <= 1
      ) {
        alert(
          "At least one colour is required."
        );

        return prev;
      }

      return {
        ...prev,

        variants:
          prev.variants.filter(
            (_, i) =>
              i !== index
          )
      };
    });
  };

  const updateColourName = (
    index,
    value
  ) => {

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      variants[index] = {
        ...variants[index],
        colour: value
      };

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // SAREE VARIANT
  // ============================================================

  const updateSareeVariant = (
    index,
    field,
    value
  ) => {

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      const current = {
        ...variants[index]
      };

      if (
        field === "price"
      ) {
        current.price = value;

        current.discount =
          calculateDiscount(
            value,
            current.oldPrice
          );
      }

      if (
        field === "oldPrice"
      ) {
        current.oldPrice = value;

        current.discount =
          calculateDiscount(
            current.price,
            value
          );
      }

      if (
        field === "discount"
      ) {
        current.discount = value;

        if (
          Number(
            current.oldPrice
          ) > 0
        ) {
          current.price =
            Number(
              current.oldPrice
            ) -
            (
              Number(
                current.oldPrice
              ) *
              Number(value)
            ) /
            100;
        }
      }

      if (
        field === "stock"
      ) {
        current.stock = value;
      }

      variants[index] =
        current;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // DRESS SIZE
  // ============================================================

  const updateDressSize = (
    colourIndex,
    sizeIndex,
    field,
    value
  ) => {

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      const colourVariant = {
        ...variants[
          colourIndex
        ]
      };

      const sizes = [
        ...(colourVariant.sizes ||
          [])
      ];

      const currentSize = {
        ...sizes[sizeIndex]
      };

      if (
        field === "size"
      ) {
        currentSize.size =
          value.toUpperCase();
      }

      if (
        field === "price"
      ) {
        currentSize.price =
          value;

        currentSize.discount =
          calculateDiscount(
            value,
            currentSize.oldPrice
          );
      }

      if (
        field === "oldPrice"
      ) {
        currentSize.oldPrice =
          value;

        currentSize.discount =
          calculateDiscount(
            currentSize.price,
            value
          );
      }

      if (
        field === "discount"
      ) {
        currentSize.discount =
          value;

        if (
          Number(
            currentSize.oldPrice
          ) > 0
        ) {
          currentSize.price =
            Number(
              currentSize.oldPrice
            ) -
            (
              Number(
                currentSize.oldPrice
              ) *
              Number(value)
            ) /
            100;
        }
      }

      if (
        field === "stock"
      ) {
        currentSize.stock =
          value;
      }

      sizes[sizeIndex] =
        currentSize;

      colourVariant.sizes =
        sizes;

      variants[colourIndex] =
        colourVariant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // ADD SIZE
  // ============================================================

  const addSize = colourIndex => {

    const size =
      window.prompt(
        "Enter size name:"
      );

    if (
      !size ||
      !size.trim()
    ) {
      return;
    }

    const cleanSize =
      size
        .trim()
        .toUpperCase();

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      const colourVariant = {
        ...variants[
          colourIndex
        ]
      };

      const sizes = [
        ...(colourVariant.sizes ||
          [])
      ];

      const exists =
        sizes.some(
          item =>
            String(
              item.size
            ).toLowerCase() ===
            cleanSize.toLowerCase()
        );

      if (exists) {
        alert(
          `${cleanSize} already exists.`
        );

        return prev;
      }

      sizes.push({
        size: cleanSize,
        price: "",
        oldPrice: "",
        discount: 0,
        stock: ""
      });

      colourVariant.sizes =
        sizes;

      variants[colourIndex] =
        colourVariant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // REMOVE SIZE
  // ============================================================

  const removeSize = (
    colourIndex,
    sizeIndex
  ) => {

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      const colourVariant = {
        ...variants[
          colourIndex
        ]
      };

      const sizes = [
        ...(colourVariant.sizes ||
          [])
      ];

      if (
        sizes.length <= 1
      ) {
        alert(
          "At least one size is required."
        );

        return prev;
      }

      sizes.splice(
        sizeIndex,
        1
      );

      colourVariant.sizes =
        sizes;

      variants[colourIndex] =
        colourVariant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // IMAGE HANDLING
  // ============================================================

  const handleImageChange = (
    e,
    type
  ) => {

    const files =
      Array.from(
        e.target.files || []
      );

    if (!files.length) {
      return;
    }

    if (type === "img") {

      const url =
        URL.createObjectURL(
          files[0]
        );

      setFormData(prev => ({
        ...prev,

        img: url,

        imgFile:
          files[0]
      }));

    } else {

      const urls =
        files.map(
          file =>
            URL.createObjectURL(
              file
            )
        );

      setFormData(prev => ({
        ...prev,

        thumbnails:
          urls,

        thumbnailFiles:
          files
      }));
    }
  };

  const handleVariantMainImage = (
    colourIndex,
    e
  ) => {

    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    const url =
      URL.createObjectURL(
        file
      );

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      variants[colourIndex] = {
        ...variants[
          colourIndex
        ],

        mainImage: url,

        mainImageFile:
          file
      };

      return {
        ...prev,
        variants
      };
    });
  };

  const handleVariantThumbnails = (
    colourIndex,
    e
  ) => {

    const files =
      Array.from(
        e.target.files || []
      );

    if (!files.length) {
      return;
    }

    const urls =
      files.map(
        file =>
          URL.createObjectURL(
            file
          )
      );

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      variants[colourIndex] = {
        ...variants[
          colourIndex
        ],

        thumbnails: [
          ...(variants[
            colourIndex
          ].thumbnails || []),
          ...urls
        ],

        thumbnailFiles: [
          ...(variants[
            colourIndex
          ].thumbnailFiles || []),
          ...files
        ]
      };

      return {
        ...prev,
        variants
      };
    });
  };

  const removeVariantMainImage = index => {

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      variants[index] = {
        ...variants[index],

        mainImage: "",

        mainImageFile: null
      };

      return {
        ...prev,
        variants
      };
    });
  };

  const removeVariantThumbnail = (
    colourIndex,
    imageIndex
  ) => {

    setFormData(prev => {

      const variants = [
        ...prev.variants
      ];

      const variant = {
        ...variants[
          colourIndex
        ]
      };

      const thumbnails = [
        ...(variant.thumbnails ||
          [])
      ];

      const thumbnailFiles = [
        ...(variant.thumbnailFiles ||
          [])
      ];

      thumbnails.splice(
        imageIndex,
        1
      );

      if (
        imageIndex <
        thumbnailFiles.length
      ) {
        thumbnailFiles.splice(
          imageIndex,
          1
        );
      }

      variant.thumbnails =
        thumbnails;

      variant.thumbnailFiles =
        thumbnailFiles;

      variants[colourIndex] =
        variant;

      return {
        ...prev,
        variants
      };
    });
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateVariants = () => {

    if (
      !formData.variants.length
    ) {
      throw new Error(
        "Please add at least one colour."
      );
    }

    for (
      let i = 0;
      i <
      formData.variants.length;
      i++
    ) {

      const variant =
        formData.variants[i];

      if (
        !variant.colour?.trim()
      ) {
        throw new Error(
          `Please enter colour for Colour ${
            i + 1
          }.`
        );
      }

      if (
        !variant.mainImage &&
        !variant.mainImageFile
      ) {
        throw new Error(
          `Please add a main image for ${variant.colour}.`
        );
      }

      if (
        isDressCategory(
          formData.cat
        )
      ) {

        if (
          !variant.sizes?.length
        ) {
          throw new Error(
            `Please add at least one size for ${variant.colour}.`
          );
        }

        for (
          let j = 0;
          j <
          variant.sizes.length;
          j++
        ) {

          const size =
            variant.sizes[j];

          if (
            size.price === "" ||
            size.price === null ||
            size.price === undefined
          ) {
            throw new Error(
              `Please enter price for ${variant.colour} - ${size.size}.`
            );
          }

          if (
            size.stock === "" ||
            size.stock === null ||
            size.stock === undefined
          ) {
            throw new Error(
              `Please enter stock for ${variant.colour} - ${size.size}.`
            );
          }
        }

      } else {

        if (
          variant.price === "" ||
          variant.price === null ||
          variant.price === undefined
        ) {
          throw new Error(
            `Please enter price for ${variant.colour}.`
          );
        }

        if (
          variant.stock === "" ||
          variant.stock === null ||
          variant.stock === undefined
        ) {
          throw new Error(
            `Please enter stock for ${variant.colour}.`
          );
        }
      }
    }
  };

  // ============================================================
  // SAVE PRODUCT
  // ============================================================

  const handleSave = async e => {

    e.preventDefault();

    setSaving(true);
    setErrorMessage("");

    try {

      if (
        !formData.name.trim()
      ) {
        throw new Error(
          "Product name is required."
        );
      }

      validateVariants();

      const form =
        new FormData();

      form.append(
        "name",
        formData.name
      );

      form.append(
        "cat",
        formData.cat
      );

      form.append(
        "subCategory",
        formData.subCat
      );

      form.append(
        "type",
        formData.type
      );

      const dress =
        isDressCategory(
          formData.cat
        );

      let defaultPrice = 0;
      let defaultOldPrice = 0;
      let defaultDiscount = 0;
      let defaultStock = 0;

      if (dress) {

        const firstColour =
          formData.variants[0];

        const firstSize =
          firstColour?.sizes?.[0];

        defaultPrice =
          Number(
            firstSize?.price || 0
          );

        defaultOldPrice =
          Number(
            firstSize?.oldPrice || 0
          );

        defaultDiscount =
          Number(
            firstSize?.discount || 0
          );

        defaultStock =
          formData.variants.reduce(
            (total, colour) =>
              total +
              (
                colour.sizes || []
              ).reduce(
                (sum, size) =>
                  sum +
                  Number(
                    size.stock || 0
                  ),
                0
              ),
            0
          );

      } else {

        const firstColour =
          formData.variants[0];

        defaultPrice =
          Number(
            firstColour?.price || 0
          );

        defaultOldPrice =
          Number(
            firstColour?.oldPrice || 0
          );

        defaultDiscount =
          Number(
            firstColour?.discount || 0
          );

        defaultStock =
          formData.variants.reduce(
            (total, variant) =>
              total +
              Number(
                variant.stock || 0
              ),
            0
          );
      }

      form.append(
        "price",
        String(defaultPrice)
      );

      form.append(
        "oldPrice",
        String(defaultOldPrice)
      );

      form.append(
        "discount",
        String(defaultDiscount)
      );

      form.append(
        "stock",
        String(defaultStock)
      );

      form.append(
        "hasSizes",
        String(dress)
      );

      if (
        formData.imgFile
      ) {

        form.append(
          "img_url",
          formData.imgFile
        );

      } else if (
        currentProduct
      ) {

        form.append(
          "existingMainImage",
          currentProduct.img_url || ""
        );
      }

      if (
        formData.thumbnailFiles?.length
      ) {

        formData.thumbnailFiles.forEach(
          file => {
            form.append(
              "thumbnails",
              file
            );
          }
        );

      } else if (
        currentProduct
      ) {

        form.append(
          "existingThumbnails",
          JSON.stringify(
            currentProduct.thumbnails || []
          )
        );
      }

      const variantsForJSON =
        formData.variants.map(
          (variant, colourIndex) => {

            const cleanVariant = {
              colour:
                variant.colour
            };

            if (dress) {

              cleanVariant.sizes =
                (
                  variant.sizes || []
                ).map(size => ({
                  size:
                    size.size,

                  price:
                    Number(
                      size.price || 0
                    ),

                  oldPrice:
                    Number(
                      size.oldPrice || 0
                    ),

                  discount:
                    Number(
                      size.discount || 0
                    ),

                  stock:
                    Number(
                      size.stock || 0
                    )
                }));

            } else {

              cleanVariant.price =
                Number(
                  variant.price || 0
                );

              cleanVariant.oldPrice =
                Number(
                  variant.oldPrice || 0
                );

              cleanVariant.discount =
                Number(
                  variant.discount || 0
                );

              cleanVariant.stock =
                Number(
                  variant.stock || 0
                );
            }

            cleanVariant.existingMainImage =
              variant.mainImageFile
                ? ""
                : variant.mainImage || "";

            cleanVariant.existingThumbnails =
              (
                variant.thumbnails || []
              ).filter(
                url =>
                  typeof url === "string"
              );

            cleanVariant.mainImageField =
              variant.mainImageFile
                ? `variant_${colourIndex}_main`
                : "";

            cleanVariant.thumbnailField =
              `variant_${colourIndex}_thumbnails`;

            return cleanVariant;
          }
        );

      form.append(
        "variants",
        JSON.stringify(
          variantsForJSON
        )
      );

      const variantImageMeta = [];

      formData.variants.forEach(
        (
          variant,
          colourIndex
        ) => {

          if (
            variant.mainImageFile
          ) {

            form.append(
              `variant_${colourIndex}_main`,
              variant.mainImageFile
            );
          }

          if (
            variant.thumbnailFiles?.length
          ) {

            variant.thumbnailFiles.forEach(
              file => {

                form.append(
                  `variant_${colourIndex}_thumbnails`,
                  file
                );
              }
            );
          }

          variantImageMeta.push({
            colourIndex,

            colour:
              variant.colour,

            mainImageField:
              variant.mainImageFile
                ? `variant_${colourIndex}_main`
                : null,

            thumbnailField:
              `variant_${colourIndex}_thumbnails`,

            existingMainImage:
              variant.mainImageFile
                ? null
                : variant.mainImage || null,

            existingThumbnails:
              (
                variant.thumbnails || []
              ).filter(
                url =>
                  typeof url === "string"
              )
          });
        }
      );

      form.append(
        "variantImageMeta",
        JSON.stringify(
          variantImageMeta
        )
      );

      const url =
        currentProduct
          ? `${API_URL}/update/${currentProduct.id}`
          : `${API_URL}/add`;

      const method =
        currentProduct
          ? "PUT"
          : "POST";

      const res =
        await fetch(
          url,
          {
            method,
            body: form
          }
        );

      const responseText =
        await res.text();

      if (!res.ok) {
        throw new Error(
          responseText ||
          "Failed to save product."
        );
      }

      await fetchProducts();

      setModalOpen(false);

      setCurrentProduct(null);

      alert(
        currentProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

    } catch (err) {

      console.error(err);

      setErrorMessage(
        err.message ||
        "Failed to save product."
      );

    } finally {

      setSaving(false);
    }
  };

  // ============================================================
  // BUILD BULK PRODUCT FROM CSV ROWS
  // ============================================================

  const buildBulkProducts = rows => {

    const grouped = {};

    rows.forEach(row => {

      const name =
        row.name?.trim();

      if (!name) {
        return;
      }

      const category =
        row.category?.trim() ||
        "SILK SAREES";

      const subCategory =
        row.subcategory?.trim() ||
        row.subcat?.trim() ||
        "";

      const type =
        row.type?.trim() ||
        "New Arrival";

      const key = [
        name,
        category,
        subCategory,
        type
      ]
        .join("|||")
        .toLowerCase();

      if (!grouped[key]) {

        grouped[key] = {
          name,
          category,
          subCategory,
          type,
          variants: []
        };
      }

      const colour =
        row.colour?.trim();

      if (!colour) {
        return;
      }

      const mainImage =
        row.mainimage?.trim() ||
        row.main_image?.trim() ||
        "";

      const thumbnailsString =
        row.thumbnails?.trim() ||
        "";

      const thumbnails =
        thumbnailsString
          ? thumbnailsString
              .split("|")
              .map(x => x.trim())
              .filter(Boolean)
          : [];

      const dress =
        isDressCategory(
          category
        );

      if (dress) {

        const sizesString =
          row.sizes?.trim() || "";

        const sizes =
          sizesString
            ? sizesString
                .split(";")
                .map(item => {

                  const parts =
                    item
                      .split("|")
                      .map(x => x.trim());

                  return {
                    size:
                      parts[0] || "",

                    price:
                      Number(
                        parts[1] || 0
                      ),

                    oldPrice:
                      Number(
                        parts[2] || 0
                      ),

                    discount:
                      Number(
                        parts[3] || 0
                      ),

                    stock:
                      Number(
                        parts[4] || 0
                      )
                  };
                })
                .filter(
                  item =>
                    item.size
                )
            : [];

        grouped[key]
          .variants
          .push({
            colour,
            sizes,
            existingMainImage:
              mainImage,
            existingThumbnails:
              thumbnails
          });

      } else {

        const price =
          Number(
            row.price || 0
          );

        const oldPrice =
          Number(
            row.oldprice ||
            row.old_price ||
            0
          );

        let discount =
          Number(
            row.discount || 0
          );

        if (
          !discount &&
          oldPrice > price
        ) {
          discount =
            calculateDiscount(
              price,
              oldPrice
            );
        }

        grouped[key]
          .variants
          .push({
            colour,

            price,

            oldPrice,

            discount,

            stock:
              Number(
                row.stock || 0
              ),

            existingMainImage:
              mainImage,

            existingThumbnails:
              thumbnails
          });
      }
    });

    return Object.values(
      grouped
    );
  };

  // ============================================================
  // BULK FILE SELECT
  // ============================================================

// ============================================================
// BULK FILE SELECT
// CSV AND EXCEL
// ============================================================

const handleBulkFile = e => {

  const file = e.target.files?.[0];

  if (!file) {
    return;
  }

  const fileName =
    file.name.toLowerCase();


  // ==========================================================
  // CSV UPLOAD
  // ==========================================================

  if (bulkUploadType === "csv") {

    if (!fileName.endsWith(".csv")) {

      alert(
        "Please select a CSV file."
      );

      e.target.value = "";

      return;
    }

    setBulkFileName(file.name);

    setBulkResult("");

    setBulkErrors([]);

    const reader = new FileReader();


    reader.onload = event => {

      try {

        const text =
          event.target.result;

        const rows =
          parseCSV(text);

        if (!rows.length) {

          throw new Error(
            "CSV file is empty."
          );
        }

        setBulkRows(rows);

        setBulkResult(
          `${rows.length} CSV rows loaded successfully.`
        );

      } catch (err) {

        console.error(err);

        setBulkRows([]);

        setBulkErrors([
          err.message ||
          "Unable to read CSV file."
        ]);
      }
    };


    reader.onerror = () => {

      setBulkRows([]);

      setBulkErrors([
        "Failed to read CSV file."
      ]);
    };


    reader.readAsText(file);

    return;
  }


  // ==========================================================
  // EXCEL UPLOAD
  // ==========================================================

  if (bulkUploadType === "excel") {

    const isExcel =

      fileName.endsWith(".xlsx") ||

      fileName.endsWith(".xls");


    if (!isExcel) {

      alert(
        "Please select an Excel file (.xlsx or .xls)."
      );

      e.target.value = "";

      return;
    }


    setBulkFileName(file.name);

    setBulkResult("");

    setBulkErrors([]);


    const reader = new FileReader();


    reader.onload = event => {

      try {

        const data =
          event.target.result;


        // Read Excel workbook

        const workbook =
          XLSX.read(data, {
            type: "array"
          });


        if (
          !workbook.SheetNames ||
          !workbook.SheetNames.length
        ) {

          throw new Error(
            "Excel file does not contain any sheets."
          );
        }


        // First sheet

        const firstSheetName =
          workbook.SheetNames[0];


        const worksheet =
          workbook.Sheets[firstSheetName];


        let rows =
          XLSX.utils.sheet_to_json(
            worksheet,
            {
              defval: ""
            }
          );


        // Normalize column names
        // Example:
        // "Old Price" -> oldprice
        // "main Image" -> mainimage

        rows = rows.map(row => {

          const normalizedRow = {};


          Object.keys(row).forEach(key => {

            const normalizedKey =

              String(key)

                .trim()

                .toLowerCase()

                .replace(/\s+/g, "");


            normalizedRow[normalizedKey] =
              row[key];

          });


          return normalizedRow;
        });


        if (!rows.length) {

          throw new Error(
            "Excel file is empty."
          );
        }


        setBulkRows(rows);


        setBulkResult(
          `${rows.length} Excel rows loaded successfully.`
        );


      } catch (err) {

        console.error(err);

        setBulkRows([]);


        setBulkErrors([
          err.message ||
          "Unable to read Excel file."
        ]);
      }
    };


    reader.onerror = () => {

      setBulkRows([]);

      setBulkErrors([
        "Failed to read Excel file."
      ]);
    };


    reader.readAsArrayBuffer(file);

    return;
  }


  // ==========================================================
  // INVALID UPLOAD TYPE
  // ==========================================================

  alert(
    "Please select CSV Upload or Excel Upload first."
  );

  e.target.value = "";
};
  // ============================================================
  // DOWNLOAD CSV TEMPLATE
  // ============================================================

  const downloadTemplate = () => {

    const rows = [
      {
        name:
          "Sample Kanchipuram Saree",

        category:
          "SILK SAREES",

        subCategory:
          "Chiffons",

        type:
          "New Arrival",

        colour:
          "Red",

        price:
          "2499",

        oldPrice:
          "2999",

        discount:
          "17",

        stock:
          "10",

        mainImage:
          "https://example.com/red.jpg",

        thumbnails:
          "https://example.com/r1.jpg|https://example.com/r2.jpg",

        sizes:
          ""
      },

      {
        name:
          "Sample Kanchipuram Saree",

        category:
          "SILK SAREES",

        subCategory:
          "Chiffons",

        type:
          "New Arrival",

        colour:
          "Blue",

        price:
          "2799",

        oldPrice:
          "3299",

        discount:
          "15",

        stock:
          "8",

        mainImage:
          "https://example.com/blue.jpg",

        thumbnails:
          "https://example.com/b1.jpg|https://example.com/b2.jpg",

        sizes:
          ""
      },

      {
        name:
          "Sample Dress",

        category:
          "Dress Materials",

        subCategory:
          "",

        type:
          "Regular",

        colour:
          "Pink",

        price:
          "",

        oldPrice:
          "",

        discount:
          "",

        stock:
          "",

        mainImage:
          "https://example.com/pink.jpg",

        thumbnails:
          "https://example.com/p1.jpg|https://example.com/p2.jpg",

        sizes:
          "S|999|1299|23|10;M|999|1299|23|15;L|1099|1399|21|8"
      }
    ];

    downloadCSV(
      rows,
      "products_bulk_template.csv"
    );
  };

  // ============================================================
  // BULK UPLOAD
  // ============================================================

  const handleBulkUpload = async () => {

    if (!bulkRows.length) {

      alert(
        "Please select a CSV file first."
      );

      return;
    }

    setBulkUploading(true);

    setBulkProgress(0);

    setBulkResult("");

    setBulkErrors([]);

    const bulkProducts =
      buildBulkProducts(
        bulkRows
      );

    if (!bulkProducts.length) {

      setBulkUploading(false);

      setBulkErrors([
        "No valid products found in CSV."
      ]);

      return;
    }

    let successCount = 0;

    const errors = [];

    for (
      let i = 0;
      i < bulkProducts.length;
      i++
    ) {

      const product =
        bulkProducts[i];

      try {

        const dress =
          isDressCategory(
            product.category
          );

        if (
          !product.variants.length
        ) {
          throw new Error(
            `${product.name}: No colour variants found.`
          );
        }

        const firstVariant =
          product.variants[0];

        let defaultPrice = 0;
        let defaultOldPrice = 0;
        let defaultDiscount = 0;
        let defaultStock = 0;

        if (dress) {

          const firstSize =
            firstVariant
              ?.sizes?.[0];

          defaultPrice =
            Number(
              firstSize?.price || 0
            );

          defaultOldPrice =
            Number(
              firstSize?.oldPrice || 0
            );

          defaultDiscount =
            Number(
              firstSize?.discount || 0
            );

          defaultStock =
            product.variants.reduce(
              (total, variant) =>
                total +
                (
                  variant.sizes || []
                ).reduce(
                  (sum, size) =>
                    sum +
                    Number(
                      size.stock || 0
                    ),
                  0
                ),
              0
            );

        } else {

          defaultPrice =
            Number(
              firstVariant?.price || 0
            );

          defaultOldPrice =
            Number(
              firstVariant?.oldPrice || 0
            );

          defaultDiscount =
            Number(
              firstVariant?.discount || 0
            );

          defaultStock =
            product.variants.reduce(
              (total, variant) =>
                total +
                Number(
                  variant.stock || 0
                ),
              0
            );
        }

        const form =
          new FormData();

        form.append(
          "name",
          product.name
        );

        form.append(
          "cat",
          product.category
        );

        form.append(
          "subCategory",
          product.subCategory
        );

        form.append(
          "type",
          product.type
        );

        form.append(
          "price",
          String(
            defaultPrice
          )
        );

        form.append(
          "oldPrice",
          String(
            defaultOldPrice
          )
        );

        form.append(
          "discount",
          String(
            defaultDiscount
          )
        );

        form.append(
          "stock",
          String(
            defaultStock
          )
        );

        form.append(
          "hasSizes",
          String(dress)
        );

        // --------------------------------------------------------
        // VARIANTS
        // --------------------------------------------------------

        const variants =
          product.variants.map(
            (
              variant,
              colourIndex
            ) => {

              const clean = {
                colour:
                  variant.colour
              };

              if (dress) {

                clean.sizes =
                  (
                    variant.sizes ||
                    []
                  ).map(size => ({
                    size:
                      size.size,

                    price:
                      Number(
                        size.price || 0
                      ),

                    oldPrice:
                      Number(
                        size.oldPrice || 0
                      ),

                    discount:
                      Number(
                        size.discount || 0
                      ),

                    stock:
                      Number(
                        size.stock || 0
                      )
                  }));

              } else {

                clean.price =
                  Number(
                    variant.price || 0
                  );

                clean.oldPrice =
                  Number(
                    variant.oldPrice || 0
                  );

                clean.discount =
                  Number(
                    variant.discount || 0
                  );

                clean.stock =
                  Number(
                    variant.stock || 0
                  );
              }

              clean.existingMainImage =
                variant.existingMainImage ||
                "";

              clean.existingThumbnails =
                variant.existingThumbnails ||
                [];

              clean.mainImageField = "";

              clean.thumbnailField =
                `variant_${colourIndex}_thumbnails`;

              return clean;
            }
          );

        form.append(
          "variants",
          JSON.stringify(
            variants
          )
        );

        // --------------------------------------------------------
        // IMAGE META
        // --------------------------------------------------------

        const imageMeta =
          product.variants.map(
            (
              variant,
              colourIndex
            ) => ({
              colourIndex,

              colour:
                variant.colour,

              mainImageField:
                null,

              thumbnailField:
                `variant_${colourIndex}_thumbnails`,

              existingMainImage:
                variant.existingMainImage ||
                null,

              existingThumbnails:
                variant.existingThumbnails ||
                []
            })
          );

        form.append(
          "variantImageMeta",
          JSON.stringify(
            imageMeta
          )
        );

        // --------------------------------------------------------
        // MAIN PRODUCT IMAGE URL
        // --------------------------------------------------------

        if (
          firstVariant?.existingMainImage
        ) {

          form.append(
            "existingMainImage",
            firstVariant.existingMainImage
          );
        }

        // --------------------------------------------------------
        // PRODUCT THUMBNAILS
        // --------------------------------------------------------

        if (
          firstVariant?.existingThumbnails
            ?.length
        ) {

          form.append(
            "existingThumbnails",
            JSON.stringify(
              firstVariant.existingThumbnails
            )
          );
        }

        // --------------------------------------------------------
        // SEND
        // --------------------------------------------------------

        const response =
          await fetch(
            `${API_URL}/add`,
            {
              method: "POST",
              body: form
            }
          );

        const responseText =
          await response.text();

        if (!response.ok) {
          throw new Error(
            responseText ||
            "Failed to add product."
          );
        }

        successCount++;

      } catch (err) {

        console.error(
          "Bulk product error:",
          product,
          err
        );

        errors.push(
          `${product.name}: ${
            err.message
          }`
        );
      }

      setBulkProgress(
        Math.round(
          ((i + 1) /
            bulkProducts.length) *
          100
        )
      );
    }

    await fetchProducts();

    setBulkUploading(false);

    setBulkErrors(errors);

    setBulkResult(
      `${successCount} of ${bulkProducts.length} products added successfully.`
    );
  };

  // ============================================================
  // EXPORT PRODUCTS
  // ============================================================

  const handleExportProducts = () => {

    if (!products.length) {

      alert(
        "There are no products to export."
      );

      return;
    }

    const rows = [];

    products.forEach(product => {

      const variants =
        normalizeVariants(
          product
        );

      const dress =
        isDressCategory(
          product.category
        );

      if (!variants.length) {

        rows.push({
          name:
            product.name || "",

          category:
            product.category || "",

          subCategory:
            product.sub_category ||
            product.subCategory ||
            "",

          type:
            product.type || "",

          colour: "",

          price:
            product.price || "",

          oldPrice:
            product.old_price || "",

          discount:
            product.discount || "",

          stock:
            product.stock || "",

          mainImage:
            product.img_url || "",

          thumbnails:
            (
              product.thumbnails || []
            ).join("|"),

          sizes: ""
        });

        return;
      }

      variants.forEach(
        variant => {

          const mainImage =
            variant.mainImage ||
            variant.main_image ||
            variant.image ||
            "";

          const thumbnails =
            Array.isArray(
              variant.thumbnails
            )
              ? variant.thumbnails
              : [];

          if (dress) {

            const sizes =
              (
                variant.sizes || []
              )
                .map(size =>
                  [
                    size.size || "",
                    size.price || 0,
                    size.oldPrice ||
                      size.old_price ||
                      0,
                    size.discount || 0,
                    size.stock || 0
                  ].join("|")
                )
                .join(";");

            rows.push({
              name:
                product.name || "",

              category:
                product.category || "",

              subCategory:
                product.sub_category ||
                product.subCategory ||
                "",

              type:
                product.type || "",

              colour:
                variant.colour || "",

              price: "",
              oldPrice: "",
              discount: "",
              stock: "",

              mainImage,

              thumbnails:
                thumbnails.join("|"),

              sizes
            });

          } else {

            rows.push({
              name:
                product.name || "",

              category:
                product.category || "",

              subCategory:
                product.sub_category ||
                product.subCategory ||
                "",

              type:
                product.type || "",

              colour:
                variant.colour || "",

              price:
                variant.price || "",

              oldPrice:
                variant.oldPrice ||
                variant.old_price ||
                "",

              discount:
                variant.discount || "",

              stock:
                variant.stock || "",

              mainImage,

              thumbnails:
                thumbnails.join("|"),

              sizes: ""
            });
          }
        }
      );
    });

    downloadCSV(
      rows,
      `products_export_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
  };

  // ============================================================
  // TOTAL STOCK
  // ============================================================

  const getTotalVariantStock =
    product => {

      const variants =
        normalizeVariants(
          product
        );

      if (!variants.length) {
        return Number(
          product.stock || 0
        );
      }

      if (
        isDressCategory(
          product.category
        )
      ) {

        return variants.reduce(
          (total, colour) =>
            total +
            (
              colour.sizes || []
            ).reduce(
              (sum, size) =>
                sum +
                Number(
                  size.stock || 0
                ),
              0
            ),
          0
        );
      }

      return variants.reduce(
        (total, variant) =>
          total +
          Number(
            variant.stock || 0
          ),
        0
      );
    };

  // ============================================================
  // VARIANT SUMMARY
  // ============================================================

  const renderVariantSummary =
    product => {

      const variants =
        normalizeVariants(
          product
        );

      if (!variants.length) {

        return (
          <span
            style={{
              color: "#999"
            }}
          >
            No variants
          </span>
        );
      }

      const dress =
        isDressCategory(
          product.category
        );

      return (
        <div className="variant-summary">

          {variants.map(
            (
              variant,
              index
            ) => {

              const mainImage =
                variant.mainImage ||
                variant.main_image ||
                variant.image ||
                "";

              const thumbnails =
                Array.isArray(
                  variant.thumbnails
                )
                  ? variant.thumbnails
                  : [];

              return (
                <div
                  key={index}
                  className="variant-colour-row"
                >

                  <span className="colour-chip">
                    {variant.colour ||
                      `Colour ${
                        index + 1
                      }`}
                  </span>

                  {dress ? (

                    <>
                      {(
                        variant.sizes ||
                        []
                      ).map(
                        (
                          size,
                          sizeIndex
                        ) => (

                          <span
                            className="size-chip"
                            key={
                              sizeIndex
                            }
                          >
                            {size.size}: ₹
                            {Number(
                              size.price || 0
                            ).toLocaleString()}
                            {" / "}
                            {Number(
                              size.stock || 0
                            )} pcs
                          </span>
                        )
                      )}
                    </>

                  ) : (

                    <span className="size-chip">
                      ₹
                      {Number(
                        variant.price || 0
                      ).toLocaleString()}
                      {" / "}
                      {Number(
                        variant.stock || 0
                      )} pcs
                    </span>
                  )}

                  {(mainImage ||
                    thumbnails.length >
                      0) && (

                    <div className="variant-images-mini">

                      {mainImage && (
                        <img
                          src={mainImage}
                          className="variant-image-mini"
                          alt=""
                        />
                      )}

                      {thumbnails
                        .slice(0, 4)
                        .map(
                          (
                            image,
                            imageIndex
                          ) => (
                            <img
                              key={
                                imageIndex
                              }
                              src={
                                image
                              }
                              className="variant-image-mini"
                              alt=""
                            />
                          )
                        )}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      );
    };

  // ============================================================
  // RENDER COLOUR IMAGES
  // ============================================================

  const renderColourImages =
    (
      variant,
      colourIndex
    ) => {

      return (
        <div className="colour-image-section">

          <div className="colour-image-title">
            🖼️{" "}
            {variant.colour ||
              `Colour ${
                colourIndex + 1
              }`}{" "}
            Images
          </div>

          <div className="image-upload-grid">

            <div className="image-upload-box">

              <label>
                Main Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  handleVariantMainImage(
                    colourIndex,
                    e
                  )
                }
              />

              {variant.mainImage && (
                <div className="image-preview-row">

                  <div className="image-preview-wrapper">

                    <img
                      src={
                        variant.mainImage
                      }
                      className="image-preview"
                      alt=""
                    />

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() =>
                        removeVariantMainImage(
                          colourIndex
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                </div>
              )}
            </div>

            <div className="image-upload-box">

              <label>
                Thumbnail Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={e =>
                  handleVariantThumbnails(
                    colourIndex,
                    e
                  )
                }
              />

              {variant.thumbnails?.length >
                0 && (

                <div className="image-preview-row">

                  {variant.thumbnails.map(
                    (
                      image,
                      imageIndex
                    ) => (

                      <div
                        className="image-preview-wrapper"
                        key={
                          imageIndex
                        }
                      >

                        <img
                          src={
                            image
                          }
                          className="image-preview"
                          alt=""
                        />

                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() =>
                            removeVariantThumbnail(
                              colourIndex,
                              imageIndex
                            )
                          }
                        >
                          ×
                        </button>

                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

  // ============================================================
  // RENDER VARIANT BUILDER
  // ============================================================

  const renderVariantBuilder =
    () => {

      const dress =
        isDressCategory(
          formData.cat
        );

      return (
        <div className="variant-builder">

          <div className="variant-builder-title">
            {dress
              ? "Dress Colour, Images & Size Variants"
              : "Saree Colour, Images & Price Variants"}
          </div>

          <div className="variant-builder-description">
            {dress
              ? "Each colour can have different images, sizes, prices and stock."
              : "Each colour can have its own image, price, MRP, discount and stock."}
          </div>

          <div className="info-box">
            <strong>
              Example:
            </strong>{" "}
            Red → Red images + ₹2499.
            Blue → Blue images + ₹2799.
          </div>

          {formData.variants.map(
            (
              variant,
              colourIndex
            ) => (

              <div
                className="colour-card"
                key={colourIndex}
              >

                <div className="colour-card-header">

                  <div className="colour-card-header-left">

                    <strong>
                      Colour{" "}
                      {colourIndex + 1}
                    </strong>

                    <input
                      className="colour-name-input"
                      type="text"
                      placeholder="Red"
                      value={
                        variant.colour ||
                        ""
                      }
                      onChange={e =>
                        updateColourName(
                          colourIndex,
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <button
                    type="button"
                    className="btn-small btn-red"
                    onClick={() =>
                      removeColour(
                        colourIndex
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

                <div className="colour-card-body">

                  {renderColourImages(
                    variant,
                    colourIndex
                  )}

                  {dress ? (

                    <>
                      <div className="size-table-wrapper">

                        <table className="size-table">

                          <thead>
                            <tr>
                              <th>Size</th>
                              <th>Price ₹</th>
                              <th>MRP ₹</th>
                              <th>Discount %</th>
                              <th>Stock</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>

                            {(variant.sizes ||
                              []).map(
                                (
                                  size,
                                  sizeIndex
                                ) => (

                                  <tr
                                    key={
                                      sizeIndex
                                    }
                                  >

                                    <td>
                                      <input
                                        className="size-name-box"
                                        value={
                                          size.size ||
                                          ""
                                        }
                                        onChange={e =>
                                          updateDressSize(
                                            colourIndex,
                                            sizeIndex,
                                            "size",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="number"
                                        min="0"
                                        value={
                                          size.price ??
                                          ""
                                        }
                                        onChange={e =>
                                          updateDressSize(
                                            colourIndex,
                                            sizeIndex,
                                            "price",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="number"
                                        min="0"
                                        value={
                                          size.oldPrice ??
                                          ""
                                        }
                                        onChange={e =>
                                          updateDressSize(
                                            colourIndex,
                                            sizeIndex,
                                            "oldPrice",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={
                                          size.discount ??
                                          0
                                        }
                                        onChange={e =>
                                          updateDressSize(
                                            colourIndex,
                                            sizeIndex,
                                            "discount",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <input
                                        type="number"
                                        min="0"
                                        value={
                                          size.stock ??
                                          ""
                                        }
                                        onChange={e =>
                                          updateDressSize(
                                            colourIndex,
                                            sizeIndex,
                                            "stock",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>

                                    <td>
                                      <button
                                        type="button"
                                        className="btn-small btn-red"
                                        onClick={() =>
                                          removeSize(
                                            colourIndex,
                                            sizeIndex
                                          )
                                        }
                                      >
                                        ×
                                      </button>
                                    </td>

                                  </tr>
                                )
                              )}

                          </tbody>

                        </table>

                      </div>

                      <div className="add-size-row">

                        <button
                          type="button"
                          className="btn-small btn-outline"
                          onClick={() =>
                            addSize(
                              colourIndex
                            )
                          }
                        >
                          + Add Size
                        </button>

                      </div>
                    </>

                  ) : (

                    <div className="saree-variant-row">

                      <div className="variant-field">
                        <label>Colour</label>
                        <input
                          value={
                            variant.colour ||
                            ""
                          }
                          onChange={e =>
                            updateColourName(
                              colourIndex,
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>Price ₹</label>
                        <input
                          type="number"
                          min="0"
                          value={
                            variant.price ??
                            ""
                          }
                          onChange={e =>
                            updateSareeVariant(
                              colourIndex,
                              "price",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>MRP ₹</label>
                        <input
                          type="number"
                          min="0"
                          value={
                            variant.oldPrice ??
                            ""
                          }
                          onChange={e =>
                            updateSareeVariant(
                              colourIndex,
                              "oldPrice",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>Discount %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            variant.discount ??
                            0
                          }
                          onChange={e =>
                            updateSareeVariant(
                              colourIndex,
                              "discount",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="variant-field">
                        <label>Stock</label>
                        <input
                          type="number"
                          min="0"
                          value={
                            variant.stock ??
                            ""
                          }
                          onChange={e =>
                            updateSareeVariant(
                              colourIndex,
                              "stock",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <button
                        type="button"
                        className="btn-small btn-red"
                        onClick={() =>
                          removeColour(
                            colourIndex
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>
                  )}

                </div>
              </div>
            )
          )}

          <button
            type="button"
            className="add-colour-button"
            onClick={addColour}
          >
            + Add Another Colour
          </button>

        </div>
      );
    };

  // ============================================================
  // BULK MODAL
  // ============================================================

  // ============================================================
// BULK MODAL
// ============================================================
const renderBulkModal = () => {

  if (!isBulkModalOpen) {
    return null;
  }

  const isCSV = bulkUploadType === "csv";

  const uploadTitle = isCSV
    ? "📄 Bulk CSV Product Import"
    : "📊 Bulk Excel Product Import";

  const fileTypeName = isCSV
    ? "CSV"
    : "Excel";

  const acceptTypes = isCSV
    ? ".csv,text/csv"
    : ".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel";

  const uploadIcon = isCSV ? "📄" : "📊";

  const fileOnlyText = isCSV
    ? "CSV files only"
    : "Excel files (.xlsx, .xls) only";


  return (

    <div
      className="modal-overlay"
      onClick={() =>
        !bulkUploading &&
        setBulkModalOpen(false)
      }
    >

      <div
        className="modal-content bulk-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="bulk-modal-header">

          <div>

            <h2 className="bulk-modal-title">
              {uploadTitle}
            </h2>

            <p className="bulk-modal-subtitle">
              Import multiple products quickly using a {fileTypeName} file.
            </p>

          </div>


          <button
            type="button"
            className="bulk-close-btn"
            disabled={bulkUploading}
            onClick={() =>
              setBulkModalOpen(false)
            }
          >
            ×
          </button>

        </div>


        {/* ================================================= */}
        {/* UPLOAD AREA */}
        {/* ================================================= */}

        <div className="bulk-upload-wrapper">

          <label
            className={`bulk-upload-area ${
              bulkFileName
                ? "bulk-upload-selected"
                : ""
            }`}
          >

            <input
              ref={bulkFileRef}
              type="file"
              accept={acceptTypes}
              onChange={handleBulkFile}
              disabled={bulkUploading}
            />


            {/* ICON */}

            <div className="bulk-upload-icon">
              {uploadIcon}
            </div>


            {/* MAIN TEXT */}

            <div className="bulk-upload-main-text">

              {bulkFileName
                ? bulkFileName
                : `Choose ${fileTypeName} File`
              }

            </div>


            {/* SECONDARY TEXT */}

            <div className="bulk-upload-sub-text">

              {bulkFileName
                ? "File selected successfully"
                : "Click here to browse your computer"
              }

            </div>


            {/* FILE TYPE */}

            <div className="bulk-upload-format">

              {fileOnlyText}

            </div>

          </label>

        </div>


        {/* ================================================= */}
        {/* SELECTED FILE */}
        {/* ================================================= */}

        {bulkFileName && (

          <div className="bulk-selected-file">

            <div className="bulk-selected-left">

              <div className="bulk-selected-icon">
                {uploadIcon}
              </div>

              <div>

                <div className="bulk-selected-name">
                  {bulkFileName}
                </div>

                <div className="bulk-selected-status">
                  Ready to import
                </div>

              </div>

            </div>


            {!bulkUploading && (

              <button
                type="button"
                className="bulk-remove-file"
                onClick={() => {

                  setBulkRows([]);
                  setBulkFileName("");
                  setBulkErrors([]);
                  setBulkResult("");
                  setBulkProgress(0);

                  if (bulkFileRef.current) {
                    bulkFileRef.current.value = "";
                  }

                }}
              >
                Remove
              </button>

            )}

          </div>

        )}


        {/* ================================================= */}
        {/* PREVIEW */}
        {/* ================================================= */}

        {bulkRows.length > 0 && (

          <div className="bulk-preview-section">

            <div className="bulk-preview-header">

              <div>

                <div className="bulk-preview-title">
                  Product Preview
                </div>

                <div className="bulk-preview-count">
                  {bulkRows.length} {fileTypeName} rows detected
                </div>

              </div>

              <div className="bulk-preview-badge">
                {bulkRows.length} Rows
              </div>

            </div>


            <div className="bulk-preview">

              <table>

                <thead>

                  <tr>

                    {Object.keys(
                      bulkRows[0]
                    ).map((header) => (

                      <th key={header}>
                        {header}
                      </th>

                    ))}

                  </tr>

                </thead>


                <tbody>

                  {bulkRows
                    .slice(0, 10)
                    .map((row, index) => (

                      <tr key={index}>

                        {Object.keys(
                          bulkRows[0]
                        ).map((header) => (

                          <td key={header}>

                            {String(
                              row[header] ?? ""
                            )}

                          </td>

                        ))}

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>


            {bulkRows.length > 10 && (

              <div className="bulk-preview-note">

                Showing the first 10 rows only.

              </div>

            )}

          </div>

        )}


        {/* ================================================= */}
        {/* PROGRESS */}
        {/* ================================================= */}

        {bulkUploading && (

          <div className="bulk-progress-section">

            <div className="bulk-progress-header">

              <span>
                Uploading products...
              </span>

              <strong>
                {bulkProgress}%
              </strong>

            </div>


            <div className="bulk-progress">

              <div
                className="bulk-progress-bar"
                style={{
                  width: `${bulkProgress}%`
                }}
              />

            </div>

          </div>

        )}


        {/* ================================================= */}
        {/* SUCCESS */}
        {/* ================================================= */}

        {bulkResult && (

          <div className="bulk-result">

            <span className="bulk-result-icon">
              ✓
            </span>

            <span>
              {bulkResult}
            </span>

          </div>

        )}


        {/* ================================================= */}
        {/* ERRORS */}
        {/* ================================================= */}

        {bulkErrors.length > 0 && (

          <div className="bulk-error">

            <div className="bulk-error-title">
              ⚠ Upload Errors
            </div>


            <ul>

              {bulkErrors.map(
                (error, index) => (

                  <li key={index}>
                    {error}
                  </li>

                )
              )}

            </ul>

          </div>

        )}


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

        <div className="bulk-modal-footer">

          <button
            type="button"
            className="bulk-cancel-btn"
            disabled={bulkUploading}
            onClick={() =>
              setBulkModalOpen(false)
            }
          >
            Cancel
          </button>


          <button
            type="button"
            className="bulk-import-btn"
            disabled={
              bulkUploading ||
              !bulkRows.length
            }
            onClick={
              handleBulkUpload
            }
          >

            {bulkUploading

              ? `Uploading ${bulkProgress}%...`

              : `🚀 Import ${
                  buildBulkProducts(
                    bulkRows
                  ).length
                } Products`

            }

          </button>

        </div>

      </div>

    </div>

  );
};  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="admin-container">

      <style>
        {adminStyles}
      </style>

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="admin-header">

        <div>

          <h1>
            Inventory Management
          </h1>

          <p>
            Manage products, colours,
            images, sizes, prices and stock.
          </p>

        </div>

<div className="header-buttons">

  {/* BULK CSV UPLOAD */}

  <button
    className="btn-bulk"
    onClick={() =>
      resetBulkUpload("csv")
    }
  >
    📄 Bulk CSV Upload
  </button>


  {/* BULK EXCEL UPLOAD */}

  <button
    className="btn-bulk"
    onClick={() =>
      resetBulkUpload("excel")
    }
  >
    📊 Bulk Excel Upload
  </button>


  {/* ADD PRODUCT */}

  <button
    className="btn-add"
    onClick={() =>
      handleOpenModal()
    }
  >
    + Add New Product
  </button>

</div>

      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {errorMessage && (

        <div
          style={{
            background:
              "#fff0f0",
            border:
              "1px solid #ffcaca",
            color:
              "#b42318",
            padding:
              "12px 14px",
            borderRadius:
              "8px",
            marginBottom:
              "16px"
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* ========================================================
          DESKTOP
      ======================================================== */}

      <div className="table-wrapper">

        <table>

          <thead>

            <tr>

              <th>
                Main Image
              </th>

              <th>
                Thumbnails
              </th>

              <th>
                Product
              </th>

              <th>
                Category
              </th>

              <th>
                Sub-Category
              </th>

              <th>
                Type
              </th>

              <th>
                Colour / Size / Price
              </th>

              <th>
                Total Stock
              </th>

              <th>
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan="9"
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "40px",
                    color:
                      "#777"
                  }}
                >
                  No products found.
                </td>

              </tr>

            ) : (

              products.map(
                p => (

                  <tr
                    key={
                      p.id
                    }
                  >

                    <td>

                      <img
                        src={
                          p.img_url ||
                          p.thumbnails?.[0] ||
                          ""
                        }
                        className="prod-img-mini"
                        alt={
                          p.name
                        }
                      />

                    </td>

                    <td>

                      <div className="thumbnail-container">

                        {(
                          p.thumbnails ||
                          []
                        ).map(
                          (
                            t,
                            i
                          ) => (

                            <img
                              key={
                                i
                              }
                              src={
                                t
                              }
                              className="prod-img-mini"
                              alt=""
                            />
                          )
                        )}

                      </div>

                    </td>

                    <td>

                      <div
                        style={{
                          fontWeight:
                            600
                        }}
                      >
                        {p.name}
                      </div>

                      <div
                        style={{
                          fontSize:
                            "0.75rem",
                          color:
                            "#999"
                        }}
                      >
                        ID: #{p.id}
                      </div>

                    </td>

                    <td>

                      <span className="status-badge">
                        {p.category}
                      </span>

                    </td>

                    <td>

                      <span
                        className="status-badge"
                        style={{
                          background:
                            "#f3e5f5",
                          color:
                            "#7b1fa2"
                        }}
                      >
                        {p.sub_category ||
                          p.subCategory ||
                          "-"}
                      </span>

                    </td>

                    <td>

                      <span
                        className="status-badge"
                        style={{
                          background:
                            "#fff3e0",
                          color:
                            "#e65100"
                        }}
                      >
                        {p.type ||
                          "Regular"}
                      </span>

                    </td>

                    <td>
                      {renderVariantSummary(
                        p
                      )}
                    </td>

                    <td>

                      <strong>
                        {getTotalVariantStock(
                          p
                        )}
                      </strong>{" "}
                      pcs

                    </td>

                    <td>

                      <div className="action-btns">

                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleOpenModal(
                              p
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="btn-delete"
                          onClick={() =>
                            handleDelete(
                              p.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

      {/* ========================================================
          MOBILE
      ======================================================== */}

      <div className="mobile-card-container">

        {products.map(
          p => (

            <div
              className="product-card"
              key={
                p.id
              }
            >

              <div className="card-top">

                <img
                  src={
                    p.img_url ||
                    p.thumbnails?.[0] ||
                    ""
                  }
                  className="card-main-img"
                  alt={
                    p.name
                  }
                />

                <div className="card-info">

                  <div
                    style={{
                      fontSize:
                        "0.7rem",
                      color:
                        "#999"
                    }}
                  >
                    ID: #{p.id}
                  </div>

                  <div
                    style={{
                      fontWeight:
                        700,
                      fontSize:
                        "0.95rem",
                      margin:
                        "5px 0"
                    }}
                  >
                    {p.name}
                  </div>

                  <span className="status-badge">
                    {p.category}
                  </span>

                </div>

              </div>

              <div className="card-grid">

                <div className="card-field">
                  <label>
                    Sub-Category
                  </label>
                  <span>
                    {p.sub_category ||
                      p.subCategory ||
                      "-"}
                  </span>
                </div>

                <div className="card-field">
                  <label>
                    Type
                  </label>
                  <span>
                    {p.type ||
                      "Regular"}
                  </span>
                </div>

                <div className="card-field">
                  <label>
                    Colours
                  </label>
                  <span>
                    {
                      normalizeVariants(
                        p
                      ).length
                    }
                  </span>
                </div>

                <div className="card-field">
                  <label>
                    Total Stock
                  </label>
                  <span>
                    {getTotalVariantStock(
                      p
                    )}{" "}
                    pcs
                  </span>
                </div>

              </div>

              <div
                style={{
                  marginBottom:
                    "12px"
                }}
              >
                {renderVariantSummary(
                  p
                )}
              </div>

              <div className="card-actions">

                <button
                  className="btn-edit"
                  onClick={() =>
                    handleOpenModal(
                      p
                    )
                  }
                >
                  Edit
                </button>

                <button
                  className="btn-delete"
                  onClick={() =>
                    handleDelete(
                      p.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          )
        )}

      </div>

      {/* ========================================================
          BULK MODAL
      ======================================================== */}

      {renderBulkModal()}

      {/* ========================================================
          NORMAL PRODUCT MODAL
      ======================================================== */}

      {isModalOpen && (

        <div
          className="modal-overlay"
          onClick={() =>
            !saving &&
            setModalOpen(false)
          }
        >

          <div
            className="modal-content"
            onClick={e =>
              e.stopPropagation()
            }
          >

            <h2
              style={{
                marginTop: 0,
                color:
                  "var(--primary-green)"
              }}
            >
              {currentProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <form
              onSubmit={
                handleSave
              }
            >

              {/* NAME */}

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  required
                  value={
                    formData.name
                  }
                  onChange={e =>
                    setFormData(
                      prev => ({
                        ...prev,
                        name:
                          e.target.value
                      })
                    )
                  }
                  placeholder="Designer Kanchipuram Silk Saree"
                />

              </div>

              {/* CATEGORY */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  value={
                    formData.cat
                  }
                  onChange={e =>
                    handleCategoryChange(
                      e.target.value
                    )
                  }
                >

                  {Object.keys(
                    subCategoriesMap
                  ).map(
                    cat => (

                      <option
                        key={
                          cat
                        }
                        value={
                          cat
                        }
                      >
                        {cat}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* SUB CATEGORY */}

              <div className="form-group">

                <label>
                  Sub-Category
                </label>

                <select
                  value={
                    formData.subCat
                  }
                  onChange={e =>
                    setFormData(
                      prev => ({
                        ...prev,
                        subCat:
                          e.target.value
                      })
                    )
                  }
                >

                  <option value="">
                    Select Sub-Category
                  </option>

                  {(
                    subCategoriesMap[
                      formData.cat
                    ] || []
                  ).map(
                    sub => (

                      <option
                        key={
                          sub
                        }
                        value={
                          sub
                        }
                      >
                        {sub}
                      </option>

                    )
                  )}

                </select>

              </div>

              {/* TYPE */}

              <div className="form-group">

                <label>
                  Product Type
                </label>

                <select
                  value={
                    formData.type
                  }
                  onChange={e =>
                    setFormData(
                      prev => ({
                        ...prev,
                        type:
                          e.target.value
                      })
                    )
                  }
                >

                  <option>
                    New Arrival
                  </option>

                  <option>
                    Best Seller
                  </option>

                  <option>
                    Regular
                  </option>

                </select>

              </div>

              {/* VARIANTS */}

              {renderVariantBuilder()}

              {/* PRODUCT IMAGE */}

              <div
                className="form-group"
                style={{
                  marginTop:
                    20
                }}
              >

                <label>
                  Product Main Image
                  {" "}
                  <span
                    style={{
                      fontWeight:
                        400,
                      color:
                        "#888"
                    }}
                  >
                    optional
                  </span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={e =>
                    handleImageChange(
                      e,
                      "img"
                    )
                  }
                />

                {formData.img && (

                  <img
                    src={
                      formData.img
                    }
                    className="image-preview"
                    style={{
                      marginTop:
                        8
                    }}
                    alt=""
                  />

                )}

              </div>

              {/* THUMBNAILS */}

              <div className="form-group">

                <label>
                  Product Thumbnail Images
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e =>
                    handleImageChange(
                      e,
                      "thumbnails"
                    )
                  }
                />

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  disabled={
                    saving
                  }
                  onClick={() =>
                    setModalOpen(
                      false
                    )
                  }
                  style={{
                    border:
                      "none",
                    background:
                      "none",
                    cursor:
                      "pointer",
                    fontWeight:
                      600,
                    color:
                      "var(--text-muted)"
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-add"
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Saving..."
                    : currentProduct
                    ? "Update Product"
                    : "Save Product"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}