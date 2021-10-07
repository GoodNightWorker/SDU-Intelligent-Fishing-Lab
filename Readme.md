# SDU智慧摸鱼实验室

SDU物联网应用系统设计实验课题，智慧实验室的项目前端部分

### 项目构建

```
npm init
npm i wx-promise-pro -S
npm i wx-updata -S
```

在微信开发工具中选择`工具-构建npm`，成功输出`miniprogram_npm`文件即可

### 项目开发

本项目使用 [vscode](https://code.visualstudio.com/) 进行快速开发

建议配合插件`Easy Sass`及`WXML - Language Services`以替代原生开发工具，微信原生开发工具仅作为调试器使用

必须使用通过 [Pull requests](https://github.com/GoodNightWorker/SDU-Intelligent-Fishing-Lab/pulls) 才可以提交合并请求

### 项目背景

当前实验室存在进出管理困难，实验室人员、器材等安全检测不全面等问题

本项目目的在提供方便高效的人脸识别门禁系统，通过小程序对实验室成员，临时人员等进行快速注册绑定，增强实验室的进出管理便利性

同时硬件端采用`modbus`实现区域组件智联，通过小程序呈现出组联设备的检测数据，包括温湿度，火灾预警，人员活动等，便于检测实验室状况，及时排除隐患

### 项目UI设计

采取 [Figma](https://www.figma.com/) 进行UI设计，本程序的UI设计请访问

[SDU智慧摸鱼实验室 UI](https://www.figma.com/file/go9aRpvNI2xqIDIpq7dG36/智能安全?node-id=0%3A1)

### 主要文件结构

``` 
│  app.js
│  app.json                     
│  app.wxss                     
│  README.md
│  
├─components                    // 组件集
│  ├─components                 // 组件命名统一使用 index.*
│  └─components 1
│          
├─pages                         // 页面集
│  ├─index
│  └─more
│          
├─styles                        // 样式文件
├─images                        // 图标
├─templates                     // 项目模板
├─miniprogram_npm               // npm 构建文件
│
└─utils                         // 辅助模块
```

### 参考

项目结构参考 [weapp-library](https://github.com/imageslr/weapp-library)

微信小程序异步库 [wx-promise-pro](https://github.com/youngjuning/wx-promise-pro)

setData 替代品 [wx-updata](https://github.com/SHERlocked93/wx-updata)

### 代码规范

遵循 [JavaScript Standard Style](https://standardjs.com/rules-zhcn.html#javascript-standard-style)

采用 [Sass拓展语言](https://www.sass.hk/docs/)

### 声明

本作品仅作为课设使用，转载请遵循 `MIT License` 许可
