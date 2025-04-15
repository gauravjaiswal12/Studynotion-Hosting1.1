import React from 'react';
import {Table, Tbody, Td, Th, Thead, Tr} from "react-super-responsive-table";
import {formatDate} from "../../../services/formatDate";
import {COURSE_STATUS} from "../../../utils/constants";
import {HiClock} from "react-icons/hi";
import {FaCheck} from "react-icons/fa";
import {FiEdit2} from "react-icons/fi";
import {RiDeleteBin6Line} from "react-icons/ri";
import ConfirmationModal from "../../common/ConfirmationModal";

const PurchaseTableStudent = ({courses}) => {

    const TRUNCATE_LENGTH = 30
    console.log("Courses in Purchase History",courses)
    return (
       <>
           <Table className="rounded-xl border border-richblack-800 ">
               <Thead>
                   <Tr className="flex gap-x-10 rounded-t-md border-b border-b-richblack-800 px-6 py-2">
                       <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
                           Courses
                       </Th>
                       <Th className="text-left text-sm font-medium uppercase text-richblack-100">
                           Price
                       </Th>
                   </Tr>
               </Thead>
               <Tbody>
                   {courses?.length > 0 &&
                      (
                      courses?.map((course,index) => (
                         <Tr
                            key={index}
                            className="flex gap-x-10 border-b border-richblack-800 px-6 py-8"
                         >
                             <Td className="flex flex-1 gap-x-4">
                                 <img
                                    src={course?.thumbnail}
                                    alt={course?.courseName}
                                    className="h-[148px] w-[220px] rounded-lg object-cover"
                                 />
                                 <div className="flex flex-col justify-between">
                                     <p className="text-lg font-semibold text-richblack-5">
                                         {course.courseName}
                                     </p>
                                     <p className="text-xs text-richblack-300">
                                         {course.courseDescription.split(" ").length >
                                         TRUNCATE_LENGTH
                                            ? course.courseDescription
                                            .split(" ")
                                            .slice(0, TRUNCATE_LENGTH)
                                            .join(" ") + "..."
                                            : course.courseDescription}
                                     </p>
                                     <p className="text-[12px] text-white">
                                         Created: {formatDate(course.createdAt)}
                                     </p>
                                     <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                                            <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                                                <FaCheck size={8} />
                                            </p>
                                            Published
                                        </div>
                                        )
                                 </div>
                             </Td>
                             <Td className="text-sm font-medium text-richblack-100">
                                 ₹{course.price}
                             </Td>

                         </Tr>
                      ))
                   )}
               </Tbody>
           </Table>

       </>
    );
};

export default PurchaseTableStudent;