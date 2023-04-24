import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useState, useEffect, useRef } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

ChartJS.defaults.color = 'white'

import styles from '@/styles/Home.module.scss'
import Table from '@/components/Table'
import { regex, ONEKGINLBS, sortArray } from '@/utils'

const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const [inputNumber, setInputNumber] = useState('')
  const [weightArr, setWeightArr] = useState([])
  const suffixRef = useRef(null)

  const data = {
    labels: [...weightArr.map(item => item.date)],
    datasets: [
      {
        data: [...weightArr.map(item => item.weightInKg)],
        backgroundColor: 'aqua',
        borderColor: 'black',
        pointBorderColor: 'aqua',
        fill: true,
        tension: 0.4
      }
    ]
  }
  const options = {
    plugins: {
      legend: false
    },
    scales: {
      y: {
        min: Math.min(...weightArr.map(item => item.weightInKg)) - 2,
        max: Math.max(...weightArr.map(item => item.weightInKg)) + 2
      }
    }
  }


  useEffect(() => {
    const tempArr = []
    Object.keys(localStorage).forEach(key => {
      if(key.match(regex)) {
        tempArr.push(JSON.parse(localStorage.getItem(key)))
      }
    })
    setWeightArr(tempArr.sort(sortArray))
  },[])

  useEffect(() => {
    weightArr.forEach(entry => {
      localStorage.setItem(entry.date, JSON.stringify(entry))
    })
  }, [weightArr])
  
  function onInputChange(e) {
    const number = e.target.value

    if (!number || number.match(/^\d{1,}(\.\d{0,4})?$/)) {
      setInputNumber(number)
      const width = getTextWidth(number, '30px "Inter", sans-serif')
      suffixRef.current.style.left = width + 'px'
    }
  }

  function addWeight(e) {
    e.preventDefault()
    if(inputNumber) {
      const date = new Date()
      const day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
      const month = date.getMonth() >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
      const dateString = `${day}/${month}/${date.getFullYear()}`
      const alreadyAdded = weightArr.find(entry => entry.date === dateString)
      const weightInLbs = (+inputNumber * ONEKGINLBS).toFixed(2)

      if(alreadyAdded) {
        setWeightArr(prev => {
          const updatedArr = prev.filter(entry => entry.date !== alreadyAdded.date)
          updatedArr.unshift({date: dateString, weightInKg: inputNumber, weightInLbs: weightInLbs})
          return updatedArr
        })
      } else {
        setWeightArr(prev => [{date: dateString, weightInKg: inputNumber, weightInLbs: weightInLbs}, ...prev])
      }
    }
  }

  function getTextWidth(text, font) {
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return Math.ceil(metrics.width);
  }

  return (
    <>
      <Head>
        <title>Weight Tracker</title>
        <meta name="description" content="Weight tracker app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div>
          <h1 className={styles.title}>Weight Tracker</h1>
          <p>Weigh yourself everyday and get an average for each week.</p>
        </div>

        <hr className={styles.break} />

        <form className={styles.myForm} onSubmit={addWeight}>
          <input 
            type="text" 
            maxLength={10}
            placeholder='Enter weight' 
            onChange={onInputChange}
            value={inputNumber}
            className={`${styles.weightInput}`}
          />
          <span ref={suffixRef} className={`${styles.suffix} ${!inputNumber && styles.invisible}`}>kg</span>
          <button className={styles.btn} type='submit'>Add/Change last</button>
        </form>

        <div className={styles.tableContainer}>
          <Table weightArr={weightArr} />

          <Table weightArr={weightArr} isAverage={true} />
        </div>

        <div className={styles.chartContainer}>
          <Line
            data={data}
            options={options}
          ></Line>
        </div>
      </main>
    </>
  )
}
