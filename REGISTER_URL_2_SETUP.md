# Register URL 2 功能设置说明

## 概述

本项目新增了 `registerUrl_2` 字段来管理品牌注册链接，与原有的 `register_url` 字段分离。现在 "Register Now" 按钮会优先使用 `registerUrl_2`，如果不存在则回退到 `register_url`。

## 数据库设置

### 方法 1: 使用 Node.js 脚本（推荐）

运行以下命令自动为两个数据库添加 `registerUrl_2` 字段：

```bash
node scripts/add-registerUrl_2.js
```

这个脚本会：
- 连接到 WildGroup 数据库 (xbtech14)
- 连接到 88Group 数据库 (xbtech17)
- 检查字段是否已存在
- 如果不存在，则添加 `registerUrl_2 VARCHAR(500) NULL` 字段

### 方法 2: 手动执行 SQL

分别连接到两个数据库并执行：

**WildGroup 数据库 (xbtech14):**
```sql
ALTER TABLE brands ADD COLUMN registerUrl_2 VARCHAR(500) NULL AFTER register_url;
```

**88Group 数据库 (xbtech17):**
```sql
ALTER TABLE brands ADD COLUMN registerUrl_2 VARCHAR(500) NULL AFTER register_url;
```

## 代码更改

### 1. BrandCard 组件
- 文件: `app/components/BrandCard.tsx`
- 更改: 优先使用 `registerUrl_2`，如果不存在则使用 `register_url` 或 `registerUrl`

### 2. 品牌管理 API
- 文件: `app/api/admin/brands/route.ts`
- 功能:
  - `GET`: 获取所有品牌的 `registerUrl_2` 信息
  - `PUT`: 更新指定品牌的 `registerUrl_2`

### 3. 品牌管理后台页面
- 文件: `app/admin/brands/page.tsx`
- 功能: 提供完整的 CRUD 界面来管理所有品牌的 `registerUrl_2`

## 后台管理

### 访问品牌管理页面

1. 登录后台管理系统: `/admin/login`
2. 在侧边栏点击 "Brands" 或从 Dashboard 点击 "Brands" 卡片
3. 页面会显示两个分组：
   - **WildGroup Brands**: 来自 xbtech14 数据库的品牌
   - **88Group Brands**: 来自 xbtech17 数据库的品牌

### 管理 Register URL

1. 找到要编辑的品牌
2. 点击 "Edit" 按钮
3. 输入新的 Register URL（或留空以清除）
4. 点击 "Save" 保存更改
5. 点击 "Cancel" 取消编辑

### 功能特点

- ✅ 分别管理两个数据库的品牌
- ✅ 实时更新，无需刷新页面
- ✅ 支持清空 URL（设置为 null）
- ✅ 显示当前设置的 URL（可点击查看）
- ✅ 响应式设计，支持移动设备

## API 使用

### 获取所有品牌

```bash
GET /api/admin/brands
Authorization: Bearer <admin_token>
```

响应示例:
```json
[
  {
    "id": 1,
    "key": "brand1",
    "name": "Brand Name",
    "registerUrl_2": "https://example.com/register",
    "source": "wildgroup"
  }
]
```

### 更新品牌 Register URL

```bash
PUT /api/admin/brands
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "id": 1,
  "source": "wildgroup",
  "registerUrl_2": "https://new-url.com/register"
}
```

## 注意事项

1. ⚠️ `registerUrl_2` 字段是可选的（NULL），如果未设置，系统会回退到 `register_url`
2. ⚠️ 原有的 `register_url` 字段不会被修改，只是不再优先使用
3. ⚠️ 确保在执行数据库迁移前备份数据库
4. ⚠️ 如果字段已存在，脚本会跳过，不会报错

## 故障排除

### 字段已存在错误

如果看到 "Column already exists" 错误，说明字段已经添加，可以安全忽略。

### 无法连接到数据库

检查 `.env.local` 文件中的数据库配置：
- `WG_DB_HOST`, `WG_DB_USER`, `WG_DB_PASSWORD`, `WG_DB_NAME` (WildGroup)
- `G88_DB_HOST`, `G88_DB_USER`, `G88_DB_PASSWORD`, `G88_DB_NAME` (88Group)

### 后台页面无法加载品牌

1. 检查是否已登录
2. 检查浏览器控制台是否有错误
3. 检查 API 端点 `/api/admin/brands` 是否正常响应
