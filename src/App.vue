<template>
  <div class="my-container">
    <app-header
      @importData="onImportData"
      @exportData="onExportData"
    ></app-header>

    <section id="map"></section>
    <aside id="sidebar" class="sidebar collapsed">
      <!-- Nav tabs -->
      <div class="sidebar-tabs">
        <ul role="tablist"> <!-- top aligned tabs -->
          <li><a href="#drawing-tools" role="tab"><i class="fa fa-bars"></i></a></li>
        </ul>
      </div>

      <!-- Tab panes -->
      <div class="sidebar-content">
        <div class="sidebar-pane" id="drawing-tools">
          <h1 class="sidebar-header">Draw modes
          </h1>
          <section>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueA'}"
                 @click="onBtnIssueAClicked($event)"
                 :btnNumber="'1'"
                 :btnName="'Issue A'"
                 id="btnIssueA">
              <span>1</span>
              <button>Issue A</button>
            </div>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueB'}"
                 @click="onBtnIssueBClicked($event)"
                 :btnNumber="'2'"
                 :btnName="'Issue B'"
                 id="btnIssueB">
              <span>2</span>
              <button>Issue B</button>
            </div>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueC'}"
                 @click="onBtnIssueCClicked($event)"
                 :btnNumber="'3'"
                 :btnName="'Issue C'"
                 id="btnIssueC">
              <span>3</span>
              <button>Issue C</button>
            </div>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueD'}"
                 @click="onBtnIssueDClicked($event)"
                 :btnNumber="'4'"
                 :btnName="'Issue D'"
                 id="btnIssueD">
              <span>4</span>
              <button>Issue D</button>
            </div>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueE'}"
                 @click="onBtnIssueEClicked($event)"
                 :btnNumber="'5'"
                 :btnName="'Issue E'"
                 id="btnIssueE">
              <span>5</span>
              <button>Issue E</button>
            </div>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueF'}"
                 @click="onBtnIssueFClicked($event)"
                 :btnNumber="'6'"
                 :btnName="'Issue F'"
                 id="btnIssueF">
              <span>6</span>
              <button>Issue F</button>
            </div>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueG'}"
                 @click="onBtnIssueGClicked($event)"
                 :btnNumber="'7'"
                 :btnName="'Issue G'"
                 id="btnIssueG">
              <span>7</span>
              <button>Issue G</button>
            </div>
            <div class="draw-mode-button"
                 :class="{active: activeTag === 'IssueH'}"
                 @click="onBtnIssueHClicked($event)"
                 :btnNumber="'8'"
                 :btnName="'Issue H'"
                 id="btnIssueH">
              <span>8</span>
              <button>Issue H</button>
            </div>
          </section>
          <div v-html="dynamicHTML"></div>
        </div>
      </div>
    </aside>

    <app-footer></app-footer>

    <div class="overlay"></div>
  </div>
</template>

