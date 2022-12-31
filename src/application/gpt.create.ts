import GptExternal from '../domain/gpt/gpt-external.repository';
import GptRepository from '../domain/gpt/gpt.repository';

export class GptCreate {
  private gptRepository: GptRepository;
  private gptExternal: GptExternal;
  constructor(respositories: [GptRepository, GptExternal]) {
    const [gptRepository, gptExternal] = respositories;
    this.gptRepository = gptRepository;
    this.gptExternal = gptExternal;
  }

  public async sendResponseAndSave({ prompt }: { prompt: string }) {
    const responseDbSave = await this.gptRepository.save({ prompt }); //TODO DB
    const responseExSave = await this.gptExternal.sendRes({ prompt }); //TODO enviar a ws
    return { responseDbSave, responseExSave };
  }
}
