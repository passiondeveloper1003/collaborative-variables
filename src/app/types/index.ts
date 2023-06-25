export interface Question {
    id: number;
    questionText: string;
    questionVar: string;
    questionType: QuestionType;
    campaignId?: string;
    answers?: string;
}

export enum QuestionType {
    Number = 'number',
    String = 'string',
}

export enum QuestionOptions {
    ONE = 'one',
    TWO = 'two',
    OTHERS = 'others'
}

const _defaultQuestion: Question = {
    id: 0,
    questionText: '',
    questionVar: '',
    questionType: QuestionType.Number,
}

export const defaultQuestion : Question = JSON.parse(JSON.stringify(_defaultQuestion));


