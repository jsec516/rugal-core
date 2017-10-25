export function init() {
    return new Perf();
}

export class Perf {
    private beginTime;
    private endTime;

    constructor() {
        this.beginTime = 0;
        this.endTime = 0;
    }

    start() {
        this.beginTime = Date.now();
    }

    end() {
        this.endTime = Date.now();
    }

    result() {
        let timeSpent = (this.endTime-this.beginTime) + " ms";
        return timeSpent;
    }
    
}