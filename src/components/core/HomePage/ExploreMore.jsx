import React, {useState} from 'react';
import {HomePageExplore} from "../../../data/homepage-explore";
import HighlightText from "./HighlightText";
import CourseCard from "./CourseCard";


const tabsName=[
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths",
];

const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCards=(value)=>{
        setCurrentTab((value));
        const result=HomePageExplore.filter((course)=>course.tag===value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

    return (
        <div>
            <div className="text-4xl font-semibold text-center">
                Unlock the
                <HighlightText text={"Power of Code"}/>
            </div>
            <p className="text-center text-richblack-300 text-sm text-[16px] mt-3">
                Learn to build anything you can imagine
            </p>
            <div className=" flex rounded-full bg-richblack-800 mb-10 border-richblack-100  mt-5 px-1 py-1 justify-center items-center  mx-auto  max-w-max">
                {
                    tabsName.map((tab,index)=>{
                        return (
                            <div key={index} className={`text-[16px] flex flex-row items-center justify-center  ${currentTab===tab ? "bg-richblack-900 text-richblack-5 font-medium":"text-richblack-200"} rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-7 py-2`} onClick={() => setMyCards(tab)}>

                                    {tab}
                            </div>
                        );
                    })
                }
            </div>
            <div className="h-[200px]"></div>

            {/*course card ka group*/}
            <div className="flex absolute justify-between items-center gap-5 translate-y-[-64%] translate-x-[-16%]" >
                {
                    courses.map((course,index)=>{
                        return (
                            <CourseCard key={index} course={course} currentCard={currentCard} setCurrentCard={setCurrentCard} />
                        )
                    })
                }
            </div>
        </div>
    );
};

export default ExploreMore;