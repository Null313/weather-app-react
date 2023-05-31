import { useState, useRef } from "react"
import anyAscii from "any-ascii"
import { useHotkey } from "@react-hook/hotkey"

const App = () => {
  const [fetchState, setFetchState] = useState<null | object | any>(null)
  const [query, setQuery] = useState<string>('')
  const inputRef = useRef(null)
  const getWeatherInfo = async (query: string) => {
    const data = await (await fetch(`https://api.weatherapi.com/v1/current.json?key=d1d0e09ae144437f9ad153247233105&q=${query}&lang=tr`)).json()
    setFetchState(data)
    console.log(data)
    return fetchState
  }
  const spotWindDirection = (direction: string) => {
    switch (direction) {
      case "N":
        return 'North'
      case "NE":
        return 'North East'
      case "E":
        return 'East'
      case "SE":
        return 'East South'
      case "S":
        return 'South'
      case "SW":
        return 'South West'
      case "W":
        return 'West'
      case "NW":
        return 'North West'
      default:
        return null
    }
  }
  useHotkey(inputRef, 'enter', () => {
    const asciiQuery = anyAscii(query)
    getWeatherInfo(asciiQuery)
  })
  return (
    <div className='w-full h-full flex flex-col items-center gap-y-16 first:mt-10'>
      <div className='flex gap-x-3'>
        <input ref={inputRef}
         type="text" className='m-30 bg-black outline-none border-white/60 focus:border-white/100 border-[1px] sm:w-10 md:w-[30rem] rounded transition py-2 px-3 text-lg' placeholder="Search for a city"  onChange={e => setQuery(e.target.value)}/>
        <button className="transition bg-white text-black hover:bg-black hover:text-white border-[1px] border-white rounded py-2 px-3" onClick={() => {
          const asciiQuery = anyAscii(query)
          getWeatherInfo(asciiQuery)
        }} disabled={fetchState?.ok}>
          Search
        </button>
      </div>
      <div>
        {fetchState && (
          <>
            {fetchState.error ? (
              <div>{fetchState.error.message}</div>
            ) : (
              <div className='flex flex-col items-center'>
                <div className='flex gap-x-2 items-center'>
                  <h1 className='text-3xl md:text-5xl'>{fetchState?.location.name !== fetchState?.location.region ? `${fetchState?.location.region},` : ''} {fetchState?.location.name},</h1>
                  <span className='text-3xl md:text-5xl'>
                    {fetchState?.current.temp_c}°C / {fetchState?.current.temp_f}°F
                  </span>
                  <img src={`https:${fetchState.current.condition.icon}`} alt="Icon" />
                </div>
                <div id="location-info" className='flex flex-col items-center'>
                  <span>Country: {fetchState?.location.country}</span>
                  <span>Time: {fetchState.location.localtime.split(' ')[1]}</span>
                  {spotWindDirection(fetchState.current.wind_dir) != null && (
                    <span>Wind Direction: {spotWindDirection(fetchState.current.wind_dir)}</span>
                  )}
                  <span>Wind Degree: {fetchState.current.wind_degree}°</span>
                  <span>Wind Speed: {fetchState.current.wind_kph} km/h</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App