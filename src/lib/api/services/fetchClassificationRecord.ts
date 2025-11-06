export interface ClassificationRecordResponse {
  id: number;
  classificationStageId: number;
  stageNumber: string;
  highQualifiedCount: number;
  showQualifiedCount: number;
  pondQualifiedCount: number;
  cullQualifiedCount: number;
  notes: string;
}
