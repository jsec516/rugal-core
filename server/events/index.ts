import { EventEmitter } from "events";

class EventRegistry extends EventEmitter {
    onMany(arr, onEvent) {
        arr.forEach((eventName) => {
            this.on(eventName, onEvent);
        });
    }
}

let EventRegistryInstance = new EventRegistry();
EventRegistryInstance.setMaxListeners(100);

export default EventRegistryInstance;
