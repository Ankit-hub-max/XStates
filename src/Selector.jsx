import { useState,useEffect } from "react";
const countryEndpoint="https://crio-location-selector.onrender.com/countries";
const stateEndpoint=(countryName)=>`https://crio-location-selector.onrender.com/country=${countryName}/states`;
const CityEndpoint=(countryName,stateName)=>`https://crio-location-selector.onrender.com/country=${countryName}/state=${stateName}/cities`;

function Selector(){
    //const countries=["india","china","usa","russia"];
    //const states=["NewDelhi","beijing","Washington DC","Moscow"];

    const[countries,setCountries]=useState([]);
    const [states,setStates]=useState([]);
    const[selectedCountry,setSelectedCountry]=useState("");
    const [cities,setCities]=useState([]);
    const[selectedstate,setSelectedState]=useState("");
    const [selectedCity, setSelectedCity] = useState("");

    useEffect(()=>{
        async function fetchCountries(){
            try{
                const response=await fetch(countryEndpoint);
                const data=await response.json();
                setCountries(data);
            }catch(error){
                console.log("Error fetching countries: ",error.message)

            }
        }
        fetchCountries();
    },[]);

    useEffect(()=>{
        async function fetchStates(){
            if(!selectedCountry) return;
            try{
                const response=await fetch(stateEndpoint(selectedCountry));
                const data=await response.json();
                setStates(data);
            }catch(error){
                console.error("Error fetching State",error.message)
            }
        }
        fetchStates();
        setSelectedState("");
        setSelectedCity("");
        setCities([]);
    },[selectedCountry]);

    useEffect(()=>{
        async function fetchCities(){
            if (!selectedCountry || !selectedstate) return;
            try{
                const response=await fetch(CityEndpoint(selectedCountry,selectedstate));
                const data=await response.json();
                setCities(data);
                setSelectedCity("");
            }catch(error){
                console.error("Error fetching cities:",error.message);
            }
        }
        fetchCities();
    },[selectedCountry,selectedstate]);

    function handleCountryChange(event){
        setSelectedCountry(event.target.value)
    }
    function handleStateChange(event){
        setSelectedState(event.target.value);
    }
function handleCityChange(event){
    setSelectedCity(event.target.value);
}
    return(
        <div style={{padding:"1rem", fontFamily:"Arial,sans-serif"}}>
            
            <select name="country" id="country" value={selectedCountry} onChange={handleCountryChange} style={{ margin: "10px", padding: "8px", fontSize: "16px", minWidth: "200px"}}>
                <option value={""}>Select Country</option>
                {countries.map((Country)=>{
                    return <option key={Country} value={Country}>{Country}</option>
                })}
            </select>

              <select name="state" value={selectedstate} onChange={handleStateChange}  style={{ margin: "10px", padding: "8px", fontSize: "16px", minWidth: "200px"}}>
                <option value={""}>Select State</option>
                {states.map((State)=>{
                    return <option key={State} value={State}>{State}</option>
                })}
            </select>

              <select name="city" id="city" value={selectedCity} onChange={handleCityChange} style={{ margin: "10px", padding: "8px", fontSize: "16px", minWidth: "200px"}}>
                <option value={""}>Select City</option>
                {cities.map((city)=>{
                    return <option key={city} value={city}>{city}</option>
                })}
            </select>

            {selectedCountry && selectedstate && selectedCity &&(
                <p style={{marginTop:"20px",fontSize:"18px"}}>
                    You selected {selectedCity},{selectedstate},{selectedCountry}
                </p>
            )} 
    </div>
);
}
export default Selector;