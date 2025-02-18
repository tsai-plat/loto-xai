export class RandomHelper {
  /**
   * Client
   * @param prefix xaim
   * @returns string
   */
  static clientUUID(prefix: string = 'xaim') {
    if (!prefix?.length) {
      const prex1 = (Math.random() * Math.pow(36, 1)) | 0;
      const prex2 = (Math.random() * Math.pow(36, 1)) | 0;
      prefix =
        prex1.toString(36).toUpperCase() + prex2.toString(36).toUpperCase();
    }

    const now = Date.now();
    const random = (Math.random() * Math.pow(36, 4)) | 0;
    const temp = `00000${random}`.slice(-4);
    const uuid = Number(`${now}${temp}`).toString(36);

    return `${prefix}_${uuid}`;
  }

  /**
   * url
   * @param prefix xbot
   * @returns string
   */
  static createChatid(prefix: string = 'xbot'): string {
    const random = (Math.random() * Math.pow(36, 2)) | 0;
    const id = Number(`${random}${Date.now()}`).toString(36);

    return prefix?.length ? `${prefix.toUpperCase()}_${id}` : id;
  }

  /**
   * random base time
   * @returns reqid string
   */
  static createReqid(prefix: string = 'xmob'): string {
    const v1 = (Math.random() * Math.pow(36, 3)) | 0;
    const v2 = (Math.random() * Math.pow(36, 3)) | 0;
    const suffix = Number(`${v1}${v2}`).toString(32);
    return `${prefix}.${Date.now().toString(32)}.${suffix}`;
  }

  /**
   *
   * @returns string
   */
  static createMsgid(): string {
    const prex1 = (Math.random() * Math.pow(36, 2)) | 0;
    const prex2 = (Math.random() * Math.pow(36, 2)) | 0;

    const prefix = Number(`${prex1}${prex2}`).toString(36);

    return `xmsg.${prefix}${Date.now().toString(36)}`;
  }
}
