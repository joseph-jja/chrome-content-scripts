// search page is slightly different it does not put sortable on table

var table = document.querySelector('.sortable tbody');
if (!table) {
    let selectedCell;
    cells = document.querySelectorAll('center table tr:first-child td:first-child font b');
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
    var overlay = document.getElementById("overlay-api"),
        content;
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
        var tgt = e.target;
        if (tgt.nodeName.toLowerCase() === 'div') {
            if (tgt.id === 'closeModal') {
                overlay.style.display = "none";
            }
        }
    };

    table.onclick = function(e) {
        var img, url, x, y;

        if (e.target.nodeName.toLowerCase() === 'td') {
            let row = e.target.parentNode;
            row.querySelectorAll('td').forEach(function(x) {
                x.style.background = 'yellow';
            });
            img = e.target.parentNode.querySelector('img[alt="PIC "]');
            if (img) {
                url = img.parentNode.href;
                if (!url) {
                    // search pages
                    url = img.parentNode.querySelector('a').href;
                }

                let request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.addEventListener("load", function() {
                    var content, ele, i;
                    let winHeight = window.innerHeight - 200;

                    overlay.style.height = winHeight + "px";
                    overlay.style.width = "750px";
                    overlay.style.overflow = "hidden";
                    overlay.style.position = "absolute";
                    overlay.style.top = (50 + (+window.pageYOffset)) + "px";
                    overlay.style.left = (window.innerWidth > 800 ? (window.innerWidth - 800) + "px" : "500px");

                    content = this.responseText;
                    content = content.replace(/center/ig, 'b');
                    content = content.substring(content.indexOf("<blockquote>") + 12);
                    content = content.substring(0, content.lastIndexOf("</blockquote>"));
                    content = content.replace(/  /g, ' ');

                    content = `<div id="closeModal">close</div><div style="height: ${winHeight - 30}px; width: 730px; overflow: scroll;">` + content + '</div>';
                    overlay.innerHTML = content;

                    x = document.querySelectorAll("#overlay-api *");
                    y = document.querySelectorAll("#overlay-api div");
                    y = y[1];
                    for (let i = 0; i < x.length; i++) {
                        let node = x[i];
                        let nodeName = node.nodeName.toLowerCase();
                        if (nodeName !== 'img' && nodeName !== 'div') {
                            node.style.display = 'none';
                        } else if (nodeName === 'img') {
                            let url = node.src,
                                show = true;
                            if (url.indexOf('logo') > -1 || url.indexOf('banner') > -1) {
                                show = false;
                            }
                            if (show) {
                                y.appendChild(node);
                            }
                        }
                    }
                    let childImages = Array.prototype.slice.call(y.querySelectorAll('img'), 0).reverse();
                    childImages.forEach(i => {
                        let iWidth = getComputedStyle(i).getPropertyValue('width');
                        if (iWidth && parseInt(iWidth) !== 0 && parseInt(iWidth) <= 50) {
                            i.style.display = 'none';
                        }
                    });
                    overlay.style.display = "block";
                });
                request.send();
            }
        }
    };
}