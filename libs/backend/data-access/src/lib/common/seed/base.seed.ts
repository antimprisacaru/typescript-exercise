export abstract class BaseSeed {
  abstract seed(): Promise<void>;
  abstract clean(): Promise<void>;
}
