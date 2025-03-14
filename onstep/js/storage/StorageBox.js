
const storageBox = new Map();
const subscribers = new Set();

const StorageBox = {

    getItem(key) {
        return storageBox.get(key);
    }, 

    setItem(key, value) {
        storageBox.set(key, value);
        subscribers.forEach((callback) => callback());
    }, 

    deleteItem(key) {
        storageBox.delete(key);
        subscribers.forEach((callback) => callback());
    }, 
    
    getSnapshot() {
        return storageBox;
    },
    
    subscribe(callback) {
        subscribers.add(callback);
        return () => subscribers.filter(cb => cb !== callback);
    }
}

export default StorageBox;
