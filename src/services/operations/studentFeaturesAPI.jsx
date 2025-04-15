import {studentEndpoints} from "../apis";
import {toast} from "react-hot-toast";
import {apiConnector} from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import {setPaymentLoading} from "../../features/counter/courseSlice";
import {resetCart} from "../../features/counter/cartSlice";


const {COURSE_VERIFY_API,COURSE_PAYMENT_API,SEND_PAYMENT_SUCCESS_EMAIL_API}=studentEndpoints;


async function verifyPayment(bodyData,token,navigate,dispatch){
    const toastId=toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));
    try{
        console.log("before the verify payment");
        const response=await apiConnector("POST",COURSE_VERIFY_API,bodyData,{
            Authorization: "Bearer " + `${token}`,
        })
        console.log("Verifying the payment");
        if(!response.data.success){
            throw new Error(response.data.message);
        }
        toast.success("Payment successfully verified!");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }catch (e) {
        console.log("Payment Verify Error:", e);

        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}

function loadScript(src){
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        }
        script.onerror = ()=>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}
export async function buyCourse(token,courses,userDetails,navigate,dispatch){
    const toastId=toast.loading("Loading...");
    try{
        //load the script
        const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        console.log("loading the script",res);
        if(!res){
            toast.error("RazorPay SDK failed to load script!");
            console.log("INside res");
            return;
        }
        //initiate the order
        const orderResponse=await apiConnector("POST",COURSE_PAYMENT_API,
            {courses},
        {
            Authorization: "Bearer " + `${token}`,
        })
        console.log("order response is : ",orderResponse);
        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }
        //options write karte hai
        const options={
            key:process.env.REACT_APP_RAZORPAY_KEY,
            currency: orderResponse.data.message.currency,
            amount:orderResponse.data.message.amount,
            order_id:orderResponse.data.message.id,
            name: "StudyNotion",
            description:"Thank You for purchasing the course",
            image:rzpLogo,
            prefill:{
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler:function(response){
                //send successfull wala mail
                sendPaymentSuccessEmail(response,orderResponse.data.message.amount,token);
                //verify payment
                verifyPayment({...response,courses},token,navigate,dispatch)
            }
        }
        const paymentObject=new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed",function(response){
            toast.error("oops, payment failed with the response");
            console.log(response.error);

        })
    }catch(error){
        console.log(error);
        toast.error("Could not make payment");
    }
    toast.dismiss(toastId);
}
async function sendPaymentSuccessEmail(response,amount,token,dispatch){
    try{
        await apiConnector("POST",SEND_PAYMENT_SUCCESS_EMAIL_API,{
            orderId:response.razorpay_order_id,
            paymentId:response.razorpay_payment_id,
            amount:amount},{
            Authorization: "Bearer " + `${token}`,
        })
    }catch(error){
        console.log("Payment Success email :", error);
    }
}























