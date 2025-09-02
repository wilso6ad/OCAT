import { inject, injectable } from 'inversify';
import { IUseCase } from 'src/types/shared';
import { Assessment, CreateAssessmentDTO } from 'src/types';
import { IAssessmentRepository } from '../../../contracts';

@injectable()
export class CreateAssessmentUseCase implements IUseCase<CreateAssessmentDTO, Assessment> {
  public constructor(
    @inject(IAssessmentRepository) private assessmentRepository: IAssessmentRepository,
  ) {}

  public async execute(assessmentData: CreateAssessmentDTO): Promise<Assessment> {
    if (assessmentData.score < 0 || assessmentData.score > 5) {
      throw new Error(`Assessment score must be between 0 and 5`);
    }
    const calculatedRiskLevel = this.calculateRiskLevel(assessmentData.score);

    if (assessmentData.riskLevel !== calculatedRiskLevel) {
      throw new Error(`Invalid risk level. Expected ${calculatedRiskLevel} based on score ${assessmentData.score}`);
    }

    const assessment = await this.assessmentRepository.create({
      ...assessmentData,
      riskLevel: calculatedRiskLevel,
    });

    return assessment;
  }

  private calculateRiskLevel(score: number): string {
    if (score >= 4) {
      return `high`;
    }
    if (score >= 2) {
      return `medium`;
    }
    return `low`;
  }
}
