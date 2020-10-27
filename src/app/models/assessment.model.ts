import { Question } from './question.model';

export class Assessment {
    _id: string;
    name: string;
    questions: Question[];
}