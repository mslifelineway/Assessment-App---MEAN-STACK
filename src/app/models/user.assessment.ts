import { AnsweredAssessment } from './answered-assessment';
import { Choice } from './choice.model';
import { SelectedChoice } from './selected-choice.model';

//this model will store user test data
export class UserAssessment {
    _id: String;
    scored: Number;
    attempted: Number;
    date: Date;
    wrong: Number;
    answered: AnsweredAssessment[];

}