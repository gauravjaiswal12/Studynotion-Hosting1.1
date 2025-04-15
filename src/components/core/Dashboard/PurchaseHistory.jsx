import React, {useEffect, useRef, useState} from 'react';
import {getUserEnrolledCourses} from "../../../services/operations/profileAPI";
import {useSelector} from "react-redux";
import PurchaseTableStudent from "./PurchaseTableStudent";

const PurchaseHistory = () => {
    const {token}=useSelector((state) => state.auth);
    const [INenrolledCourses, setINEnrolledCourses] = useState([])
    const getINEnrolledCourses = async () => {
        try {
            const res = await getUserEnrolledCourses(token);

            setINEnrolledCourses(res);
            console.log("Enrolled courses",res)
        } catch (error) {
            console.log("Could not fetch enrolled courses.")
        }
    };
    const hasFetchedCourses = useRef(false); // 👈 this stays the same across renders

    useEffect(() => {
        if (hasFetchedCourses.current) return; // 🛑 if already called, do nothing

        hasFetchedCourses.current = true; // ✅ mark as called
        getINEnrolledCourses(); // 📞 your API call
    }, []);
    return (
       <div>
           <div>
               {INenrolledCourses.length>0 ? (
                  <div>
                      <PurchaseTableStudent courses={INenrolledCourses} />
                  </div>
                   ):(<div>No Courses Purchases as of Yet</div>)}
           </div>
       </div>
    );
};

export default PurchaseHistory;