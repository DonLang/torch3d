"use strict";
var TorchModel = require('./torchModel.js')
var EdgeModel = require('./edge.js')
var Songbook = require('./songbook.js')
var TorchScene = require('./scene.js')
var renderer = new THREE.WebGLRenderer();
var container = document.getElementById('torch');
var jsyaml = require('js-yaml');
var fs = require('fs');
var editorControl = require('./editor.js');
//document.body.appendChild( container );

renderer.setSize(300, 600);
//document.body.appendChild(renderer.domElement);
container.appendChild( renderer.domElement );
var camera = new THREE.PerspectiveCamera(45, 0.5, 1, 500);
// camera.position.set(5, 20, 50);
camera.position.set(5, 20, 50);
camera.lookAt(new THREE.Vector3(0, 0, 0));
var scene = new THREE.Scene();

var ts = new TorchScene(scene);
ts.loadSkyBox();
ts.loadGround();

var editor = ace.edit("editor");
window.editor = editor;
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/yaml");

var scale = 10;
var torchModel = new TorchModel(scale, scene);
var torchModelRender = torchModel.getRenderStructure()
scene.add(torchModelRender);

window.render = function() {
    renderer.render(scene, camera);
}

function runEditorSongbook() {
    var torchModel = new TorchModel(scale, scene);
    var torchModelRender = torchModel.getRenderStructure()
    scene.add(torchModelRender);
    var text = editor.getValue();
    try {
        var yml = jsyaml.safeLoad(text);
//            torchModel = new TorchModel(scale, scene);
        window.current_songbook = new Songbook(text, torchModel);
        window.current_songbook.run();
    } catch(e) {
        $('#error-modal-text pre').text(e.message);
        $('#error-modal').modal();
    }
}

$(document).ready(function(){
    editorControl.getSample('test2', (resp) => {
        editor.setValue(resp, 1);
        runEditorSongbook();
    });
    $("#run-button").click(function() {
        window.current_songbook.stop();
        runEditorSongbook();
    });
    $("#clear-button").click(function() {
        window.current_songbook.stop();        
        window.current_songbook = Songbook.BLANK_SONGBOOK(torchModel);
        window.current_songbook.run();
        window.editor.setValue("", 1);
    });
});
// var xhttp = new XMLHttpRequest();
// xhttp.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//         var sb = new Songbook(this.responseText, torchModel);
//         sb.run();
//     }
// };
// xhttp.open("GET", "songbooks/test.yaml", true);
// xhttp.send();

