// ==UserScript==
// @name           Aquabid
// @namespace      http://aquabid.com/
// @description    Show Images On aquabid
// @include        http://*.aquabid.com/cgi-bin/auction*
// @include        http://www.aquabid.com/cgi-bin/auction*
// ==/UserScript==

var table = document.querySelector( '.sortable tbody' );
if ( table ) {
    var overlay = document.getElementById( "overlay-api" ),
        content;
    if ( !overlay ) {
        overlay = document.createElement( "div" );
        document.body.appendChild( overlay );
    }
    overlay.id = "overlay-api";
    overlay.style.overflow = "hidden";
    overlay.style.position = "absolute";
    overlay.style.backgroundColor = "white";
    overlay.style.display = "none";

    overlay.onclick = function ( e ) {
        var tgt = e.target;
        if ( tgt.nodeName.toLowerCase() === 'div' ) {
            if ( tgt.id === 'closeModal' ) {
                overlay.style.display = "none";
            }
        }
    };

    table.onclick = function ( e ) {
        var img, request, url, i, x, y;

        if ( e.target.nodeName.toLowerCase() === 'td' ) {
            img = e.target.parentNode.querySelector('img[alt="PIC "]');
            if ( img ) {
                url = img.parentNode.href;

                request = new XMLHttpRequest();
                request.open( "GET", url, true );
                request.addEventListener( "load", function () {
                    var content, ele, i;
                    
                    overlay.style.height = "500px";
                    overlay.style.width = "750px";
                    overlay.style.overflow = "hidden";
                    overlay.style.position = "absolute";
                    overlay.style.top = ( 50 + (+window.pageYOffset) ) + "px";
                    overlay.style.left = "500px";

                    content = this.responseText;
                    content = content.replace(/center/g, 'b');
                    content = content.substring( content.indexOf( "<blockquote>" ) + 12 );
                    content = content.substring( 0, content.lastIndexOf( "</blockquote>" ) );
                    content = content.replace( /  /g, ' ' );

                    content = '<div id="closeModal">close</div><div style="height: 470px; width: 730px; overflow: scroll;">' + content + '</div>';
                    overlay.innerHTML = content;
                    
                    x = document.querySelectorAll("#overlay-api *");
                    y = document.querySelectorAll("#overlay-api div");
                    y = y[1];
                    for( i=0; i < x.length; i++) { 
                    if ( x[i].nodeName.toLowerCase() !== 'img' && x[i].nodeName.toLowerCase() !== 'div' ) { 
                            x[i].style.display = 'none';
                       } else if ( x[i].nodeName.toLowerCase() === 'img' ) {
                            y.appendChild(x[i]);
                       }
                    }
                    overlay.style.display = "block";
                } );
                request.send();
            }
        }
    };
}
