<template>
  <div id="app" class="layout">
    <Layout v-show="!isHomePage">
      <Content id="setting">
        <div style="position:fixed;top:100px;right:50px;}">
          <Button type="success" ghost>保存设置</Button>
        </div>
        <div style="position:fixed;top:20px;left:20px">
          <Icon type="md-arrow-back" size="30" @click="goback"/>
        </div>
        <Card class="settingCard">
          <p slot="title">Theme.Global Setting</p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">background</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">color</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">fontSize</span>
              <span slot="append">px</span>
            </i-input>
          </p>
        </Card>
        <Card class="settingCard">
          <p slot="title">Theme.Sidebar Setting</p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">background</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">color</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">fontSize</span>
              <span slot="append">px</span>
            </i-input>
          </p>
        </Card>
        <Card class="settingCard">
          <p slot="title">Theme.Content Setting</p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">background</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">color</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">fontSize</span>
              <span slot="append">px</span>
            </i-input>
          </p>
        </Card>
        <Card class="settingCard">
          <p slot="title">Theme.Editbar Setting</p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">background</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">color</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">fontSize</span>
              <span slot="append">px</span>
            </i-input>
          </p>
        </Card>
        <Card class="settingCard">
          <p slot="title">Theme.Viewbar Setting</p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">background</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">color</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">fontSize</span>
              <span slot="append">px</span>
            </i-input>
          </p>
        </Card>
        <Card class="settingCard">
          <p slot="title">Theme.Footer Setting</p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">background</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="text">
              <span slot="prepend">color</span>
              <span slot="append">
                <ColorPicker  />
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">fontSize</span>
              <span slot="append">px</span>
            </i-input>
          </p>
        </Card>
        <Card class="settingCard">
          <p slot="title">Article Setting</p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">LineHeight</span>
              <span slot="append">
                px
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">ParagraphSpace</span>
              <span slot="append">
                px
              </span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">TitleIndent</span>
              <span slot="append">px</span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">ParagraphIndent</span>
              <span slot="append">px</span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">ListIndent</span>
              <span slot="append">px</span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">BlockquoteColor</span>
              <span slot="append">px</span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">ImagePattern</span>
              <span slot="append">px</span>
            </i-input>
          </p>
          <p class="cardContent">
            <i-input  type="number">
              <span slot="prepend">CodeTheme</span>
              <span slot="append">px</span>
            </i-input>
          </p>
        </Card>
      </Content>
    </Layout>
    <Layout v-show="isHomePage">
      <Sider v-show="siderOpened" hide-trigger width="152" class="sidebar">
        <div id="outline">大纲/目录</div>
        <div style="float:left;">
          <Tree :data="data1"></Tree>
        </div>
      </Sider>
      <Layout :style="{paddingLeft: '3px'}">
        <Content class="content" id="contentdefault">
          <div id="navigator" style="{height:'40px',background:'red'}">{{openedFile}}</div>
          <Row type="flex" justify="space-around" class="code-row-bg">
            <i-col v-show="codeOpened" span="11">
              <Input :rows="31" type="textarea" v-model="mdCode" placeholder="Enter something..." />
            </i-col>
            <i-col span="0.5">
              <div style="border:1px solid grey;height:100%;width:1px;background:grey"></div>
            </i-col>
            <i-col v-show="previewOpened" span="12">
              <div
                style="height:auto;width:100%;background:lightgrey;text-align:left;"
                id="maple-md-el"
              ></div>
            </i-col>
          </Row>
        </Content>
        <Footer class="footer" id="footerdefault">
          <Row>
            <i-col span="1">
              <Icon v-if="siderOpened" type="ios-arrow-back" size="20" @click="close('sider')" />
              <Icon v-else type="ios-arrow-forward" size="20" @click="open('sider') " />
            </i-col>
            <i-col span="2">
              <Icon
                v-if="codeOpened"
                type="md-code"
                :style="{color:'#19be6b'}"
                @click="close('code')"
              />
              <Icon v-else type="md-code" @click="open('code')" />
            </i-col>
            <i-col span="2">
              <Icon
                v-if="previewOpened"
                type="md-eye"
                :style="{color:'#19be6b'}"
                @click="close('preview')"
              />
              <Icon v-else type="md-eye-off" @click="open('preview')" />
            </i-col>
            <i-col span="17"></i-col>
            <i-col span="2" :style="{float:'right'}">
              <Icon v-if="saved" :style="{color:'#19be6b'}" type="md-checkmark-circle-outline" />
              <Spin v-else></Spin>
            </i-col>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  </div>
</template>

