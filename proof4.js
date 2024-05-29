/* eslint-disable */

const funcion1 = (param) => {
    return new Promise(res => {
        let time = 0
        if(param < 5){
            time = 500
        }
        setTimeout(() => {
            console.log('Param: ', param)
            res(1)
        },time)
    })
}
const array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14]

for (const number of array){
    await funcion1(number)
}
