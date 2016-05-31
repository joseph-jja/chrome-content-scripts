// ==UserScript==
// @name           PerformanceTimings
// @namespace      http://localhost.com/
// @description    Show Performance Timings Of Site
// @include        http://*.com/*
// ==/UserScript==

function renderContent() {
    var j, nmap = performance.timing, start, timeValue;
    var results = "<b>Performance Timings</b><br>";    

    start = nmap['navigationStart'];
    
    for ( j in nmap ) { 
        timeValue = ( ( nmap[j] <= 0 ) ? 0 : ( nmap[j] - start ) );
        results += j + " " + timeValue + "<br>";
    }

    return results;
}

var buildInfo = document.getElementById("domElementInfo");
if ( ! buildInfo ) { 
    buildInfo = document.createElement("div");   
    buildInfo.id = "domElementInfo";
    buildInfo.style.background = "white";
    buildInfo.style.position = "absolute";
    buildInfo.style.top = "0px";
    buildInfo.style.left = "0px";
    buildInfo.style.width = "200px";
    buildInfo.style.zIndex = 10000;
    buildInfo.style.overflow = "scroll";
    buildInfo.style.textAlign = "left";
}

// call function
var results = renderContent();

var script = "var bi = document.getElementById('domElementInfo');";
script += "if (bi) { bi.style.display = 'none'; }"; 

// create script tag for re-rendering the element counts
var render = document.getElementById("domContentScript");
if ( ! render ) { 
    render = document.createElement("script");   
    render.id = "domContentScript";
}
render.innerHTML = renderContent;
document.body.appendChild(render);

var rerender = "var bi = document.getElementById('domContents');";
rerender += "if (bi) { bi.innerHTML = renderContent(); }"; 

buildInfo.innerHTML = "<div id='domContents'>" + results + '\n' + '</div><hr><span onclick="' + rerender + '">re-render</span><br><span onclick="' + script + '">close</span>';
document.body.appendChild(buildInfo);


