# 数据库设置说明

## 本地数据库配置 (xbtech19)

本项目使用独立的本地数据库来管理以下数据：

### 数据库信息
- **数据库名**: `xbtech19`
- **用户名**: `xbtech19`
- **密码**: `VugpICWuRg7xVIzhpvid`
- **主机**: `45.32.122.230`
- **端口**: `3306`

### 数据库表结构

#### 1. `admin_users` - 管理员用户表
用于存储后台管理员账户信息。

**字段**:
- `id` - 主键
- `username` - 用户名（唯一）
- `password` - 密码（bcrypt加密）
- `created_at` - 创建时间
- `updated_at` - 更新时间

**默认账户**:
- 用户名: `admin`
- 密码: `admin123`
- ⚠️ **首次登录后请立即修改密码！**

#### 2. `announcements` - 公告表（本地管理）
用于管理网站公告和通知。

**字段**:
- `id` - 主键
- `title` - 标题
- `content` - 内容
- `category` - 分类
- `image` - 图片URL
- `is_important` - 是否重要
- `created_at` - 创建时间
- `updated_at` - 更新时间

#### 3. `site_settings` - 站点设置表（本地覆盖）
用于存储本地覆盖的设置，优先级高于外部数据库设置。

**字段**:
- `id` - 主键
- `key` - 设置键（唯一）
- `value` - 设置值（JSON格式）
- `created_at` - 创建时间
- `updated_at` - 更新时间

### 初始化数据库

#### 方法 1: 使用 Node.js 脚本（推荐）

```bash
node scripts/init-local-database.js
```

#### 方法 2: 使用 SQL 文件

```bash
mysql -h 45.32.122.230 -u xbtech19 -p xbtech19 < scripts/init-local-database.sql
```

### 环境变量配置

在 `.env.local` 文件中添加以下配置：

```bash
# Local Database (xbtech19)
DB_USER_LOCAL=xbtech19
DB_PASSWORD_LOCAL=VugpICWuRg7xVIzhpvid
DB_NAME_LOCAL=xbtech19
DB_HOST=45.32.122.230
DB_PORT=3306
```

### 数据管理说明

#### 本地管理的数据（可编辑）
- ✅ **Announcements** - 公告管理
- ✅ **Settings** - 站点设置（本地覆盖）

#### 只读数据（从外部数据库读取）
- 📖 **Brands** - 品牌信息（从 wildgroup 和 88group 数据库读取）
- 📖 **Bonuses & Promotions** - 奖金和促销（从 wildgroup 和 88group 数据库读取）
- 📖 **Testimonials** - 客户评价（从 88group 数据库读取）

### 数据库连接问题

如果遇到连接问题，请检查：

1. **数据库用户权限**
   ```sql
   GRANT ALL PRIVILEGES ON xbtech19.* TO 'xbtech19'@'%' IDENTIFIED BY 'VugpICWuRg7xVIzhpvid';
   FLUSH PRIVILEGES;
   ```

2. **数据库是否存在**
   ```sql
   CREATE DATABASE IF NOT EXISTS xbtech19 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **防火墙设置** - 确保端口 3306 已开放

### 注意事项

- ⚠️ 本地数据库只管理本地数据，不会影响外部数据库
- ⚠️ Settings 表中的设置会覆盖外部数据库的设置
- ⚠️ 默认管理员密码请及时修改
- ⚠️ 定期备份数据库数据
