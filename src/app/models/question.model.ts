
import { Choice } from './choice.model';

export class Question {

    _id: String;
    question: String;
    isQuestionTypeBoolean: Boolean = false;
    choices: Choice[];

}