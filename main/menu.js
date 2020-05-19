// 设置窗口的菜单
// const isMac = process.platform === 'darwin'
const {dialog , ipcMain} = require('electron')
const template = [
    {
        role: 'fileMenu',
        label: '文件(F)',
        submenu: [
            {
                label: "新建",
                
            },
            {
                label: "新建窗口"
            },
            {
                label: "打开文件",
                click:(event, focusedWindow, focusedWebContents)=>{
                    dialog.showOpenDialog({
                        filters : [
                            {name:'markdown',extensions:['md','MD']}
                        ],
                        properties : ['openFile']
                    }).then(res => {
                        if(!res.canceled){
                            focusedWindow.webContents.send('openfile',res.filePaths[0]);
                        }
                    })
                }
            },
            {
                label: "打开文件夹"
            },
            {
                label: "保存"
            },
            {
                label: "另存为"
            },
            {
                label: "导出HTML"
            },
        ]
    },
    // { role: 'editMenu' }
    {
        role: 'editMenu',
        label: '编辑(E)',
        submenu: [
            {
                role: 'undo',
                label: '撤销'
            },
            {
                role: 'redo',
                label: '重做'
            },
            // { type: 'separator' },
            {
                role: 'cut',
                label: '剪切'
            },
            {
                role: 'copy',
                label: '复制'
            },
            {
                role: 'paste',
                label: '粘贴'
            },
            {
                role: 'selectAll',
                label: '全选'
            },
            {
                label: '选中当前行'
            },
            {
                label: '选中当前单词'
            },
            {
                label: '删除当前行'
            },
            {
                label: '删除当前单词'
            },
            {
                label: '查找与替换'
            }
        ]
    },
    {
        label: '段落(P)',
        submenu: [
            {
                label: '一级标题'
            },
            {
                label: '二级标题'
            },
            {
                label: '三级标题'
            },
            {
                label: '四级标题'
            },
            {
                label: '五级标题'
            },
            {
                label: '六级标题'
            },
            {
                label: '段落'
            },
            {
                label: '有序列表'
            },
            {
                label: '无序列表'
            },
            {
                label: '引用'
            },
            {
                label: '水平分割线'
            }
        ]
    },
    {
        label: '格式(O)',
        submenu: [
            {
                label: '加粗'
            },
            {
                label: '斜体'
            },
            {
                label: '下划线'
            },
            {
                label: '删除线'
            },
            {
                label: '代码样式'
            }
        ]
    },
    {
        label: '插入(I)',
        submenu: [
            {
                label: '插入表格'
            },
            {
                label: '插入代码块'
            },
            {
                label: '插入超链接'
            },
            {
                label: '插入图像'
            },
            {
                label: '插入目录'
            }
        ]
    },
    // {  }
    {
        role: 'viewMenu',
        label: '视图(V)',
        submenu: [
            {
                label: '显示预览区'
            },
            {
                label: '显示工作区'
            },
            {
                label: '显示侧边栏'
            },
            {
                label: '显示搜索区'
            },
            {
                label: '显示状态栏'
            },
            {
                label: '专注模式'
            },
            {
                role: 'toggleDevTools',
                label: '开发者工具'
            }
        ]
    },
    // { role: 'windowMenu' }
    {
        role: 'help',
        label: '帮助(H)',
        submenu: [
            // {
            //   label: '文档',
            //   click: async () => {
            //     const { shell } = require('electron')
            //     await shell.openExternal('https://electronjs.org')
            //   }
            // },
            {
                label: 'Markdown帮助文档'
            },
            {
                label: '编辑器使用文档'
            },
            {
                label: '个性化设置',
                click:(event, focusedWindow, focusedWebContents)=>{
                    focusedWindow.webContents.send('goSetting',"");
                }
            }
        ]
    }
]

module.exports = {
    template
}