# WeLove 微爱 - AI聊天应用

> 新一代AI社交平台，智能AI角色陪伴系统

## 项目结构

```
welove-app/
├── admin/           # 管理后台 (React + Ant Design Pro)
├── android/         # Android原生应用 (Kotlin)
├── web/             # Web前端 (React 19 + TypeScript)
├── server/          # 后端API服务 (Express + tRPC)
├── docs/            # 项目文档
└── shared/          # 共享资源
```

## 技术栈

| 模块 | 技术 |
|------|------|
| 管理后台 | React 18 + Ant Design Pro + TypeScript |
| Web前端 | React 19 + TypeScript + Tailwind CSS + shadcn/ui |
| Android | Kotlin + Jetpack Compose + Material 3 |
| 后端 | Express + tRPC + Drizzle ORM + MySQL |

## 快速开始

### 管理后台

```bash
cd admin
npm install
npm run dev
```

### Android应用

使用 Android Studio 打开 `android/` 目录

### Web前端

```bash
cd web
npm install
npm run dev
```

### 后端服务

```bash
cd server
npm install
npm run dev
```

## 文档

- [PRD产品需求文档](docs/PRD.md)
- [用户故事](docs/USER_STORIES.md)

## 版本

- v2.0.0 - 项目重构版本

---

**WeLove Team** | 2026
