import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Spline from "@splinetool/react-spline";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const App = () => {
  const [input, setinput] = useState("");
  const [data, setdata] = useState(null);
  const [dataGenerated, setdataGenerated] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [filterdCities, setfilterdCities] = useState([])
  const cities = [
    "Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai","Vadodara","Hyderabad", "Jaipur", "Goa", "Pune", "Agra",
    "New York", "Los Angeles", "Chicago", "San Francisco", "Miami", "Las Vegas", "Houston", "Seattle", "Boston",
    "Paris", "Lyon", "Marseille", "Bordeaux", "Nice", "Toulouse", "Lille",
    "Tokyo", "Kyoto", "Osaka", "Hiroshima", "Nagoya", "Yokohama", "Sapporo",
    "Rio de Janeiro", "São Paulo", "Brasília", "Salvador", "Fortaleza", "Curitiba",
    "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra",
    "Rome", "Venice", "Florence", "Milan", "Naples", "Verona", "Turin",
    "London", "Manchester", "Birmingham", "Liverpool", "Edinburgh", "Bristol", "Glasgow",
    "Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Quebec City", "Edmonton",
    "Cape Town", "Johannesburg", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein",
    "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah","Hello","Nope",
    "Mexico City", "Cancun", "Guadalajara", "Monterrey", "Tulum", "Puebla",
    "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Chengdu", "Wuhan",
    "Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne", "Düsseldorf", "Stuttgart",
    "Moscow", "Saint Petersburg", "Sochi", "Kazan", "Novosibirsk"
  ];
  
  function handleInputChange(e){
    setinput(e.target.value)
    console.log(input)
    const newCities = cities.filter((item)=>(
      item.toLowerCase().includes(input.toLowerCase())
    ))
    setfilterdCities(input ? newCities : [])
    console.log(filterdCities)
  }

  function handleSuggesstionClick(suggestion){
    setinput(suggestion)
    setfilterdCities([])
  }

  const fetchData = async () => {
    if (input.trim() !== "") {
      setShowSkeleton(true)
      const url = `https://api.weatherapi.com/v1/current.json?key=8804429c39e642cf856120858252502&q=${input.trim()}&aqi=yes`;
      try {
        const response = await axios.get(url);
        setdata(response.data); // Save API response to state
        setTimeout(()=>{
          setShowSkeleton(false)
          setdataGenerated(true);
          setinput("");
          toast.success("Data Fetched Successfully !", {});
        },1000)
      } catch (error) {
        // console.error("HTTP Request Error:", error);
        setShowSkeleton(false)
        toast.warning("Data Not Found !", { theme: "dark" });
      }
    } else {
      toast.info("Atleast Write Something !", {});
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="w-full select-none">
      <div className="absolute left-[30%] top-[50%] transform -translate-x-1/2 -translate-y-1/2  w-[30rem] border-[3px] border-white p-4 rounded-xl mt-4 mb-4">
        <div className="flex justify-between ">
          <div>
          <input
            type="text"
            placeholder="Enter A City Name.."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchData(); // Fetch data when Enter key is pressed
              }
            }}
            className="relative bg-white w-[19.4rem] text-black p-2 text-[1.5rem] font-medium rounded border-blue-500 border-2 "
          />
          {
            filterdCities.length > 0 ? (
              <ul className="absolute w-[19.4rem] max-h-[5.8rem] rounded-b-xl overflow-y-hidden text-black text-[1.2rem] bg-sky-300">
                {
                  filterdCities.map((city,idx)=>(
                    <li 
                    key={idx}
                    className="p-2 hover:bg-sky-200 hover:rounded-b-xl cursor-pointer"
                    onClick={(e)=>{
                      handleSuggesstionClick(e.target.innerText)
                    }}
                    >{city}</li>
                  ))
                }
              </ul>
            ) : null
          }
          </div>
          <button
            className="h-[3.3rem] text-xl text-white p-2 bg-emerald-400 border-white border-[3px] rounded active:scale-95 cursor-pointer hover:bg-teal-600 hover:text-black transition ease-in font-medium "
            onClick={() => {
              fetchData();
            }}
          >
            Fetch Data
          </button>
        </div>
        {/* Whether Container */}
        {dataGenerated ? (
          <div
            className={`p-3 mt-5 w-full  border-4 border-l-amber-600 border-r-blue-500 border-emerald-400 rounded-2xl 
        ${
          Boolean(data.current.is_day)
            ? "bg-gradient-to-tr from-[#7faca6] via-[#40aab6] to-[#0083ff]"
            : "bg-gradient-to-t from-[#061d45] via-[#0b1c4d] to-[#33085e]"
        }
        
        `}
          >
            <div className="flex justify-center">
              {Boolean(data.current.is_day) ? (
                <i className="ri-sun-line w-[200px] text-[130px] ml-18"></i>
              ) : (
                <i className="ri-moon-clear-fill w-[200px] text-[130px] ml-18"></i>
              )}
            </div>
            <p className="text-center text-7xl font-medium mb-4">
              {Math.round(data.current.temp_c)}
              <i className="ri-celsius-line"></i>
            </p>
            <h1 className="text-center text-[25px] font-semibold mb-4">
              {data.location.name} , <span>{data.location.region}</span>
            </h1>
            <p className="text-center text-[16px] font-semibold mb-4">
              Feels Like : {data.current.feelslike_c}
              <i className="ri-celsius-line"></i>
            </p>
            <p className="text-center text-xl font-semibold mb-4">
              Country : {data.location.country}
            </p>
            <p className="text-center text-[17px] font-semibold mb-4">
              Time Zone : {data.location.tz_id}
            </p>

            <div
              className="h-[6rem]"
            >
              <div
                className="flex justify-between ml-4 mr-4"
              >
                <p className="text-center text-[34px] font-semibold mb-4">
                  <i className="ri-drop-line text-3xl"></i>{" "}
                  {data.current.humidity}%
                </p>
                <p className="text-center text-[34px] font-semibold mb-4">
                  <i className="ri-windy-line text-3xl"></i>{" "}
                  {data.current.wind_kph} KM/H
                </p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-[18px] absolute bottom-[8%] left-[14%]">
                    Humidity
                  </p>
                </div>
                <div>
                  <p className="text-[18px] absolute  bottom-[8%] right-[23%]">
                    Wind Speed
                  </p>
                </div>
              </div>
            </div>

            <p className="text-[12px] text-end">
              Last Updated At : {data.current.last_updated}
            </p>
          </div>
        ) :
        showSkeleton ? 
        (
          <div
            className={`p-3 mt-5 w-full bg-[#acacac] border-4 border-l-amber-600 border-r-blue-500 border-emerald-400 rounded-2xl 
              `}
          >
            {/* Top Image */}
            <div className="w-35 h-35 m-auto">
              <SkeletonTheme baseColor="#dadada">
              <Skeleton className="h-full"/>
              </SkeletonTheme>
            </div>
            <div className="flex justify-center items-center">
            <div className="h-[70px] w-32 mt-5 ">
            <SkeletonTheme baseColor="#dadada">
              <Skeleton className="h-full"/>
              </SkeletonTheme>
            </div>
            </div>
            <div className="flex justify-center items-center">
            <div className="h-[50px] w-65 mt-5">
            <SkeletonTheme baseColor="#dadada">
              <Skeleton className="h-full"/>
              </SkeletonTheme>
            </div>
            </div>
            <div className="flex justify-center items-center">
            <div className="h-[30px] w-45 mt-5">
            <SkeletonTheme baseColor="#dadada">
              <Skeleton className="h-full"/>
              </SkeletonTheme>
            </div>
            </div>
            <div className="flex justify-center items-center">
            <div className="h-[38px] w-50 mt-5">
            <SkeletonTheme baseColor="#dadada">
              <Skeleton className="h-full"/>
              </SkeletonTheme>
            </div>
            </div>
            <div className="flex justify-center items-center">
            <div className="h-[31px] w-60 mt-5">
            <SkeletonTheme baseColor="#dadada">
              <Skeleton className="h-full"/>
              </SkeletonTheme>
            </div>
            </div>   
            <div className="flex justify-between h-[90px] w-[90%] mt-5 text-black m-auto">
            <div className="w-full h-full">
            <SkeletonTheme baseColor="#dadada">
              <Skeleton className="h-full"/>
              </SkeletonTheme>
            </div>
            </div>
         </div>
        )
        :
        null
        }
        {/* showing skeleton effect */}
      

      </div>
      {dataGenerated ? (
        <div className="absolute top-0 right-[16%] w-[30rem] h-[100vh] pointer-events-none">
          {Boolean(data.current.is_day) ? (
            <Spline scene="https://prod.spline.design/Y7CEdngHraLmFuH4/scene.splinecode" />
          ) : (
            <Spline scene="https://prod.spline.design/dQYnDLnuVnxsZvvl/scene.splinecode" />
          )}
        </div>
      ) : null}
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default App;
