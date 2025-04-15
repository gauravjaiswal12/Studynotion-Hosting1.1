import axios from 'axios';

const uploadToCloudinary = async (file) => {
    if (!file) {
        console.error("No file provided.");
        return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
        alert("Unsupported file type.");
        return;
    }

    // Create FormData and append the file, preset, and folder
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_video_upload"); // Use your preset name here.
    formData.append("folder", "user_videos"); // This ensures the file goes into the user_videos folder.

    try {
        // Removing the explicit "Content-Type" header can help,
        // as axios will automatically set it with the correct boundary.
        console.log("posting the formdata on cloudinary",formData);
        const response = await axios.post(
           "https://api.cloudinary.com/v1_1/dzgiylwja/auto/upload",
           formData
        );

        console.log("Cloudinary upload success:", response.data);
        return {
            secure_url: response.data.secure_url,
            duration: response.data.duration,
        };
    } catch (error) {
        console.error("Cloudinary upload failed:", error);
        alert("Upload failed. Try again later.");
        return null;
    }
};

export default uploadToCloudinary;
