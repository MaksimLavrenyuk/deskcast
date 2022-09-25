export type FromRendererToMainEvents = {
  GET_DESKTOP_CAPTURE_SOURCES: void
  GET_WATCHER_LINK: void
}

export type FromMainToRendererEvents = {
  DESKTOP_CAPTURE_SOURCES:{
    sources: {
      id: string,
      name: string
    }[]
  },
  WATCHER_LINK: {
    link: string
  }
}

export type FromMainToRendererListener<Event extends keyof FromMainToRendererEvents> = {
  (payload: FromMainToRendererEvents[Event]): void
}

export interface IpcRendererManager {
  send<Event extends keyof FromRendererToMainEvents>(event: Event, payload?: FromRendererToMainEvents[Event]): void
  on<Event extends keyof FromMainToRendererEvents>(event: Event, listener: FromMainToRendererListener<Event>): void
}

export type FromRendererToMainListener<Event extends keyof FromRendererToMainEvents> = {
  (payload: FromRendererToMainEvents[Event]): void
}

export interface IpcMainManager {
  send<Event extends keyof FromMainToRendererEvents>(event: Event, payload?: FromMainToRendererEvents[Event]): void
  on<Event extends keyof FromRendererToMainEvents>(event: Event, listener: FromRendererToMainListener<Event>): void
}
