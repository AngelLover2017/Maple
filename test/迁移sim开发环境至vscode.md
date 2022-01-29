

# 整体方案

要将simscript的开发环境从eclipse迁移到vscode，需要解决三个大方向的问题：

- 智能语言支持	
  - 语法高亮
  - 语言配置
  - 自动补全
  - 代码跳转
- 调试器支持（比如 debugger for Java）
- 项目脚手架 （命令行CLI工具 + 模板生成器generator）

如果完成这三项支持，基本上就可以再vscode里有很好的simscript开发体验了。





## 智能语言支持

智能语言支持的定位是提供更好的编辑体验，代码写起来很方便，但是它不提供语言本身的编译功能，编译还是靠simc编译器来完成。

### 语法高亮

语法高亮是靠 `tmLanguage.json` 的配置文件来发挥作用。原理是什么呢？这里有点像 HTML的文档结构 + CSS的选择器 来显示网页页面的原理。我们知道 通过CSS的各种选择器和选择规则，我们可以为HMTL文档的任意一个子结构加上样式。`tmLanguage.json` 的配置文件发挥作用的原理与此如出一辙，其实也可以理解，vscode是架构在Electron之上的，而Electron本身就是建构于chromium之上的，所以这样的方式很自然。

这里 `tmLanguage.json` 的配置语法继承了 TextMate 的语法规则，所以要想实现语法高亮，先得去看看 TextMate 的语法规则，然后映射到Json中去。（见附录）

TextMate中的pattern属性通过规则把 文档 构建成一颗tree型结构，并为相应结构命名，就像HTML文档那样，然后通过 Scope Selector 来匹配样式，为了便于理解，还得看看 Scope Selector的匹配规则，因为TextMate 和 Scope Selector 是相辅相成的，一个定义规则并命名，一个匹配名字给出样式。（见附录）

### 语言配置

语言配置是靠 `language-configuration.json` 的配置文件来发挥作用的。语言配置可以通过的功能都是一些相对简单的

- 代码注释
- 定义支持的括号类型
- 没有上下文的自动补全能力（例如多行注释的补全）
- 自动包裹（ abc 变为  “abc”）
- 语言允许出现的单词定义
- 折叠代码片的定义
- 控制缩进

### 自动补全与代码跳转

除了上面两种可以通过Json配置完成的智能服务外，还有可以自己写逻辑提供智能语言服务，比如 自动补全和代码跳转。这两个功能需要用到vscode中的 `Language Server API`，`Language Server`是vscode提供的一个独立进程来为编程语言提供语言服务，当然vscode插件里包含了一整套的`Language Server API`，可以用这些API来完成语言支持。

`vscode.languages`下能注册各种不同的语言功能，比如自动补全（CompletionItemProvider）、代码跳转（DefinitionProvider）、格式化（DocumentFormattingEditProvider）等

对应的 Provider如何使用，可以直接跳转到对应的`ts`接口文件中去找

## 调试器支持

这部分我个人认为稍微难一点了，概念方面理解起来没什么难度，主要是实现起来可能比较难。我先说一下要实现调试器支持需要大致的方向。

首先要了解为什么要调试器支持？其实，作为sim编译，控制台调试的话，使用sim提供的命令行编译调试也是可以的，但是这样问题一是比较麻烦（我需要去敲好长的命令去编译去调试），二是只能控制台调试，三是对未来开发者并不友好。vscode的调试器支持可以完美解决这三个问题。

然后是了解vscode调试器支持的架构（见附件）

最后要实现这样的调试器支持需要的成本

- vscode调试适配器的开发
- 学习simscript提供的用以调试的API

个人觉得这里比较难的原因是，智能语言支持是Vscode体系内的支持，功能支持是闭包的，但是调试器就不同，需要和外部体系通信，可能会遇到棘手的问题

## 项目脚手架

这一部分我要先说一下，它不属于vscode的插件体系，它属于npm package体系，有点像Java的maven，都是仓库（包）管理器。

项目脚手架的定位就是 要快速的构建起项目的框架结构。拿sim来说，我们要在vscode中开发的话，不能每次建项目我们都手动建目录，手动建文件，这不合适。所幸的是，sim的项目结构好像不复杂，而且项目类型好像也就三个，脚手架应该是最好写的。

不过这里有个问题就是，npm包管理是需要联网的，但是我们可以提前给他把项目脚手架工具npm 下载安装上，考虑到安全性的话。

# 附录（资料）

### vscode插件开发官方文档

https://code.visualstudio.com/api/get-started/your-first-extension

### VsCode中文手册

https://www.cntofu.com/book/98/index.html

### vscode极客教程

https://geek-docs.com/vscode/vscode-plugin-dev/the-custom-language-vscode-plugin-development.html

### TextMate

https://macromates.com/manual/en/language_grammars

### Scope Selector

https://macromates.com/blog/2005/introduction-to-scopes/

https://macromates.com/manual/en/scope_selectors

### 调试器扩展

https://code.visualstudio.com/api/extension-guides/debugger-extension

[https://www.cntofu.com/book/98/md/%E6%89%A9%E5%B1%95/%E8%8C%83%E4%BE%8B-%E8%B0%83%E8%AF%95%E5%99%A8.md](https://www.cntofu.com/book/98/md/扩展/范例-调试器.md)

### 调试适配器协议（DAP）

https://microsoft.github.io/debug-adapter-protocol/

### 快速构建一个项目脚手架（yeoman）

http://www.fly63.com/article/detial/3361

### 正则表达式

http://www.regexlab.com/zh/regref.htm

https://www.jb51.net/tools/regexsc.htm



