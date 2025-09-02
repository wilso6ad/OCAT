import { inject, injectable } from 'inversify';
import { IAssessmentRepository } from '../../../contracts';
import { Assessment, IUseCase } from '../../../../types';

@injectable()
export class GetAssessmentListUseCase implements IUseCase<void, Assessment[]> {
  public constructor(
    @inject(IAssessmentRepository) private assessmentRepository: IAssessmentRepository,
  ) {}

  public async execute(): Promise<Assessment[]> {
    try {
      // Use the assessmentRepository.findAll() method to get all assessments
      const assessments = await this.assessmentRepository.findAll();
      return assessments;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Unknown error`;
      throw new Error(`Failed to retrieve assessment list: ${errorMessage}`);
    }
  }
}
