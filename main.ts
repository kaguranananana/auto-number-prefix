import {
  App,
  Plugin,
  TAbstractFile,
  TFile,
  TFolder,
} from "obsidian";

// 形如 "001 标题"、"0001-标题"、"12_标题" 都视为已经带前缀
const PREFIX_RE = /^(\d+)[\s._-]+(.+)$/;

export default class AutoNumberPrefixPlugin extends Plugin {

  async onload() {
    console.log("Auto Number Prefix plugin loaded");

    // 监听新建文件 / 文件夹事件
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        this.handleCreate(file);
      })
    );
  }

  /**
   * 新建文件 / 文件夹时触发
   */
  private async handleCreate(file: TAbstractFile) {
    if (!(file instanceof TFile || file instanceof TFolder)) return;

    const parent = file.parent;
    if (!parent) return;

    if (this.isInAssetsPath(file)) return;

    const baseName = file instanceof TFile ? file.basename : file.name;
    const ext = file instanceof TFile ? file.extension : "";

    if (this.hasPrefix(baseName)) return;

    const siblings = parent.children ?? [];

    let maxNum = 0;

    for (const s of siblings) {
      if (s === file) continue;

      let sBaseName: string;
      if (s instanceof TFile) {
        sBaseName = s.basename;
      } else if (s instanceof TFolder) {
        sBaseName = s.name;
      } else {
        continue;
      }

      const n = this.parsePrefix(sBaseName);
      if (n === null) continue;

      if (n > maxNum) {
        maxNum = n;
      }
    }

    const next = maxNum + 1;
    const prefix = next.toString();
    const sep = " ";

    const newBaseName = `${prefix}${sep}${baseName}`;
    const newName = ext ? `${newBaseName}.${ext}` : newBaseName;

    const parentPath = parent.path;
    let newPath: string;
    if (parentPath === "/" || parentPath === "") {
      newPath = newName;
    } else {
      newPath = `${parentPath}/${newName}`;
    }

    try {
      await this.app.fileManager.renameFile(file as any, newPath);

      // 只对“文件夹”做：让它进入重命名状态，光标落在名字上
      if (file instanceof TFolder) {
        this.startInlineRename(newPath);
      }

    } catch (e) {
      console.error("Auto Number Prefix: rename failed", e);
    }
  }

  /**
   * Skip numbering for files/folders that live under an assets directory.
   * This avoids renaming attachment folders like ./assets/${noteFileName}.
   */
  private isInAssetsPath(file: TAbstractFile): boolean {
    let current: TAbstractFile | null = file;
    while (current) {
      if (current instanceof TFolder && current.name === "assets") {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  /**
   * 判断名字是否已经带有数字前缀
   * 例如 "001 标题"、"001-标题" 等
   */
  private hasPrefix(name: string): boolean {
    return PREFIX_RE.test(name);
  }

  /**
   * 从名字中解析编号（兼容带前导零的旧前缀）
   */
  private parsePrefix(name: string): number | null {
    const m = name.match(PREFIX_RE);
    if (!m) return null;
    const numStr = m[1];
    const num = Number(numStr);
    if (Number.isNaN(num)) return null;
    return num;
  }


    private startInlineRename(path: string) {
    // 找到文件浏览器视图
    const leaves = this.app.workspace.getLeavesOfType("file-explorer");
    if (!leaves.length) return;

    const view: any = leaves[0].view;
    const fileExplorer = view;

    // fileExplorer.fileItems 是 path -> FileItem 的映射
    const item = fileExplorer.fileItems?.[path];
    if (!item) {
      // 视图可能还没刷新，稍微晚一点再试一次
      setTimeout(() => {
        const itemRetry = fileExplorer.fileItems?.[path];
        if (!itemRetry) return;
        fileExplorer.setSelection(itemRetry);
        fileExplorer.startRename(itemRetry);
      }, 100);
      return;
    }

    // 选中 + 进入重命名模式
    fileExplorer.setSelection(item);
    fileExplorer.startRename(item);
  }

}


