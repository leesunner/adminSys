<template>
  <div class="contentBox">
    <div class="contents" ref="container" id="js-drop-zone">
      <div class="canvas" ref="canvas"></div>
      <el-scrollbar class="properties-panel-parent">
        <div id="js-properties-panel"></div>
      </el-scrollbar>
    </div>
    <ul class="buttons">
      <li>
        <a id="js-download-diagram" ref="downloadLink" href title="download BPMN diagram">
          <el-button type="primary" size="mini">
            下载BPMN 文件
          </el-button>
        </a>
      </li>
      <li>
        <a id="js-download-svg" href ref="downloadSvgLink" title="download as SVG image">
          <el-button type="primary" size="mini">
            下载SVG 图片
          </el-button>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  import 'bpmn-js/dist/assets/diagram-js.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
  import BpmnModeler from 'bpmn-js/lib/Modeler';
  import customTranslate from './customTranslate';
  import propertiesPanelModule from 'bpmn-js-properties-panel';
  import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
  import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';

  import {debounce} from 'min-dash';

  import mixin from '@/mixin/buttonPermission'
  export default {
    mixins: [mixin],
    name: "work-flow",
    data() {
      return {
        isCollapse:false,
        bpmnModeler: null,
        diagramXML: `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1"/>
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds height="36.0" width="36.0" x="412.0" y="240.0"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>`,
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.init()
        this.registerFileDrop(this.$refs['container'], this.openDiagram);
        this.createNewDiagram();
      })
    },
    methods: {
      //创建工作流界面
      createNewDiagram() {
        this.openDiagram(this.diagramXML);
      },

      openDiagram(xml) {
        this.bpmnModeler.importXML(xml, err => {
          if (err) {
            this.$message.error(err.message)
          }
        });
      },

      saveSVG(done) {
        this.bpmnModeler.saveSVG(done);
      },

      saveDiagram(done) {
        this.bpmnModeler.saveXML({format: true}, function (err, xml) {
          done(err, xml);
        });
      },

      registerFileDrop(container, callback) {
        function handleFileSelect(e) {
          e.stopPropagation();
          e.preventDefault();

          var files = e.dataTransfer.files;

          var file = files[0];

          var reader = new FileReader();

          reader.onload = function (e) {

            var xml = e.target.result;

            callback(xml);
          };

          reader.readAsText(file);
        }

        function handleDragOver(e) {
          e.stopPropagation();
          e.preventDefault();

          e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }

        this.$refs['container'].addEventListener('dragover', handleDragOver, false);
        this.$refs['container'].addEventListener('drop', handleFileSelect, false);
      },

      //初始化
      init() {
        this.bpmnModeler = new BpmnModeler({
          container: this.$refs['canvas'],
          propertiesPanel: {
            parent: '#js-properties-panel'
          },
          additionalModules: [
            propertiesPanelModule,
            propertiesProviderModule,
            {
              translate: ['value', customTranslate]
            }
          ],
          moddleExtensions: {
            camunda: camundaModdleDescriptor
          }
        })
        const exportArtifacts = debounce(() => {

          this.saveSVG((err, svg) => {
            this.setEncoded(this.$refs.downloadSvgLink, 'diagram.svg', err ? null : svg);
          });

          this.saveDiagram((err, xml) => {
            this.setEncoded(this.$refs.downloadLink, 'diagram.bpmn', err ? null : xml);
          });
        }, 500);

        this.bpmnModeler.on('commandStack.changed', exportArtifacts);
      },
      //解析数据
      setEncoded(link, name, data) {
        const encodedData = encodeURIComponent(data);

        if (data) {
          link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
          link.download = name
        } else {
          link.href = ''
          link.download = ''
        }
      }

    }
  }
</script>

<style lang="scss" scoped>
  .contentBox{
    height: 84vh;
    position: relative;
  }
  .contents{
    height: inherit;
    position: relative;
    .canvas{
      height: inherit;
      background-color: #ebeef5;
    }
  }
  .properties-panel-parent{
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 120;
    width: 260px;
    transition: all ease-in-out 0.2s;
    overflow-y: auto;
    background-color: #f8f8f8;
    #js-properties-panel{
      height:inherit;
    }
  }
  .buttons{
    position: absolute;
    top: 6px;
    right: 262px;
    li{
      margin-bottom: 12px;
    }
  }
</style>
