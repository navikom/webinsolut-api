declare module "datauri" {
  interface IDatauri {
    new(): IDatauri;

    format(path: string, buffer: Buffer): { content: string };
  }

  const Datauri: IDatauri;
  export default Datauri;
}
