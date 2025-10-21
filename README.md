# PKU-CSports Backend

## 文件结构
```
backend/
├── package.json    # 项目配置文件，定义了依赖和脚本
├── README.md       
└── src/            
    ├── index.html  # 应用的主 HTML 文件，是 UI 的基础
    ├── main.js     # Electron 主进程入口
    ├── preload.js  # 预加载脚本，安全地连接主进程和渲染器进程
    └── renderer.js # 渲染器进程脚本，负责处理页面 UI 和交互
```

