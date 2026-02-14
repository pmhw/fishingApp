-- ============================================
-- 统一导入文件
-- ============================================
-- 创建时间: 2026-02-08
-- 说明: 一次性导入所有表结构
-- 使用方法: source import_all.sql;
-- ============================================

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 导入轮播图表
SOURCE banner.sql;

-- 导入排行榜关联表
SOURCE banner_ranking.sql;

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 显示导入结果
SHOW TABLES;
