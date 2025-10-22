export interface ClassificationRecordResponse {
  id: number;
  classificationStageId: number;
  stageName: string;
  highQualifiedCount?: number;
  qualifiedCount?: number;
  unqualifiedCount?: number;
  notes: string;
}
