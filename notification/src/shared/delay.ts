export class Delay {
  public static async wait(timeInMilliseconds: number) {
    return await new Promise(resolve => setTimeout(resolve, timeInMilliseconds))
  }
}
