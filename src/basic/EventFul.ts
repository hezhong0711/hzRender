export default abstract class EventFul {
    static getEventName(eventName: string, id: string) {
        return `${eventName}-${id}`
    }

    private eventMap: Map<string, Event> = new Map<string, Event>()

    protected constructor() {}

    isSilent(event: string) {
        return this.eventMap.get(event) == null
    }

    off(event: string) {
        this.eventMap.delete(event)
        return this
    }

    on(event: string, handler: () => void) {
        this.eventMap.set(event, new Event(event, handler))
        return this
    }

    trigger(event: string) {
        const e = this.eventMap.get(event)
        if (e != null) {
            e.handler.apply(e)
        }
    }

    click() {}
}

class Event {
    event: string
    handler: () => void

    constructor(event: string, handler: () => void) {
        this.event = event
        this.handler = handler
    }
}

export class EventType {
    static onTouchStart: string = 'onTouchStart'
    static onTouchEnd: string = 'onTouchEnd'
    static onTouchMove: string = 'onTouchMove'
}
