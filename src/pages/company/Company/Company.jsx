/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Fragment, useEffect, useState } from 'react'
import './Company.scss'

import { useCookies } from "react-cookie"
import { AddUser } from './addUser'
import { getUserList } from '../../../api/requests'

export const CompanyComponent = () =>{

    const [cookies, setCookie, removeCookie] = useCookies(['token']);

    const [userList, setUserList] = useState([]);
    const [isAddAccount, setIsAddAccount] = useState(false);
    
    useEffect(() =>{
        getUserList(window.location.hostname, cookies.token)
          .then(res => {
            console.log(res.data)
            if (res.data.detail !=='Authentication credentials were not provided.' && res.data.detail!== 'Given token not valid for any token type') {
                setUserList(res.data.results)
            }
            else{
                removeCookie('token')
            }
        })
    },[])

    return(
    <>
        {userList.length > 0 && 
        <div className='company'>
            <h2>Company</h2>
            <div className='company__name'>
                <h3>Taqtile</h3>
            </div>
            <div className='company__accounts_tab'>
                <h2>Accounts</h2>
                <button className='company__add' onClick={() => setIsAddAccount(true)}>+ Add Account</button>
            </div>

            <div className='company__accounts_container'>
                {userList.map((user) => 
                <Fragment key={user.id}>
                    <div className='company__user'>
                        <span>{user.username}</span>
                        {user.id === 1 ?
                        <div className='company__user_owner'>Owner</div>
                        :
                        <div className='company__user_worker'>Worker</div>
                        }
                        
                    </div>
                </Fragment>
                )}
            </div>
            {isAddAccount && <AddUser close={() =>{setIsAddAccount(false)}}/>}
        </div> 
        }
    </>
    )
}