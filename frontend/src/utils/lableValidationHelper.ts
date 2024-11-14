import {FieldConstraints} from "../constants/fieldConstraints";
import bigDecimal from "js-big-decimal";

const barrierConst = -1000;

const setIntValidationText = (val: string, curConst: FieldConstraints) => {
    if (curConst.min >= barrierConst) val += ` не меньше ${curConst.min}`
    return val
}

const setLongValidationText = (val: string, curConst: FieldConstraints) => {
    if (curConst.min >= BigInt(barrierConst)) val += ` не меньше ${curConst.min}`
    return val
}

const setFloatValidationText = (val: string, curConst: FieldConstraints) => {
    if (curConst.min.compareTo(new bigDecimal(barrierConst)) >= 0) val += `не меньше ${curConst.min}`
    return val
}

const setTextValidationText = (val: string, curConst: FieldConstraints) => {
    val = "Введите строку. Значение" + (!curConst.blank_able ? " не " : " ") + "может быть пустым.";
    if (curConst.nullable !== undefined && curConst.nullable) val += '\nОтметьте чекбокс, чтобы не заполнять значение';
    return val

}

export function makeValidationLabel(curConst: FieldConstraints) {
    console.log('nullable is: ', curConst.nullable)
    let validationText: string = '';
    if (curConst.dataType === "text") validationText = setTextValidationText(validationText, curConst);
    else {
        validationText = `Введите ${curConst.inputComment} число`;
        switch (curConst.dataType) {
            case "int":
                validationText = setIntValidationText(validationText, curConst);
                break
            case "long":
                validationText = setLongValidationText(validationText, curConst);
                break
            case "float":
                validationText = setFloatValidationText(validationText, curConst);
                break
        }
        validationText += '.'
        if (curConst.nullable) validationText += '\nОставьте поле полностью пустым, чтобы не заполнять значение'
    }
    return (validationText[validationText.length - 1] === '.' ? validationText : validationText + '.')
}

