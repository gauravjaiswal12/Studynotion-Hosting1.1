import { toast } from "react-hot-toast"

import { setUser } from "../../features/counter/profileSlice"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { logout } from "./authAPI"


const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
} = settingsEndpoints

export function updateDisplayPicture(token, formData) {

    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            console.log("Authorization: ", `Bearer ${token}`)
            const response = await apiConnector(
                "PUT",
                UPDATE_DISPLAY_PICTURE_API,
                formData,
                {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                }
            )
            console.log(
                "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
                response

            )

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Display Picture Updated Successfully")
            //so that local storage get updated automatically without reload
            const updatedUser = {
                ...JSON.parse(localStorage.getItem("user")), // Get existing user data
                image: response.data.data.image, // Update profilePic URL
            };
            // Update local storage
            localStorage.setItem("user", JSON.stringify(updatedUser));
            // // Update UI (if required)
            // updatePreview(response.data.data.image);


            dispatch(setUser(response.data.data));
            console.log("user from profileslice is ",response.data.data);
        } catch (error) {
            console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
            toast.error("Could Not Update Display Picture")
        }
        toast.dismiss(toastId)
    }
}

export function updateProfile(token, formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                Authorization: `Bearer ${token}`,
            })
            console.log("UPDATE_PROFILE_API API RESPONSE1............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            // const userImage = response.data.updatedUserDetails.image
            //     ? response.data.updatedUserDetails.image
            //     : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            const response2=JSON.parse(localStorage.getItem("user"));
            console.log("printing the image in the response2",response2);
            const updatedUser = {
                ...JSON.parse(localStorage.getItem("user")),
                additionalDetails:response.data.profile,
            }
            //though it is updated but here there is same error that localstorage doesnot get updated when reload it reload after i //logout
            localStorage.setItem("user", JSON.stringify(updatedUser));
            dispatch(
                setUser(updatedUser)
                // setUser({ ...response.data.profile, image: image })
            )

            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.log("UPDATE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Update Profile")
        }
        toast.dismiss(toastId)
    }
}

export async function changePassword(token, formData,navigate,dispatch) {
    const toastId = toast.loading("Loading...")
    console.log("formData is :",formData);

    try {
        const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
            Authorization: `Bearer ${token}`,
        })
        console.log("CHANGE_PASSWORD_API API RESPONSE............", response)

        if (!response.data.success) {
            throw new Error(response.data.message)
        }

        toast.success("Password Changed Successfully");
        dispatch(logout(navigate));

    } catch (error) {
        console.log("CHANGE_PASSWORD_API API ERROR............", error)
        toast.error(error.response.data.message)
    }
    toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
                Authorization: `Bearer ${token}`,
            })
            console.log("DELETE_PROFILE_API API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Profile Deleted Successfully")
            dispatch(logout(navigate))
        } catch (error) {
            console.log("DELETE_PROFILE_API API ERROR............", error)
            toast.error("Could Not Delete Profile")
        }
        toast.dismiss(toastId)
    }
}