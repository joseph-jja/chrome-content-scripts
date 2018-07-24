class SystemInformation {

    constructor(name, methodCall) {
        this.name = name;
        this.methodCall = methodCall;
    }

    preRender(data) {
        console.log(this.name);
    }

    postRender() {
        console.log(this.name);
    }

    render() {

        chrome.system[this.name][this.methodCall](data => {
            preRender(data);
            if (component === 'cpu') {
                postRender();
            }
        });
    }

}
