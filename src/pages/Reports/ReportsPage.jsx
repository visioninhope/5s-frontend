/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react"
import axios from "axios"
import { useCookies } from "react-cookie"
import { Reports } from "../../components/Reports"

import { getIsInternet } from "../../functions/getURL"
import { proxy } from "../../api/proxy"
import { API_REPORT_PAGE, API_REPORT_PAGE_I } from "../../api/api"
export const ReportPage = ({control}) => {

    const [data, setData] = useState(false)
    const [cookies, setCookie, removeCookie] = useCookies(["token"])

    const paginator = (page) =>{
        if (getIsInternet(window.location.host)){
          proxy(API_REPORT_PAGE_I(control,page), "GET", {
            'Authorization': cookies.token
          })
            .then(el => {
              console.log(el)
                el.data.detail === 'Authentication credentials were not provided.' || el.data.detail === "Given token not valid for any token type" ? setData(0) : setData(el.data)
              })
        }
        else{
          axios.get(`http://${window.location.hostname}${API_REPORT_PAGE(control, page)}`,{
                headers: {
                  'Authorization': cookies.token
                },
              })
            .then(el => {
              console.log(el)
                el.data.detail === 'Authentication credentials were not provided.' || el.data.detail === "Given token not valid for any token type" ? setData(0) : setData(el.data)
              })
          }
      }

      useEffect(() => {
        paginator(1)
    },[])
    
    return (
       <>
        {
        !!data  &&  
          <div className='dashboard'>
            <h1>Dashboard</h1>
            <h2>
              <span className='dashboard__count'>{data.count}&nbsp;</span>
              <span className='dashboard__span'> reports generated today</span>
            </h2>
            <h3>Reports</h3>
            <Reports 
              data={data}
              paginator={(e) =>paginator(e)}
              />
          </div>
     }
       </>
    )
}