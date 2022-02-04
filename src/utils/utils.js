import { useLocation } from "react-router";


export const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

export const transformDate = (dateString) =>{
    const date = new Date(dateString);

    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}`
}

export const timeDifferenceInMinutes = (dateFromString, dateToString) =>{
    const dateFrom = new Date(dateFromString);
    const dateTo = new Date(dateToString);

    let diff =(dateTo.getTime() - dateFrom.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}

export const sortElementsByDateCreated = (array) => {
    return array.slice().sort((a, b) => {
        return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    });
}