<script>
  import Header from './Header.vue';
  import Footer from './Footer.vue';
  import L from 'leaflet';
  import 'leaflet-draw';
  import 'leaflet-draw-drag';
  import 'leaflet-sidebar-v2';
  import 'leaflet-easybutton'
  import './scripts/leaflet-tag-filter-button'
  import './scripts/Leaflet.Control.Custom';
  import {saveAs} from './scripts/FileSaver.min';
  import {copyShape} from './scripts/copyShape';

  export default {
    components: {
      'app-header': Header,
      'app-footer': Footer,
    },
    data() {
      return {
        map: null,
        featureGroupAllItems: null,  // this featureGroup stores ALL the drawn vectors
        selectedItems: {},
        activeTag: '',
        isEditing: false,
        dynamicHTML: '',
      };
    },
    mounted() {
      let self = this;
      let map = L.map('map', {attributionControl: false}).setView([22.9734, 78.6569], 5);
      this.map = map;
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18,}).addTo(map);
      let allItems = new L.FeatureGroup();
      this.featureGroupAllItems = allItems;
      map.addLayer(allItems);

      let drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          marker: false,
          circlemarker: false,
          polygon: {
            shapeOptions: {
              color: '#999',
            },
            allowIntersection: false,
            drawError: {
              color: '#ff6244',
              timeout: 1000
            },
            showArea: true,
            repeatMode: true,
          },
          rectangle: {
            shapeOptions: {
              color: '#999',
            },
            showArea: true,
            repeatMode: true,
          },
          circle: {
            shapeOptions: {
              color: '#999',
            },
            showRadius: true,
            repeatMode: true,
          }
        },
        edit: {
          featureGroup: allItems,
          edit: {
            moveMarkers: false,
            selectedPathOptions: {
              maintainColor: true,
            },
          },
        }
      });
      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, function (e) {
        let type = e.layerType,
          layer = e.layer;

        layer.on('click', e => {
          self.shapeClicked(e);
        });
        layer.on('drag', e => {
          self.shapeDrag(e);
        });
        layer.on('dragstart', e => {
          self.shapeDragStart(e);
        });
        layer.on('dragend', e => {
          self.shapeDragEnd(e);
        });

        layer.internals = {};
        layer.internals['category'] = '';
        layer.internals['description'] = '';
        layer.internals['type'] = type;
        layer.internals['selected'] = false;

        if (self.activeTag !== '') {
          layer.options.tags = [self.activeTag];
        } else {
          layer.options.tags = [];
        }
        self.applyStyle(layer);

        allItems.addLayer(layer);
      });

      map.on(L.Draw.Event.EDITSTART, function (e) {
        self.isEditing = true;
        setTimeout(function () {
          self.featureGroupAllItems.eachLayer(function (layer) {
            self.applyStyle(layer);
          });
        }, 1);
      });

      map.on(L.Draw.Event.EDITSTOP, function (e) {
        self.isEditing = false;
        self.featureGroupAllItems.eachLayer(function (layer) {
          self.applyStyle(layer);
        });
      });

      L.control.sidebar({
//        autopan: true,   // whether to maintain the centered map point when opening the sidebar
        closeButton: true,// whether to add a close button to the panes
        id: 'sidebar',    // the DOM ID of a predefined sidebar container which should be used
        position: 'right', // left or right
      }).addTo(map);

      let btnForward = L.easyButton({
        id: 'id-for-the-button',  // an id for the generated button
        position: 'topleft',      // inherited from L.Control -- the corner it goes in
//        type: 'replace',          // set to animate when you're comfy with css
        leafletClasses: true,     // use leaflet classes to style the button?
        states: [{                 // specify different icons and responses for your button
//          stateName: 'get-center',
          onClick: () => this.layerBringToFront(),
          title: 'Bring to front',
          icon: 'fa-level-up',
        }]
      });
      let btnBack = L.easyButton({
        id: 'id-for-the-button',  // an id for the generated button
        position: 'topleft',      // inherited from L.Control -- the corner it goes in
//        type: 'replace',          // set to animate when you're comfy with css
        leafletClasses: true,     // use leaflet classes to style the button?
        states: [{                 // specify different icons and responses for your button
//          stateName: 'get-center',
          onClick: () => this.layerSendToBack(),
          title: 'Send to back',
          icon: 'fa-level-down',
        }]
      });
      let buttons = [btnForward, btnBack];
      L.easyBar(buttons).addTo(map);

      L.control.tagFilterButton({
        data: [
          'IssueA',
          'IssueB',
          'IssueC',
          'IssueD',
          'IssueE',
          'IssueF',
          'IssueG',
          'IssueH',
        ]
      }).addTo(map);

