module.exports = (timeStamp) => {
    const date = new Date(timeStamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");;
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");;
    const minute = date.getMinutes().toString().padStart(2, "0");;
    const second = date.getSeconds().toString().padStart(2, "0");;

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}