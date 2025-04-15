export const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("hi-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}