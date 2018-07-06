
const self = this, 
      timeout = 5000;
onmessage = function(e) {

    //console.log(e.data);
    setTimeout(() => {
        self.postMessage({
            'timesUp': 'now'
        });       
    }, timeout); 
}
