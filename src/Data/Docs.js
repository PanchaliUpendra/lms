import {collection, doc } from "firebase/firestore";
import { db } from "../Firebase";

// leads collection
export const leaddoc = doc(db,"leads" ,"XpjPVNyiDaRgsN6emVjZ");
export const createleadiddoc = doc(db,"createleadID","uCvGx1JiukzI8SCdnJDx");
export const leadcollection = collection(db,"leads");

export const createexpenseid = doc(db,"createexpenseID","1Oo3vlubLKwRqA9jjvBw");
export const createexpense = doc(db,"expenses","zitABqYQwdvVCAqUR7HP");
export const expensecollection = collection(db,"expenses");


export const createmeetings = doc(db,"meetings","JqCkRuz9W6HVkhuERsrV");
export const meetingscollection = collection(db,"meetings");


//workers collection
export const createworkers = doc(db,"workers","yWXH2DQO8DlAbkmQEQU4");
export const workerscollection = collection(db,"workers");
export const workerscountid = doc(db,"workersID","gUvKlC82ouhqbFmOe3E0");


//graphs data
export const leadsgraphdoc = doc(db,"leadsgraph","1HXMGFXVYcIjbuMzMZo4");
export const ticketsgraphdoc = doc(db,"ticketsgraph","Wrbujr45rUXPWaurALzs");
export const documentsdoc = doc(db,"Documents","wacaEmr1ZlRV7GTfVHfc");

//tickets collection
export const createticketid = doc(db,"createticketID","RcF87qONKNhzjCEkgcF6");
export const createtickets = collection(db,"tickets");

//quotes collection
export const createquoteid = doc(db,"createquoteID","AGQPw48poYCctNB6TaRH");
export const createquotes = collection(db,"quotes");

//spare parts collection
export const sparequotation = collection(db,"sparequotation");
export const sparequotationid = doc(db,"sparequotationID","AZBR29znExz9beVQPHym");

//amc quotation
export const amcquotes = collection(db,"amcdoc");
export const amcquotesid = doc(db,"amcdocID","TKn38PbAmjRxA9d1tkLr");

//spares and machines
export const spareAndMachineDoc = doc(db,"sparesandmachine","7DyUV2gokfkrnOaLl2Rs");

export const API_ONE_TO_ONE = 'https://www.message.ultrasorters.com:8000';

export const GCP_API_ONE_TO_ONE = 'http://localhost:8000';
