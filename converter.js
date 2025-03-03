const inputField = document.getElementById('input-temp');
const fromUnitField = document.getElementById('input-unit');
const toUnitField = document.getElementById('ouput-unit');
const ouputField = document.getElementById('ouput-temp');
const form = document.getElementById('converter');

function convertTemp(value,fromUnit,toUnit){



    if(fromUnit==='c'){
        if(toUnit==='f'){
            return value *9 / 5 + 32;
        } else if(toUnit=== 'k'){
            return value + 273.15;
        }
        return value;
    }


    if(fromUnit==='f'){
        if(toUnit==='c'){
            return (value - 32 ) * 5 / 9 ;
        } else if(toUnit=== 'k'){
            return (value + 459.67) * 5 / 9 ;
        }
        return value;
    }



    if(fromUnit==='k'){
        if(toUnit==='c'){
            return value - 273.15  ;
        } else if(toUnit=== 'f'){
            return value * 9 / 5 - 495.67;
        }
        return value;
    }

    throw new Error ('Unidad Invalida');

}

form.addEventListener('input',() => {
const inputTemp = parseFloat (inputField.value);
const fromUnit = fromUnitField.value;
const toUnit =toUnitField.value;
const ouputTemp = convertTemp(inputTemp,fromUnit,toUnit);

ouputField.value = (Math.round(ouputTemp *100 )/100) + ' ' + toUnit.toUpperCase();


});