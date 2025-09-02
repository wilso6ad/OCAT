import { IAssessmentRepository } from '../../application/contracts';
import { Assessment as AssessmentType } from '../../types';
import { Assessment } from '../sequelize/models';

export class AssessmentRepository implements IAssessmentRepository {
  public async create(assessmentData: Partial<AssessmentType>): Promise<AssessmentType> {
    try {
      // Use Sequelize's .create() function as mentioned in the hint
      const assessment = await Assessment.create(assessmentData);
      return assessment.toJSON() as AssessmentType;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Unknown error`;
      throw new Error(`Failed to create assessment: ${errorMessage}`);
    }
  }

  public async findAll(): Promise<AssessmentType[]> {
    try {
      const assessments = await Assessment.findAll();
      return assessments.map((assessment) => assessment.toJSON() as AssessmentType);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Unknown error`;
      throw new Error(`Failed to find all assessments: ${errorMessage}`);
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const deletedCount = await Assessment.destroy({
        where: { id },
      });
      return deletedCount > 0;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : `Unknown error`;
      throw new Error(`Failed to delete assessment: ${errorMessage}`);
    }
  }
}
