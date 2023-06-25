import { QuestionType } from "../types";

export class QuesionModel {
    id: string;
    questionText: string;
    questionVar: string;
    questionType: QuestionType;
    campaignId?: string;
}
