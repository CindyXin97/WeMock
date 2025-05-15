# WeMock 模拟服务

WeMock 模拟服务是一个用于在开发环境中模拟后端 API 的工具，它允许前端开发在没有真实后端服务的情况下进行开发和测试。

## 功能特点

- 模拟 Prisma 客户端接口，无需修改现有代码
- 提供预设的模拟数据，包括用户、面试、匹配等
- 通过中间件拦截 API 请求，无需修改前端代码
- 可以通过环境变量轻松开启或关闭

## 使用方法

### 启用模拟服务

默认情况下，模拟服务是启用的。如果需要禁用，可以在启动项目时设置环境变量：

```bash
# 禁用模拟服务
ENABLE_MOCK_API=false npm run dev

# 启用模拟服务（默认）
ENABLE_MOCK_API=true npm run dev
```

或者在 `.env` 文件中设置：

```
ENABLE_MOCK_API=true
```

### 模拟数据

模拟服务提供了以下预设数据：

1. **用户数据**：5 个测试用户，包含不同的角色、经验和技能
2. **面试数据**：3 个测试面试，包含不同的状态和类型
3. **匹配数据**：4 个测试匹配，包含不同的匹配分数和状态
4. **评价数据**：2 个测试评价

### 模拟 API 端点

当前支持以下 API 端点：

- `GET /api/matches` - 获取所有用户列表
- `GET /api/matching/list` - 获取当前用户的匹配列表
- `GET /api/interviews` - 获取当前用户的面试列表

### 自定义模拟数据

如果需要自定义模拟数据，可以修改 `lib/mock.ts` 文件中的 `mockUsers`、`mockInterviews`、`mockMatches` 和 `mockRatings` 数组。

### 添加新的模拟 API 端点

如果需要添加新的模拟 API 端点，可以在 `lib/mock-api.ts` 文件中的 `mockApiHandlers` 对象中添加新的处理函数：

```typescript
const mockApiHandlers: Record<string, ApiHandler> = {
  // 现有的处理函数...
  
  // 添加新的处理函数
  'GET /api/new-endpoint': async (request: Request) => {
    // 处理逻辑
    return NextResponse.json({ data: 'response data' });
  },
};
```

## 技术实现

WeMock 模拟服务由以下几个部分组成：

1. **模拟数据和 Prisma 客户端** (`lib/mock.ts`)：提供模拟数据和模拟 Prisma 客户端接口
2. **模拟 API 处理程序** (`lib/mock-api.ts`)：处理 API 请求并返回模拟数据
3. **中间件拦截** (`middleware.ts`)：拦截 API 请求并使用模拟 API 处理程序处理

## 注意事项

- 模拟服务仅适用于开发环境，不应在生产环境中使用
- 模拟数据仅供测试使用，不代表真实数据
- 当添加新的 API 端点时，需要同时在模拟服务中添加相应的处理函数 