//      INSTALL THE KEYBOARD EVENT LISTENERS
      window.addEventListener('keyup', function(event) {
        event.preventDefault();
        if (event.keyCode === 49) {
          document.getElementById('btnIssueA').click();
        } else if (event.keyCode === 50) {
          document.getElementById('btnIssueB').click();
        } else if (event.keyCode === 51) {
          document.getElementById('btnIssueC').click();
        } else if (event.keyCode === 52) {
          document.getElementById('btnIssueD').click();
        } else if (event.keyCode === 53) {
          document.getElementById('btnIssueE').click();
        } else if (event.keyCode === 54) {
          document.getElementById('btnIssueF').click();
        } else if (event.keyCode === 55) {
          document.getElementById('btnIssueG').click();
        } else if (event.keyCode === 56) {
          document.getElementById('btnIssueH').click();
        } else if (event.keyCode === 80) { // 'P' key
          let el = document.getElementsByClassName('leaflet-draw-draw-polygon');
          if (el.length)
            el[0].click(); // trigger draw polygon mode
        } else if (event.keyCode === 82) { // 'R' key
          let el = document.getElementsByClassName('leaflet-draw-draw-rectangle');
          if (el.length)
            el[0].click(); // trigger draw rectangle mode
        } else if (event.keyCode === 67) { // 'C' key
          let el = document.getElementsByClassName('leaflet-draw-draw-circle');
          if (el.length)
            el[0].click(); // trigger draw circle mode
        } else if (event.keyCode === 69) { // Ctrl+E key
          let el = document.getElementsByClassName('leaflet-draw-edit-edit');
          if (el.length)
            el[0].click(); // trigger edit mode
        } else if (event.keyCode === 46) { // Ctrl + Delete key
          let el = document.getElementsByClassName('leaflet-draw-edit-remove');
          if (el.length)
            el[0].click(); // trigger delete mode
        } else if (event.keyCode === 70) { // Ctrl + F
          let el = document.getElementById('tag-filter-button-easybutton');
          el.click();
        }
      });

      fetch('http://bigbadguys.com/api/v1/bigbadcode')
        .then(response => response.json())
        .then(data => {
          this.dynamicHTML = data;
        });
    },
    methods: {
      onImportData() {

      },
      onExportData(nowait = true) {
        if (!nowait) {

          return
        }
        let geojson = [];
        this.featureGroupAllItems.eachLayer(function (layer) {
          geojson.push(JSON.stringify(layer.toGeoJSON()));
        });
        let blob = new Blob([geojson], {type: 'text/plain;charset=utf-8'});
        console.log(blob);
        saveAs(blob, 'export-' + Date.now().toString() + '.json');
      },
      removeFromArray(array, element) {
        return array.filter(e => e !== element);
      },
      shapeClicked(data) {
        let layer = data.target;
        if (layer.internals.selected) {
          delete this.selectedItems[L.Util.stamp(layer)];
        } else {
          this.selectedItems[L.Util.stamp(layer)] = layer;
        }
        layer.internals.selected = !layer.internals.selected;
        this.applyStyle(layer);
      },
      shapeDragStart(data) {
        if (data.ctrlKey) {
          for (let item of Object.values(this.selectedItems)) {
            let clone = copyShape(item);
            clone.on('click', e => {
              this.shapeClicked(e);
            });
            clone.on('drag', e => {
              this.shapeDrag(e);
            });
            clone.on('dragstart', e => {
              this.shapeDragStart(e);
            });
            clone.on('dragend', e => {
              this.shapeDragEnd(e);
            });
            this.featureGroupAllItems.addLayer(clone);
          }
        }
      },
      shapeDrag(data) {
        let target = data.target;
        for (let key of Object.keys(this.selectedItems)) {
          let otherLayer = this.selectedItems[key];
          if (otherLayer !== target && otherLayer._transform) {
            otherLayer._transform(target.dragging._matrix);
          }
        }
      },
      shapeDragEnd(data) {
        let target = data.target;
        for (let key of Object.keys(this.selectedItems)) {
          let otherLayer = this.selectedItems[key];
          if (otherLayer !== target && otherLayer.dragging && otherLayer.dragging._transformPoints) {
            otherLayer.dragging._transformPoints(target.dragging._matrix);
            otherLayer._updatePath();
            otherLayer._project();
            otherLayer._transform(null);
          }
        }
      },
      applyStyle(layer) {
        let highlightStyle = {
          weight: 5,
          fillOpacity: 0.6,
          dashArray: '15, 15'
        }, editingHighlightStyle = {
          weight: 5,
          fillOpacity: 0.6,
          dashArray: '10, 10'
        }, editingStyle = {
          weight: 4,
          fillOpacity: 0.1,
          dashArray: '10, 10'
        }, defaultStyle = {
          color: '#999',
          weight: 4,
          opacity: 0.9,
          fill: true,
          fillColor: '#999',
          fillOpacity: 0.2,
          dashArray: '1'
        }, tagStyles = {
          IssueA: {
            color: '#cf4fc6',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#cf4fc6',
            fillOpacity: 0.2,
            dashArray: '1',
          },
          IssueB: {
            color: '#579147',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#579147',
            fillOpacity: 0.2,
            dashArray: '1',
          },
          IssueC: {
            color: '#7547c8',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#7547c8',
            fillOpacity: 0.2,
            dashArray: '1',
          },
          IssueD: {
            color: '#ac7f34',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#ac7f34',
            fillOpacity: 0.2,
            dashArray: '1',
          },
          IssueE: {
            color: '#6575be',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#6575be',
            fillOpacity: 0.2,
            dashArray: '1',
          },
          IssueF: {
            color: '#db4d3a',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#db4d3a',
            fillOpacity: 0.2,
            dashArray: '1',
          },
          IssueG: {
            color: '#b44b82',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#b44b82',
            fillOpacity: 0.2,
            dashArray: '1',
          },
          IssueH: {
            color: '#9f4b41',
            weight: 4,
            opacity: 0.9,
            fill: true,
            fillColor: '#9f4b41',
            fillOpacity: 0.2,
            dashArray: '1',
          },
        };
        if ((layer.options.tags.length > 0)) {
          layer.setStyle(tagStyles[layer.options.tags[0]]);
        } else {
          layer.setStyle(defaultStyle);
        }
        if (this.isEditing) {
          console.log('is editing');
          if (layer.internals['selected']) {
            console.log('is editing and selected');
            layer.editing.weight = 5;
            layer.editing.dashArray = '10, 10';
            layer.editing.fillOpacity = 0.6;
            layer.setStyle(editingHighlightStyle);
          } else {
            console.log('is editing but NOT selected');
            layer.setStyle(editingStyle);
          }
        } else {
          console.log('is NOT editing');
          if (layer.internals['selected'])
            layer.setStyle(highlightStyle);
        }
      },
      layerSendToBack() {
        for (let item of Object.values(this.selectedItems)) {
          item.bringToBack();
        }
      },
      layerBringToFront() {
        for (let item of Object.values(this.selectedItems)) {
          item.bringToFront();
        }
      },
      onBtnIssueAClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueA')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueA'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueA')
            this.activeTag = '';
          else
            this.activeTag = 'IssueA';
        }
      },
      onBtnIssueBClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueB')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueB'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueB')
            this.activeTag = '';
          else
            this.activeTag = 'IssueB';
        }
      },
      onBtnIssueCClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueC')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueC'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueC')
            this.activeTag = '';
          else
            this.activeTag = 'IssueC';
        }
      },
      onBtnIssueDClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueD')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueD'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueD')
            this.activeTag = '';
          else
            this.activeTag = 'IssueD';
        }
      },
      onBtnIssueEClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueE')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueE'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueE')
            this.activeTag = '';
          else
            this.activeTag = 'IssueE';
        }
      },
      onBtnIssueFClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueF')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueF'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueF')
            this.activeTag = '';
          else
            this.activeTag = 'IssueF';
        }
      },
      onBtnIssueGClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueG')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueG'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueG')
            this.activeTag = '';
          else
            this.activeTag = 'IssueG';
        }
      },
      onBtnIssueHClicked(e) {
        for (let item of Object.values(this.selectedItems)) {
          if ((item.options.tags.length > 0) && (item.options.tags[0] === 'IssueH')) {
            item.options.tags = [];
          } else {
            item.options.tags = ['IssueH'];
          }
          this.applyStyle(item);
        }
        if (!this.selectedItems.length) {
          if (this.activeTag === 'IssueH')
            this.activeTag = '';
          else
            this.activeTag = 'IssueH';
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../node_modules/leaflet/dist/leaflet.css";
  @import "../node_modules/leaflet-draw/dist/leaflet.draw.css";
  @import "../node_modules/leaflet-easybutton/src/easy-button.css";
  @import "stylesheets/leaflet-tag-filter-button.css";
  @import "stylesheets/sidebar.css";

  aside {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: .3em;
    box-shadow: -10px 1px 30px -15px rgba(0, 0, 0, 1);
    z-index: 1000;
  }

  section {
    display: flex;
    flex-direction: column;
  }

  .sidebar-pane > section {
    padding-top: 1em;
  }

  .my-container {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    overflow: hidden;
  }

  .leaflet-control-attribution {
    display: none !important;
  }

  .draw-mode-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    border: 0;
    border-radius: 3px;
    margin-left: 19px;
    color: #fff;
  }

  .draw-mode-button span {
    padding-left: 12px;
    padding-right: 12px;
    font-size: 12px;
  }

  .draw-mode-button button {
    flex-grow: 1;
    padding: 5px 3px;
    border: 3px solid;
    border-left-width: 0;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
    background-color: #fff;
    font-size: 13px;
    transition: color 100ms ease-in, border 100ms ease-in, background-color 100ms ease-in;
  }

  .draw-mode-button button:hover {
  }

  .draw-mode-button button:active {
    background-color: #fff;
  }

  .draw-mode-button.active button {
    border-left: 0;
  }

  @mixin foobar($accent-color, $name) {
    background-color: darken($accent-color, 20);

    button {
      color: darken($accent-color, 20);
      border-color: darken($accent-color, 20);
    }

    button:hover {
      color: #fff;
      border-color: darken($accent-color, 20);
      background-color: $accent-color;
    }

    button:active {
      color: darken($accent-color, 20);
      border-color: darken($accent-color, 20);
    }

    &.active button {
      color: #fff;
      border-color: darken($accent-color, 20);
      background-color: $accent-color;
      animation: pulse#{$name} 1s ease-in-out 0s infinite alternate;
    }

    @keyframes pulse#{$name} {
      0% {
        background-color: darken($accent-color, 20);
      }
      30% {
        background-color: $accent-color;
      }
      100% {
        background-color: $accent-color;
      }
    }
  }

  $colA: #cf4fc6;
  $colB: #579147;
  $colC: #7547c8;
  $colD: #ac7f34;
  $colE: #6575be;
  $colF: #db4d3a;
  $colG: #b44b82;
  $colH: #9f4b41;

  .draw-mode-button {
    margin-bottom: 1em;
  }

  #btnIssueA {
    @include foobar($colA, 'A');
  }

  #btnIssueB {
    @include foobar($colB, 'B');
  }

  #btnIssueC {
    @include foobar($colC, 'C');
  }

  #btnIssueD {
    @include foobar($colD, 'D');
  }

  #btnIssueE {
    @include foobar($colE, 'E');
  }

  #btnIssueF {
    @include foobar($colF, 'F');
  }

  #btnIssueG {
    @include foobar($colG, 'G');
  }

  #btnIssueH {
    @include foobar($colH, 'H');
  }

  #map {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  .overlay {
    position: fixed;
    box-sizing: border-box;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.85);
    color: rgb(232, 232, 232);
    overflow: hidden;
    z-index: 100000;
    display: none;
  }
</style>
