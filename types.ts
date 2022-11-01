import WorkerEntity from "./entity/WorkerEntity.ts";

export interface Slide {
  key: string;
  size: number;
  updated: string;
  download: string;
}

export interface Worker {
  socket: WebSocket;
  entity?: WorkerEntity;
  serial?: string;
  spacing?: number;
}

export enum Action {
  RequestVerification = 0,
  RespondVerification = 1,
  RequestIdentity = 2,
  RespondIdentity = 3,
  RequestStatus = 4,
  RespondStatus = 5,
  RequestPing = 6,
  RespondPing = 7,
  RequestOpen = 8,
  RespondOpen = 9,
  RequestState = 10,
  RespondState = 11,
  RequestInterval = 12,
  RespondInterval = 13,
}

export class RequestAbstract {
  public action: Action;

  constructor(action: Action) {
    this.action = action;
  }
}

export class RespondAbstract {
  public action: Action;

  constructor(action: Action) {
    this.action = action;
  }
}

export class RequestIdentity extends RequestAbstract {
  constructor() {
    super(Action.RequestIdentity);
  }
}

export class RespondIdentity extends RespondAbstract {
  uuid: string;

  constructor(uuid: string) {
    super(Action.RespondIdentity);

    this.uuid = uuid;
  }
}

export class RequestPing extends RequestAbstract {
  constructor() {
    super(Action.RequestPing);
  }
}

export class RespondPing extends RespondAbstract {
  constructor() {
    super(Action.RespondPing);
  }
}

export class RequestOpen extends RequestAbstract {
  uuid: string;
  slides: Slide[];

  constructor(uuid: string, slides: Slide[]) {
    super(Action.RequestOpen);

    this.uuid = uuid;
    this.slides = slides;
  }
}

export class RespondOpen extends RespondAbstract {
  constructor() {
    super(Action.RespondOpen);
  }
}

export class RequestState extends RequestAbstract {
  playing: boolean;

  constructor(playing: boolean) {
    super(Action.RequestState);

    this.playing = playing;
  }
}

export class RespondState extends RespondAbstract {
  constructor() {
    super(Action.RespondState);
  }
}

export class RequestInterval extends RequestAbstract {
  spacing: number;

  constructor(spacing: number) {
    super(Action.RequestInterval);

    this.spacing = spacing;
  }
}

export class RespondInterval extends RespondAbstract {
  constructor() {
    super(Action.RespondInterval);
  }
}