<script>
const { ipcRenderer } = window.require("electron");
import { MDParser } from "./libs/mdparser";
import { readData } from "./libs/util";
let MD = new MDParser();
let vm = {
  name: "App",
  data() {
    return {
      previewOpened: true,
      codeOpened: true,
      saved: true,
      siderOpened: true,
      isHomePage : true,
      openedFile: "Home \\ text1 \\ test.md",
      mdCode: "",
      config: {
        theme: {
          global: {
            background: "",
            color: "",
            fontSize: ""
          },
          sidebar: {
            background: "",
            color: "",
            fontSize: ""
          },
          content: {
            background: "",
            color: "",
            fontSize: ""
          },
          editbar: {
            background: "",
            color: "",
            fontSize: ""
          },
          viewbar: {
            background: "",
            color: "",
            fontSize: ""
          },
          footer: {
            background: "",
            color: "",
            fontSize: ""
          }
        },
        article: {
          LineHeight: "",
          ParagraphSpace: "",
          TitleIndent: "",
          ParagraphIndent: "",
          ListIndent: "",
          BlockquoteColor: "",
          ImagePattern: "",
          CodeTheme: ""
        }
      },
      data1: [
        {
          title: "parent 1",
          expand: true,
          children: [
            {
              title: "parent 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1"
                },
                {
                  title: "leaf 1-1-2"
                }
              ]
            },
            {
              title: "parent 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1"
                },
                {
                  title: "leaf 1-2-1"
                }
              ]
            }
          ]
        }
      ],
      data5: [
        {
          title: "parent 1",
          expand: true,
          render: (h, { root, node, data }) => {
            root;
            node;
            return h(
              "span",
              {
                style: {
                  display: "inline-block",
                  width: "100%"
                }
              },
              [
                h("span", [
                  h("Icon", {
                    props: {
                      type: "ios-folder-outline"
                    },
                    style: {
                      marginRight: "8px"
                    }
                  }),
                  h("span", data.title)
                ]),
                h("span", {
                  style: {
                    display: "inline-block",
                    float: "right",
                    marginRight: "32px"
                  }
                })
              ]
            );
          },
          children: [
            {
              title: "child 1-1",
              expand: true,
              children: [
                {
                  title: "leaf 1-1-1",
                  expand: true
                },
                {
                  title: "leaf 1-1-2",
                  expand: true
                }
              ]
            },
            {
              title: "child 1-2",
              expand: true,
              children: [
                {
                  title: "leaf 1-2-1",
                  expand: true
                },
                {
                  title: "leaf 1-2-1",
                  expand: true
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    open(panel) {
      switch (panel) {
        case "sider":
          this.siderOpened = true;
          break;
        case "code":
          this.codeOpened = true;
          break;
        case "preview":
          this.previewOpened = true;
          break;
      }
    },
    close(panel) {
      switch (panel) {
        case "sider":
          this.siderOpened = false;
          break;
        case "code":
          this.codeOpened = false;
          break;
        case "preview":
          this.previewOpened = false;
          break;
      }
    },
    goback(){
      this.isHomePage = true;
    }
  },
  watch: {
    mdCode() {
      console.log(this.mdCode);
      if (this.mdCode == "") {
        document.getElementById("maple-md-el").innerHTML = "";
        MD.clear();
      } else {
        MD.setData(this.mdCode);
        if (MD.getFirstCallVnode()) {
          MD.lexicalAnalysis()
            .optimizeToken()
            .syntaxAnalysis()
            .firstBuild();
          document.getElementById("maple-md-el").appendChild(MD.getDOM());
        } else {
          MD.lexicalAnalysis()
            .optimizeToken()
            .syntaxAnalysis();
          console.log(MD.getVnode());
          console.log(MD.getNewVnode());
          MD.diffBuild();
        }
      }
      console.log(MD.getVnode());
      console.log(MD.getNewVnode());
      console.log(MD.getDOM());
    }
  },
  components: {},
  mounted() {
    ipcRenderer.on("openfile", (event, message) => {
      // filePath.ref = message;
      console.log(message);
      console.log(this);
      if (!MD.getFirstCallVnode()) {
        document.getElementById("maple-md-el").innerHTML = "";
        MD.clear();
      }
      this.openedFile = message;
      this.mdCode = readData(message);
    });
    ipcRenderer.on("goSetting",()=>{
      this.isHomePage = false;
    })
  }
};

export default vm;
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(44, 62, 80);
}
#setting{
  display: flex;
  flex-direction: column;
  flex-wrap : wrap;
  justify-content: flex-start;
  align-items: baseline;
}
.settingCard{
   width:350px;
   margin: 20px auto; 
}
.cardContent{
  margin : 5px auto;
}
#outline {
  width: 100%;
  height: 40px;
  text-align: center;
  display: inline-block;
  line-height: 40px;
  vertical-align: middle;
  border-bottom: 1px solid lightgrey;
}
#navigator {
  width: 100%;
  height: 40px;
  text-align: left;
  display: inline-block;
  line-height: 40px;
  vertical-align: middle;
}
#contentdefault {
  min-height: 580px;
  width: auto;
  padding: 0px 24px 24px;
}
#footerdefault {
  margin-top: 3px;
  padding: 4px;
  height: 30px;
}
.demo-tree-render .ivu-tree-title {
  width: 100%;
}
</style>
