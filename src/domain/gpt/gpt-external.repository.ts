export default interface GptExternal {
  sendRes({ prompt }: { prompt: string }): Promise<any>;
}
