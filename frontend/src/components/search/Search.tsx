import React,{useState,useEffect} from 'react'
import Navbar from '../Navbar/Navbar';
import {useLocation,useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";


const useQuery=()=>{
    return new URLSearchParams(useLocation().search);
}

export default  function Search() {
    const [data,setdata]=useState([]);
    const query=useQuery();
    const searchtext=query.get('text');
    const navigate=useNavigate();


   

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_SEARCH_API_URI}?value=${searchtext}`);
            console.log(response)
            setdata(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [searchtext]);

      console.log(data)
      
    
   
    


    

  return (
    <div>
        <div>
        <Navbar/>
        </div>
        <div className="flex flex-col items-center mt-20">
          <h1 className="text-2xl font-bold mb-2">검색 결과</h1>
        <div className="w-24 border-b-2 border-gray-400 mb-6"></div>
        <div className="w-full max-w-4xl">
          {data && data.length === 0 ? (
            <div className="text-center">검색 결과가 없습니다</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 justify-center">
              {data.map((elem:any, idx:number) => (
              <div key={idx}>
              <Card 
                className="card border rounded-lg cursor-pointer h-60 flex flex-row"
                onClick={() => navigate(`/post/${elem._id}`)}
              >
                <div className="flex flex-col p-4 w-2/3">
                  <div className="flex items-center mb-2">
                    <img
                      className="w-8 h-8 object-cover rounded-full mr-2"
                      src={elem.profile}
                      alt="Profile"
                    />
                    <div className="font-bold">{elem.nickname}</div>
                  </div>
                  <div className="font-bold text-xl mb-4 mt-2">{elem.title}</div>
                  <div className="text-gray-800">{elem.preview.text}</div>
                </div>
                <img
                  className="w-1/3 h-auto object-cover"
                  src={elem.preview.img}
                  alt="Preview"
                />
            </Card>
            <div className="border-b border-gray-200 mt-2"></div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
    </div>
      
  )
}
