// search page is slightly different it does not put sortable on table

// change width of all the tables for wider screens
Array.from(document.querySelectorAll('table')).forEach(tbl => {
    tbl.width = '95%';
});

Array.from(document.getElementsByTagName('*')).forEach(ele => { 
    ele.style.fontSize = '14pt'; 
});

var table = document.querySelector('.sortable tbody');
if (!table) {
    let selectedCell;
    const cells = document.querySelectorAll('center table tr:first-child td:first-child font b');
    cells.forEach(function(x) {
        if (x.innerHTML === 'Item' && x.parentNode) {
            selectedCell = x.parentNode.parentNode;
        }
    });
    if (selectedCell && selectedCell.parentNode && selectedCell.parentNode.parentNode) {
        table = selectedCell.parentNode.parentNode.parentNode;
    }
}

if (table) {
    let overlay = document.getElementById("overlay-api");
    if (!overlay) {
        overlay = document.createElement("div");
        document.body.appendChild(overlay);
    }
    overlay.id = "overlay-api";
    overlay.style.overflow = "hidden";
    overlay.style.position = "absolute";
    overlay.style.backgroundColor = "white";
    overlay.style.display = "none";

    overlay.onclick = function(e) {
        const tgt = e.target;
        if (tgt.nodeName.toLowerCase() === 'div') {
            if (tgt.id === 'closeModal') {
                overlay.style.display = "none";
            }
        }
    };

    table.onclick = function(e) {

        if (e.target.nodeName.toLowerCase() === 'td') {
            let row = e.target.parentNode;
            row.querySelectorAll('td').forEach(function(m) {
                m.style.background = 'yellow';
            });
            
            let img = e.target.parentNode.querySelector('img[alt="PIC "]');
            if (img) {
                let url = img.parentNode.href;
                if (!url) {
                    // search pages
                    url = img.parentNode.querySelector('a').href;
                }

                let request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.addEventListener("load", function() {
                    let ele, i;
                    const winWidth = window.innerWidth,
                          winHeight = window.innerHeight;
                    const windowHeight = winHeight - 100;

                    overlay.style.height = windowHeight + "px";
                    overlay.style.width = "750px";
                    overlay.style.overflow = "hidden";
                    overlay.style.position = "absolute";
                    overlay.style.top = (50 + (+window.pageYOffset)) + "px";
                    overlay.style.left = (winWidth > 800 ? (winWidth - 800) + "px" : "500px");

                    let content = this.responseText;
                    content = content.replace(/center/ig, 'b');
                    content = content.substring(content.indexOf("<blockquote>") + 12);
                    content = content.substring(0, content.lastIndexOf("</blockquote>"));
                    content = content.replace(/  /g, ' ');

                    content = `<div id="closeModal">close</div><div style="height: ${windowHeight - 30}px; width: 730px; overflow: scroll;" id="overlay-api-content">` + content + '</div>';
                    overlay.innerHTML = content;

                    let allChildren = document.querySelectorAll("#overlay-api-content img");
                    allChildren = Array.prototype.slice.call(allChildren, 0);
                    
                    let olaDiv = document.getElementById('overlay-api-content');
                    olaDiv.innerHTML = '';
                    
                    let isWetspot = false;
                    // loop de loop de loop
                    // find out if this is w-spot they show fish image first
                    allChildren.forEach(node => {
                        let nodeName = node.nodeName.toLowerCase();
                        if (nodeName === 'img') {
                            let url = node.src.toLowerCase();
                            if (url.indexOf('wetspot') > -1) {
                                isWetspot = true;
                            }
                        }
                    });
                    // no? reverse 
                    if (!isWetspot) {
                        allChildren.reverse();
                    }
                    allChildren.forEach(node => {
                        let nodeName = node.nodeName.toLowerCase();
                        if (nodeName === 'img') {
                            let url = node.src.toLowerCase(),
                                show = true;
                            if (url.indexOf('logo') > -1 || url.indexOf('banner') > -1) {
                                show = false;
                            } else if (url.indexOf('sorry.jpg') > -1) {
                                show = false;
                            }
                            if (show) {
                                olaDiv.appendChild(node);
                            }
                        }
                    });
                    let childImages = olaDiv.querySelectorAll('img');
                    childImages.forEach(i => {
                        let iWidth = getComputedStyle(i).getPropertyValue('width');
                        if (iWidth && parseInt(iWidth) !== 0 ) {
                            if (parseInt(iWidth) <= 50) {
                                i.style.display = 'none';
                            } else {
                                //i.style.width = '250px';
                                //i.style.display = 'block';
                            }
                        }
                    });
                    overlay.style.display = "block";
                });
                request.send();
            }
        }
    };
}
