import { doc } from "firebase/firestore";
import { db } from "../Firebase";
export const leaddoc = doc(db,"leads" ,"XpjPVNyiDaRgsN6emVjZ");
export const createleadiddoc = doc(db,"createleadID","uCvGx1JiukzI8SCdnJDx");
export const createticketid = doc(db,"createticketID","RcF87qONKNhzjCEkgcF6");
export const createtickets = doc(db,"tickets","ynF6FDMS2w9wwS82vean");
export const createexpenseid = doc(db,"createexpenseID","1Oo3vlubLKwRqA9jjvBw");
export const createexpense = doc(db,"expenses","zitABqYQwdvVCAqUR7HP");
export const createmeetings = doc(db,"meetings","JqCkRuz9W6HVkhuERsrV");
export const createquoteid = doc(db,"createquoteID","AGQPw48poYCctNB6TaRH");
export const createquotes = doc(db,"quotes","HntCeIfNJlZJBU6gzIj5");
export const createworkers = doc(db,"workers","yWXH2DQO8DlAbkmQEQU4");
export const leadsgraphdoc = doc(db,"leadsgraph","1HXMGFXVYcIjbuMzMZo4");
export const ticketsgraphdoc = doc(db,"ticketsgraph","Wrbujr45rUXPWaurALzs");
export const documentsdoc = doc(db,"Documents","wacaEmr1ZlRV7GTfVHfc");

export const API_ONE_TO_ONE = 'https://www.message.ultrasorters.com:8000';
