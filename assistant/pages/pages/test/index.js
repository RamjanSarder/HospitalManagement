
import React, { useEffect, useState } from "react";

import { ProductService } from "../../../demo/service/ProductService";
import { getJWT, getUserName } from "../../../utils/utils";

export default function DynamicDemo() {

    const [jwtUser, setJwtUser] = useState('');
    const [operatorData, setOperatorData] = useState(null);

    useEffect(()=> {
        const jwtToken = getJWT();
        const user = getUserName();

        if(!jwtToken) {
            return window.location = '/'
        }
        setJwtUser(user);

        ProductService.getOperator().then((data) => setOperatorData(data))
    },[])

    console.log('User', jwtUser);
    console.log('operatorData', operatorData);

    const filteredOperator = operatorData?.filter((item)=> item.userName == jwtUser);
    const DoctorName = filteredOperator?.map(item => item.dr_name);
    const Phone = filteredOperator?.map(item => item.phone);
    const operName = filteredOperator?.map(item => item.name);
    const password = filteredOperator?.map(item => item.password);

    console.log("Dorctor", DoctorName)
    
    return (
        <div className="card flex justify-content-center">
             {/* <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/> <br/> */}
             <div>
                <h1>Dr. Details</h1>
                <h5>Dr. Name: {DoctorName}</h5>
                <h5>Phone: {Phone}</h5>
                <h5>Operator Name: {operName}</h5>
                <h5>UserName: {jwtUser}</h5>
                <h5>Password: {password}</h5>

             </div>

        </div>
    )
}
        