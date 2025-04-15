// const {instance} = require("../config/razorpay");
// const mongoose=require("mongoose");
// const Course = require("../models/Course");
// const User = require("../models/User");
// const mailSender = require("../utils/mailSender");
// const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
// const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
// const crypto = require("crypto");
// const courseProgress=require("../models/CourseProgress");
//
//
// require("dotenv").config();
//
// //intiate the razorpay order
// exports.capturePayment=async (req, res) => {
//     const {courses}=req.body;
//     const userId=req.user.id;
//     if(courses.length==0){
//         return res.json({
//             "success": false,
//             "message": "Please fill out all courses and course ID"
//         })
//     }
//     let totalAmount=0;
//     for(const course_id of courses){
//         let course;
//         try{
//             course=await Course.findById(course_id);
//             if(!course){
//                 return res.status(404).json({
//                     'success':false,
//                     "message": "Course does not exist",
//                 })
//             }
//             console.log("printing the course in capture payment",course);
//
//             const uid=new mongoose.Types.ObjectId(userId);
//             console.log("printing the uid",uid);
//             if(course.studentsEnrolled.includes(uid)){
//                 return res.status(404).json({
//                     'success':false,
//                     "message": "Course already payed to exist",
//                 })
//             }
//             totalAmount+=course.price;
//
//         }catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 'success': false,
//                 "message": "Course does not exist",
//             })
//         }
//     }
//     const options = {
//         amount:totalAmount*100,
//         currency:"INR",
//         receipt:Math.random(Date.now()).toString(),
//     }
//     try{
//         const paymentResponse=await instance.orders.create(options);
//         res.status(200).json({
//             "success": true,
//             "message": paymentResponse,
//         });
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             'success': false,
//             "message": "Something went wrong while creating the order",
//         })
//     }
// }
// //verify the payment
// exports.verifyPayment=async (req, res) => {
//     console.log(req.body);
//     const razorpay_order_id=req.body?.razorpay_order_id;
//     const razorpay_payment_id=req.body?.razorpay_payment_id;
//     const razorpay_signature=req.body?.razorpay_signature;
//     const courses=req.body?.courses;
//     const userId=req.user.id;
//     if(!razorpay_signature || !razorpay_payment_id || !razorpay_order_id || !courses ||!userId){
//         return res.status(400).json({
//             'success': false,
//             "message": "Please fill out all courses and course ID in verify payment",
//         })
//     }
//     let body=razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_SECRET).update(body.toString()).digest('hex');
//     if(expectedSignature===razorpay_signature){
//         //enroll krado student ko
//         const response=await enrollStudents(courses,userId,res);
//         //return response
//          return res.status(200).json({
//              "success": true,
//              "message":"Payment verification done"
//          })
//     }
//     return res.status(400).json({
//         'success': false,
//         "message":"Payment verification failed"
//     })
//
// }
//
// //enroll student ka function
// const enrollStudents=async(courses,userId,res)=>{
//     if(!courses || !userId){
//         return res.status(404).json({
//             'success': false,
//             "message": "Please fill out all courses and user ID in payment enrollment",
//         })
//     }
//     for(const courseId of courses){
//         //find the course and enroll the student
//         try{
//             const enrolledCourse=await Course.findOneAndUpdate(
//                 {_id:courseId},
//                 {$push:{studentsEnrolled:userId}},
//                 {new:true}
//             )
//             if(!enrolledCourse){
//                 return res.status(404).json({
//                     'success': false,
//                     "message": "Course does not exist",
//                 })
//             }
//
//             const courseProgresses=await courseProgress.create(
//                {
//                     courseId:courseId,
//                     userId:userId,
//                     completedVideos:[],
//                }
//             )
//
//             //find the student and add the courses to their list
//             const enrolledStudent=await User.findByIdAndUpdate(userId,
//                 {$push:{
//                     courses:courseId,
//                         courseProgress:courseProgresses._id,
//
//                 }},
//                 {new:true}
//             )
//             //bachhe ko mail send kardo
//             const mailResponse=await mailSender(enrolledCourse.email,`Successfully enrolled into ${enrolledCourse.courseName}`,courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstName}`));
//             // console.log("Email sent successfully",emailResponse.response);
//         }catch (e) {
//             console.log(e);
//             return res.status(500).json({
//                 'success': false,
//                 "message": "Something went wrong while creating the enrolling the student",
//             })
//         }
//     }
// }
//
// //send email
// exports.sendPaymentSuccessEmail=async (req, res) => {
//     const {orderId,paymentId,amount}=req.body;
//     const userId = req.user.id;
//     if(!orderId || !paymentId || !amount){
//         return res.status(400).json({
//             'success': false,
//             'message': 'Please fill out all courses and user ID in send mail verify payment',
//         })
//     }
//     try{
//         //student ko dundho
//         const enrolledStudent=await User.findById(userId);
//         if(!enrolledStudent){
//             return res.status(404).json({
//                 'success': false,
//                 "message":"User does not exist when tried in Sending Email",
//             })
//         }
//         await mailSender(enrolledStudent.email,`Payment Recieved`,paymentSuccessEmail(`${enrolledStudent.firstName}`,amount/100,orderId,paymentId))
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({
//             'success': false,
//             'message': 'Something went wrong while sending email in verify payment',
//         })
//     }
// }
//
//
// // //capture the payment and initiate the Razorpay order__>it is for single item see for multiple items
// // exports.capturePayment = async (req, res) => {
// //     //get courseId and UserID
// //     const {course_id} = req.body;
// //     const userId = req.user.id;
// //     //validation
// //     //valid courseID
// //     if(!course_id) {
// //         return res.json({
// //             success:false,
// //             message:'Please provide valid course ID',
// //         })
// //     };
// //     //valid courseDetail
// //     let course;
// //     try{
// //         course = await Course.findById(course_id);
// //         if(!course) {
// //             return res.json({
// //                 success:false,
// //                 message:'Could not find the course',
// //             });
// //         }
// //
// //         //user already pay for the same course
// //         const uid = new mongoose.Types.ObjectId(userId);
// //         if(course.studentsEnrolled.includes(uid)) {
// //             return res.status(200).json({
// //                 success:false,
// //                 message:'Student is already enrolled',
// //             });
// //         }
// //     }
// //     catch(error) {
// //         console.error(error);
// //         return res.status(500).json({
// //             success:false,
// //             message:error.message,
// //         });
// //     }
// //
// //     //order create
// //     const amount = course.price;
// //     const currency = "INR";
// //
// //     const options = {
// //         amount: amount * 100,
// //         currency,
// //         receipt: Math.random(Date.now()).toString(),
// //         notes:{
// //             courseId: course_id,
// //             userId,
// //         }
// //     };
// //
// //     try{
// //         //initiate the payment using razorpay
// //         const paymentResponse = await instance.orders.create(options);
// //         console.log(paymentResponse);
// //         //return response
// //         return res.status(200).json({
// //             success:true,
// //             courseName:course.courseName,
// //             courseDescription:course.courseDescription,
// //             thumbnail: course.thumbnail,
// //             orderId: paymentResponse.id,
// //             currency:paymentResponse.currency,
// //             amount:paymentResponse.amount,
// //         });
// //     }
// //     catch(error) {
// //         console.log(error);
// //         res.json({
// //             success:false,
// //             message:"Could not initiate order",
// //         });
// //     }
// //
// //
// // };
// //
// // //verify Signature of Razorpay and Server
// //
// // exports.verifySignature = async (req, res) => {
// //     const webhookSecret = "12345678";
// //
// //     const signature = req.headers["x-razorpay-signature"];
// //
// //     const shasum =  crypto.createHmac("sha256", webhookSecret);
// //     shasum.update(JSON.stringify(req.body));
// //     const digest = shasum.digest("hex");
// //
// //     if(signature === digest) {
// //         console.log("Payment is Authorised");
// //
// //         const {courseId, userId} = req.body.payload.payment.entity.notes;
// //
// //         try{
// //                 //fulfil the action
// //
// //                 //find the course and enroll the student in it
// //                 const enrolledCourse = await Course.findOneAndUpdate(
// //                                                 {_id: courseId},
// //                                                 {$push:{studentsEnrolled: userId}},
// //                                                 {new:true},
// //                 );
// //
// //                 if(!enrolledCourse) {
// //                     return res.status(500).json({
// //                         success:false,
// //                         message:'Course not Found',
// //                     });
// //                 }
// //
// //                 console.log(enrolledCourse);
// //
// //                 //find the student andadd the course to their list enrolled courses me
// //                 const enrolledStudent = await User.findOneAndUpdate(
// //                                                 {_id:userId},
// //                                                 {$push:{courses:courseId}},
// //                                                 {new:true},
// //                 );
// //
// //                 console.log(enrolledStudent);
// //
// //                 //mail send krdo confirmation wala
// //                 const emailResponse = await mailSender(
// //                                         enrolledStudent.email,
// //                                         "Congratulations from CodeHelp",
// //                                         "Congratulations, you are onboarded into new CodeHelp Course",
// //                 );
// //
// //                 console.log(emailResponse);
// //                 return res.status(200).json({
// //                     success:true,
// //                     message:"Signature Verified and COurse Added",
// //                 });
// //
// //
// //         }
// //         catch(error) {
// //             console.log(error);
// //             return res.status(500).json({
// //                 success:false,
// //                 message:error.message,
// //             });
// //         }
// //     }
// //     else {
// //         return res.status(400).json({
// //             success:false,
// //             message:'Invalid request',
// //         });
// //     }
// //
// //
// // };
//

const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

//initiate the razorpay order
exports.capturePayment = async(req, res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0) {
        return res.json({success:false, message:"Please provide Course Id"});
    }

    let totalAmount = 0;

    for(const course_id of courses) {
        let course;
        try{

            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            const uid  = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }

            totalAmount += course.price;
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}


//verify the payment
exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
       !razorpay_payment_id ||
       !razorpay_signature || !courses || !userId) {
        return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
       .createHmac("sha256", process.env.RAZORPAY_SECRET)
       .update(body.toString())
       .digest("hex");

    if(expectedSignature === razorpay_signature) {
        //enroll karwao student ko
        await enrollStudents(courses, userId, res);
        //return res
        return res.status(200).json({success:true, message:"Payment Verified"});
    }
    return res.status(200).json({success:"false", message:"Payment Failed"});

}


const enrollStudents = async(courses, userId, res) => {

    if(!courses || !userId) {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

    for(const courseId of courses) {
        try{
            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
               {_id:courseId},
               {$push:{studentsEnrolled:userId}},
               {new:true},
            )

            if(!enrolledCourse) {
                return res.status(500).json({success:false,message:"Course not Found"});
            }

            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos: [],
            })

            //find the student and add the course to their list of enrolledCOurses
            const enrolledStudent = await User.findByIdAndUpdate(userId,
               {$push:{
                       courses: courseId,
                       courseProgress: courseProgress._id,
                   }},{new:true})

            ///bachhe ko mail send kardo
            const emailResponse = await mailSender(
               enrollStudents.email,
               `Successfully Enrolled into ${enrolledCourse.courseName}`,
               courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )
            //console.log("Email Sent Successfully", emailResponse.response);
        }
        catch(error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }

}

exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try{
        //student ko dhundo
        const enrolledStudent = await User.findById(userId);
        await mailSender(
           enrolledStudent.email,
           `Payment Recieved`,
           paymentSuccessEmail(`${enrolledStudent.firstName}`,
              amount/100,orderId, paymentId)
        )
    }
    catch(error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}


// //capture the payment and initiate the Razorpay order
// exports.capturePayment = async (req, res) => {
//     //get courseId and UserID
//     const {course_id} = req.body;
//     const userId = req.user.id;
//     //validation
//     //valid courseID
//     if(!course_id) {
//         return res.json({
//             success:false,
//             message:'Please provide valid course ID',
//         })
//     };
//     //valid courseDetail
//     let course;
//     try{
//         course = await Course.findById(course_id);
//         if(!course) {
//             return res.json({
//                 success:false,
//                 message:'Could not find the course',
//             });
//         }

//         //user already pay for the same course
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)) {
//             return res.status(200).json({
//                 success:false,
//                 message:'Student is already enrolled',
//             });
//         }
//     }
//     catch(error) {
//         console.error(error);
//         return res.status(500).json({
//             success:false,
//             message:error.message,
//         });
//     }

//     //order create
//     const amount = course.price;
//     const currency = "INR";

//     const options = {
//         amount: amount * 100,
//         currency,
//         receipt: Math.random(Date.now()).toString(),
//         notes:{
//             courseId: course_id,
//             userId,
//         }
//     };

//     try{
//         //initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);
//         //return response
//         return res.status(200).json({
//             success:true,
//             courseName:course.courseName,
//             courseDescription:course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId: paymentResponse.id,
//             currency:paymentResponse.currency,
//             amount:paymentResponse.amount,
//         });
//     }
//     catch(error) {
//         console.log(error);
//         res.json({
//             success:false,
//             message:"Could not initiate order",
//         });
//     }


// };

// //verify Signature of Razorpay and Server

// exports.verifySignature = async (req, res) => {
//     const webhookSecret = "12345678";

//     const signature = req.headers["x-razorpay-signature"];

//     const shasum =  crypto.createHmac("sha256", webhookSecret);
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest) {3
//         console.log("Payment is Authorised");

//         const {courseId, userId} = req.body.payload.payment.entity.notes;

//         try{
//                 //fulfil the action

//                 //find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                 {_id: courseId},
//                                                 {$push:{studentsEnrolled: userId}},
//                                                 {new:true},
//                 );

//                 if(!enrolledCourse) {
//                     return res.status(500).json({
//                         success:false,
//                         message:'Course not Found',
//                     });
//                 }

//                 console.log(enrolledCourse);

//                 //find the student andadd the course to their list enrolled courses me
//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                 {_id:userId},
//                                                 {$push:{courses:courseId}},
//                                                 {new:true},
//                 );

//                 console.log(enrolledStudent);

//                 //mail send krdo confirmation wala
//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulations from CodeHelp",
//                                         "Congratulations, you are onboarded into new CodeHelp Course",
//                 );

//                 console.log(emailResponse);
//                 return res.status(200).json({
//                     success:true,
//                     message:"Signature Verified and COurse Added",
//                 });


//         }
//         catch(error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else {
//         return res.status(400).json({
//             success:false,
//             message:'Invalid request',
//         });
//     }


// };