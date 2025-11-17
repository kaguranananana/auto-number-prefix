# Auto Number Prefix

一个在 Obsidian 中为新建文件或文件夹自动添加数字前缀的插件。相比原始标题，插件会根据同级已有编号查找最大值并生成下一个顺序号，例如 `1 任务`、`2 任务`。

> 本项目基于官方模板仓库 [obsidianmd/obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 开发，在其脚手架上实现了自动编号的特定功能。

## 功能简介

- 监听 vault 中的创建事件，为新文件或文件夹加上递增数字前缀。
- 支持识别已有诸如 `001 标题`、`12_标题` 的前缀，并在此基础上继续自增。
- 自动为新建文件夹进入重命名模式，方便继续编辑名称。

## 使用方法

### 安装

1. 在 GitHub 下载发布包或自行构建，确保获得 `main.js`、`manifest.json`（如有样式还需 `styles.css`）。
2. 将文件复制到你的库目录：`<Vault>/.obsidian/plugins/auto-number-prefix/`。
3. 打开 Obsidian，进入 **Settings → Community plugins**，启用该插件。

### 使用

- 在目标文件夹中新建文件或文件夹，插件会检查同级条目，自动在名称前增加下一个数字前缀。
- 如需修改起始编号，可手动调整已有文件名称；插件会从最大编号继续增长。

## 开发与构建

1. 克隆仓库并安装依赖：`npm install`
2. 开发阶段使用 `npm run dev` 进入 watch 模式，或在每次修改后运行 `npm run build` 生成最新 `main.js`。
3. 完成改动后，重载 Obsidian 或重新启用插件以应用新构建。

## 致谢

- 感谢 Obsidian 官方模板仓库 [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) 提供脚手架与构建配置。
