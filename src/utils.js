const ONEKGINLBS = 2.20462262
const regex = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g

function sortArray(a, b) {
    const aArr = a.date.split('/')
    const bArr = b.date.split('/')
    if(aArr[2] < bArr[2]) {
        return 1
    } else if(aArr[1] < bArr[1]) {
        return 1
    } else if(aArr[0] < bArr[0]) {
        return 1
    } else {
        return -1
    }
}

export { ONEKGINLBS, regex, sortArray }