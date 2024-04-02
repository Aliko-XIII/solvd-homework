//reverse string
const reverseStr = str => [...str].reverse().join('');
//remove non-digit chars
const numStr = str => str.replace(/\D/g, '');
//num str to num arr
const toNumArr = str => [...str].map(char => +char)


// Functions to Implement:
// String.plus(string): This function should take another string as input and return
//  the result of adding the two strings together.

String.prototype.plus = function (arg) {
    const [nums1, nums2] = [reverseStr(numStr(this)), reverseStr(numStr(arg))];
    let res = '';

    const len = nums1.length >= nums2.length ? nums1.length : nums2.length;
    let mem = 0;
    let i = 0;
    //iterate and add digits sum to res till no values in memory and no digits left
    while (i < len || mem != 0) {
        let curSum =
            (nums1[i] !== undefined ? +nums1[i] : 0) +
            (nums2[i] !== undefined ? +nums2[i] : 0) +
            mem;
        mem = curSum > 9 ? +curSum.toString()[0] : 0;
        res += curSum > 9 ? curSum.toString()[1] : curSum.toString();
        i++;
    }
    return [...res].reverse().join('');
}

//examples:
// console.log("4231".plus('3262621'))
// console.log("979995325525129991".plus('14231452155215351'))

// String.minus(string): This function should take another string as input 
// and return the result of subtracting the second string from the first string.
// Note that the first parameter will always be greater than the second parameter.
String.prototype.minus = function (arg) {
    if (+numStr(this) < +numStr(arg)) {
        return;
    }


    //get equal length arrs of num digits
    const [numArr1, numArr2] = [
        toNumArr(reverseStr(numStr(this))),
        toNumArr(reverseStr(numStr(arg)))];
    while (numArr2.length < numArr1.length) {
        numArr2.push(0);
    }

    //iterate substracting numArr2 digits from numArr1 digits
    for (let i = 0; i < numArr1.length; i++) {
        if (numArr1[i] < numArr2[i]) {
            numArr1[i] += 10;
            let j = 1;
            while (numArr1[i + j] < numArr2[i + j]) {
                numArr1[i + j] += 9;
                j++;
            }
            numArr1[i + j] -= 1;
        }
        numArr1[i] -= numArr2[i];
    }

    return numArr1.reverse().join('');
}

// examples:
// console.log('6043532453545324523544214'.minus('515324523452534234'));




// String.multiply(string): This function should take another string as input and return
// the result of multiplying the two strings together.
String.prototype.multiply = function (arg) {
    const [numArr1, numArr2] = [
        toNumArr(reverseStr(numStr(this))),
        toNumArr(reverseStr(numStr(arg)))];
    const multParts = [];

    let mem = 0
    for (let i = 0; i < numArr1.length; i++) {
        let iter = '';
        //multiply digits of num2 by num1 digit and add remembered
        for (let j = 0; j < numArr2.length; j++) {
            const curMult = numArr1[i] * numArr2[j] + mem;
            if (curMult > 9) {
                mem = +curMult.toString()[0];
                iter += curMult.toString()[1];
            }
            else {
                mem = 0;
                iter += curMult.toString()[0];
            }
        }
        iter += mem;
        //get iteration result and add '0's depending on iteration number
        iter = reverseStr(iter);
        for (let j = 0; j < i; j++) {
            iter += '0';
        }
        mem = 0;
        multParts.push(iter);
    }
    //return all iterations' sum
    return multParts.reduce(
        (acc, val) => acc.plus(val), '');

}
// console.log('324325432532452345235234'.multiply('44332523452345341212421'));


// String.divide(string): This function should take another string as input and return
// the result of dividing the first string by the second string. Division should only
// result in an integer value.
String.prototype.divide = function (arg) {
    let [dividend, divisor] = this.length > arg.length ?
        [numStr(this), numStr(arg)] :
        [numStr(arg), numStr(this)];
    let res = '';

    let dividendPart = '';
    let curDivisor = divisor;
    let quotientPart = 0;
    while (dividend.length > 0) {
        //add '0' to result if we need to add another digit
        if (dividendPart.length == 0) {
            res += '0';
        }
        //add digits from the dividend till can subtract
        while (+dividendPart < +divisor) {
            dividendPart += dividend[0];
            if (dividend.length > 1) {
                dividend = dividend.substring(1);
            }
            else {
                dividend = '';
            }
        }
        if (dividendPart == undefined) {
            break
        }

        //multiply divisor by the digit which will go to result
        while (+(quotientPart + 1).toString().multiply(divisor) <= +dividendPart) {
            quotientPart++;
        }
        curDivisor = quotientPart.toString().multiply(divisor);

        //subtract multiplied divisor and remember remainder for next iteration
        dividendPart = dividendPart.minus(curDivisor);
        if (dividendPart == undefined) { dividendPart = '' }
        res += quotientPart;
        
        quotientPart = 0;
    }
    while (res[0] == '0') {
        res = res.slice(1);
    }
    return res;
}
//  console.log('53289457903284579823475903247509843275983420752345'.divide('1232142134123441232'));
//  console.log('3333333333333333333333333333333'.divide('3'));

