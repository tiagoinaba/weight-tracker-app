

export default function Table({ weightArr, isAverage = false }) {

    function tableElements() {
        const reversedArr = [...weightArr].reverse()
        if(!isAverage) {
            return weightArr.map(entry => {
                return (
                    <tr key={entry.date}>
                        <td>{entry.date}</td>
                        <td>{entry.weightInKg}kg</td>
                    </tr>
                )
            })
        } else {
            const tempArr = []
            if(reversedArr.length % 7 === 0) {
                for(let i=0; i<reversedArr.length; i+=7) {
                    const firstIndex = i
                    const lastIndex = i + 6
                    const weightsOnly = reversedArr.slice(i, i+7).map(entry => entry.weightInKg)
                    tempArr.push((
                        <tr key={reversedArr[i].date}>
                            <td>{`${reversedArr[lastIndex].date} - ${reversedArr[firstIndex].date}`}</td>
                            <td>{getAverage(weightsOnly)}kg</td>
                        </tr>
                    ))
                }
            } else {
                if(reversedArr.length < 7) {
                    const firstIndex = 0
                    const lastIndex = (reversedArr.length) - 1
                    const weightsOnly = reversedArr.slice(firstIndex, lastIndex +1).map(entry => entry.weightInKg)
                    tempArr.push((
                        <tr key={reversedArr[firstIndex].date}>
                            <td>{`${reversedArr[firstIndex].date} - ${reversedArr[lastIndex].date}`}</td>
                            <td>{getAverage(weightsOnly)}kg</td>
                        </tr>
                    ))
                } else {
                    const completeWeeks = Math.floor(reversedArr.length / 7)
                    for(let i=0; i < completeWeeks; i++) {
                        const firstIndex = i * 7
                        const lastIndex = firstIndex + 6
                        const weightsOnly = reversedArr.slice(firstIndex, lastIndex + 1).map(entry => entry.weightInKg)
                        tempArr.unshift((
                            <tr key={reversedArr[firstIndex].date}>
                                <td>{`${reversedArr[firstIndex].date} - ${reversedArr[lastIndex].date}`}</td>
                                <td>{getAverage(weightsOnly)}kg</td>
                            </tr>
                        ))
                    }
                    const firstIndex = completeWeeks * 7
                    const lastIndex = reversedArr.length - 1
                    const weightsOnly = reversedArr.slice(firstIndex).map(entry => entry.weightInKg)
                    tempArr.unshift((
                        <tr key={reversedArr[firstIndex].date}>
                            <td>{`${reversedArr[firstIndex].date} - ${reversedArr[lastIndex].date}`}</td>
                            <td>{getAverage(weightsOnly)}kg</td>
                        </tr>
                    ))
                }
            }
            return tempArr
        }
    } 

    function getAverage(arr) {
        let sum = 0

        arr.forEach(number => {
            sum += +number
        })


        return (sum / arr.length).toFixed(2)
    }

    const tableDate = isAverage ? "Date Range" : "Date"
    const tableWeight = isAverage ? "Average Weight" : "Weight"

    return (
        <table>
            <thead>
                <tr>
                    <th>{tableDate}</th>
                    <th>{tableWeight}</th>
                </tr>
            </thead>

            <tbody>
                {tableElements()}
            </tbody>
        </table>
    )
}