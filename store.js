/*
 * js/store.js —— 数据层核心
 * 把对"物品信息"的增删改查全部封装在这里，页面不直接碰 localStorage。
 * 5 个页面共享同一份数据（key: campus_lost_found_items），闭环由此成立。
 */

var STORE_KEY = 'campus_lost_found_items';
var VIEW_KEY = 'campus_lost_found_viewed_';

// 读取全部数据
function getAll() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch (e) {
    return [];   // 数据被手动改坏时降级为空数组，避免页面白屏
  }
}

// 保存全部数据
function saveAll(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

// 生成唯一编号，如 LF20261010001
// 只统计"当天已有数据条数 +1"，跨天时流水号重新从 001 开始
function genNo() {
  var d = new Date();
  var ymd = d.getFullYear()
          + String(d.getMonth() + 1).padStart(2, '0')
          + String(d.getDate()).padStart(2, '0');
  var todayCount = getAll().filter(function(it) {
    return it.no && it.no.indexOf('LF' + ymd) === 0;
  }).length;
  return 'LF' + ymd + String(todayCount + 1).padStart(3, '0');
}

// 新增一条
function addItem(item) {
  var list = getAll();
  var record = Object.assign({
    id: Date.now(),
    no: genNo(),
    status: item.type === 'lost' ? '寻找中' : '待认领',   // 进行中
    createTime: new Date().toISOString(),
    views: 0
  }, item);
  list.unshift(record);   // 最新发布排最前
  saveAll(list);
  return record;
}

// 按 id 查询（URL 里取出来的是字符串，数据里存的是数字，统一转成字符串比较）
function getById(id) {
  return getAll().find(function(it) {
    return String(it.id) === String(id);
  }) || null;
}

// 更新状态：寻物→已找回，招领→已归还
function markItemDone(id) {
  var list = getAll();
  var target = list.find(function(it) {
    return String(it.id) === String(id);
  });
  if (!target) return false;
  target.status = target.type === 'lost' ? '已找回' : '已归还';
  target.doneTime = new Date().toISOString();
  saveAll(list);
  return true;
}

// 搜索：关键词模糊匹配 名称/地点/描述 + 类型过滤
function search(keyword, type) {
  var kw = (keyword || '').trim().toLowerCase();
  return getAll().filter(function(it) {
    var typeOk = !type || type === 'all' || it.type === type;
    var text = ((it.title || '') + (it.place || '') + (it.desc || '')).toLowerCase();
    var kwOk = !kw || text.indexOf(kw) !== -1;
    return typeOk && kwOk;
  });
}

// 删除一条（附加功能，当前页面未使用，保留接口便于扩展）
function removeItem(id) {
  var list = getAll();
  var next = list.filter(function(it) {
    return String(it.id) !== String(id);
  });
  if (next.length === list.length) return false;
  saveAll(next);
  return true;
}

// 浏览计数（附加特点）：同一条信息在每个标签页会话里只计一次，避免刷新刷计数
function incrementViews(id) {
  var sid = String(id);
  if (sessionStorage.getItem(VIEW_KEY + sid)) {
    return getById(sid);   // 本次会话已计过，直接返回当前数据
  }
  var list = getAll();
  var target = list.find(function(it) {
    return String(it.id) === sid;
  });
  if (!target) return null;
  target.views = (target.views || 0) + 1;
  saveAll(list);
  sessionStorage.setItem(VIEW_KEY + sid, '1');
  return target;
}

// 首次访问时注入种子数据
function initSeed(seedList) {
  if (!localStorage.getItem(STORE_KEY)) {
    saveAll(seedList);
  }
}

// Node 环境下（Jest 单元测试）兼容导出；浏览器里这些函数是全局的
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAll: getAll,
    saveAll: saveAll,
    genNo: genNo,
    addItem: addItem,
    getById: getById,
    markDone: markItemDone,
    search: search,
    removeItem: removeItem,
    incrementViews: incrementViews,
    initSeed: initSeed
  };
}

// 浏览器里同时挂到 window 上，方便页面脚本按名字直接调用
if (typeof window !== 'undefined') {
  window.markDone = markItemDone;
}