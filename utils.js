/*
 * js/utils.js —— 工具函数
 * 视图层拼 HTML 字符串时统一走 escapeHtml，避免用户输入把页面结构撑坏。
 */

// HTML 转义：用户自己填写的名称/地点/描述都要过一遍
function escapeHtml(value) {
  return String(value === undefined || value === null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 把 datetime-local 的值（2026-09-26T09:20）转成展示用的文案（09-26 09:20）
function formatFullTime(value) {
  if (!value) return '';
  var text = String(value).replace('T', ' ');
  return text.length >= 16 ? text.slice(5, 16) : text;
}

// 没有 views 字段时显示占位符，避免出现 "浏览 undefined"
function formatViews(views) {
  return (views === undefined || views === null) ? '—' : views;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    escapeHtml: escapeHtml,
    formatFullTime: formatFullTime,
    formatViews: formatViews
  };
}