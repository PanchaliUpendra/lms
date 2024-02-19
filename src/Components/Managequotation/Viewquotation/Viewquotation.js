import React, {useContext, useState } from "react";
import './Viewquotation.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";

import { PDFDownloadLink } from '@react-pdf/renderer';
import Comaasrgb from "../Comaasrgb";

//share icon
import ShareIcon from '@mui/icons-material/Share';
//download icon
import DownloadIcon from '@mui/icons-material/Download';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { createquotes } from "../../../Data/Docs";
import { updateDoc, deleteField } from "firebase/firestore";

import { EmailShareButton } from "react-share";

import Sruthitech from "../Sruthitech";

function Viewquotation(){
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);//get a new write batch
     //backdrop loading toggle
     const[showloading,setshowloading] = useState(false);
     //deleting lead
     const [workerdelete,setworkerdelete] = useState({
        active:false,
        quoteid:''
    });
    //use navigator is important for now
    const navigate = useNavigate();
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    //testing the pdf is downloading or not starts here
   

    //test the pdf ends here

    //function closing the quotation starts here
    async function handleclosequatation(){
        setshowloading(true);
        try{
            if(workerdelete.quoteid!==''){
                await batch.update(createquotes,{
                    [workerdelete.quoteid]:{
                        ...sharedvalue.quotesdata[workerdelete.quoteid],
                        quotstatus:'closed'
                    }
                });
                await batch.commit();//commit all baches
                setworkerdelete(prev=>({
                    ...prev,
                    active:false,
                    quoteid:''
                }))
            }
        }catch(e){
            console.log('you got an error while handling closing the quotation ',e);
        }
        setshowloading(false);
    }
    //function closing the quotation ends here

    //function to delete the quotation starts here
    async function handledeletequotation(quoteid){
        setshowloading(true);
        try{
            await updateDoc(createquotes,{
                [quoteid]:deleteField()
            });
            await batch.commit();
        }catch(e){
            console.log('you got an error while deleting the quotation',e);
        }
         setshowloading(false);
    }
    //function to delete the quotation ends here
    return(
        <>
            <div className={`manlead-con ${workerdelete.active===true?'manlead-con-inactive':''}`} >
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon onClick={()=>navigate('/search')}/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>View Quotation</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Customer/QuoteID" onChange={(e)=>setsearchworker(e.target.value)}/>
                                </div>
                            </div>
                            {/* search ends here */}
                            {/* table starts from here */}
                                <div className="view-list-table-con">
                                        <table>
                                            <thead>
                                                <tr className="table-head-row">
                                                    <th>quote.ID</th>
                                                    <th>quotation customer</th>
                                                    <th>machine model</th>
                                                    <th>quotation type</th>
                                                    <th>usertype</th>
                                                    <th>chute</th>
                                                    <th>type</th>
                                                    <th>price</th>
                                                    <th>payment</th>
                                                    <th>warranty</th>
                                                    <th>company name</th>
                                                    <th>add.info</th>
                                                    <th>status</th>
                                                    <th>admin comment</th>
                                                    <th>action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    sharedvalue.quoteskeys.length>0 && 
                                                    sharedvalue.quoteskeys
                                                    .filter((item)=>(sharedvalue.quotesdata[item].quotcreatedby===sharedvalue.uid || sharedvalue.role==='admin'))
                                                    .filter((item)=>JSON.stringify(item).includes(searchworker)||sharedvalue.quotesdata[item].quotcustname.includes(searchworker)).map((quote,idx)=>(
                                                        <tr key={idx}>
                                                            {/* 1. quote id */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {quote}
                                                                </p>
                                                            </td>
                                                            {/* 2. quotation customer */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotcustname}
                                                                </p>
                                                            </td>
                                                            {/* 3. machine model */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotmachinetype}
                                                                </p>
                                                            </td>
                                                            {/* 4.quotation type*/}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quottype}
                                                                </p>
                                                            </td>
                                                            {/* 5. usertype */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    -
                                                                </p>
                                                            </td>
                                                            {/* 6.chute */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotcap}
                                                                </p>
                                                            </td>
                                                            {/* 7. price */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotprice}
                                                                </p>
                                                            </td>
                                                            {/* 8.product type */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotprodtype}
                                                                </p>
                                                            </td>
                                                            {/* 9. payment */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotpayment}
                                                                </p>
                                                            </td>
                                                            {/* 11. warranty */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotwarranty}
                                                                </p>
                                                            </td>
                                                            {/* 12. company name */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotcompanyname}
                                                                </p>
                                                            </td>
                                                            {/* 13. add.info */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotaddinfo}
                                                                </p>
                                                            </td>
                                                            {/* 14. status */}
                                                            <td>
                                                                <p className={`view-manager-list-name 
                                                                ${sharedvalue.quotesdata[quote].quotstatus==='open'?'vmln-opended':sharedvalue.quotesdata[quote].quotstatus==='rework'?'vmln-reworked':sharedvalue.quotesdata[quote].quotstatus==='approved'?'vmln-approved':'vmln-closed'}`}>
                                                                    {sharedvalue.quotesdata[quote].quotstatus}
                                                                </p>
                                                            </td>
                                                            {/* 14. admin comment */}
                                                            <td>
                                                                <p className={`view-manager-list-name`}>
                                                                    {sharedvalue.quotesdata[quote].quotadmincommt}
                                                                </p>
                                                            </td>
                                                            {/* 15.  action*/}
                                                            <td>
                                                                <p className='view-manager-list-acttion-icon'>
                                                                    { (sharedvalue.quotesdata[quote].quotstatus==='open' || sharedvalue.quotesdata[quote].quotstatus==='rework') && sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/managequotation/updatequotation/${quote}`)} />}
                                                                    
                                                                    {sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby && sharedvalue.quotesdata[quote].quotstatus==='approved' && <EmailShareButton
                                                                                url={sharedvalue.leadsdata[sharedvalue.quotesdata[quote].quotlead].contpersonemail}
                                                                                subject="add your subject "
                                                                                body="here is the content of the body"
                                                                            > <ShareIcon sx={{color:'grey',cursor:'pointer'}}  fontSize="small"/></EmailShareButton> }
                                                                    {sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='USD' && <PDFDownloadLink document={<Comaasrgb quoteid={quote} sharedvalue={sharedvalue}/>} fileName="dynamic.pdf">
                                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" />
                                                                    </PDFDownloadLink> }
                                                                    {sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='GST' && <PDFDownloadLink document={<Sruthitech quoteid={quote} sharedvalue={sharedvalue}/>} fileName="dynamic.pdf">
                                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" />
                                                                    </PDFDownloadLink> }
                                                                    {sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby && sharedvalue.quotesdata[quote].quotstatus==='approved' && <p className="close-quotation-btn" onClick={()=>setworkerdelete(prev=>({
                                                                ...prev,
                                                                active:true,
                                                                quoteid:quote
                                                            }))} >close</p>}
                                                                    {sharedvalue.quotesdata[quote].quotstatus!=='closed' && sharedvalue.role==='admin' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}}  fontSize="small" onClick={()=>navigate(`/managequotation/verifyquotation/${quote}`)}/>}
                                                                    {sharedvalue.quotesdata[quote].quotstatus==='closed' && sharedvalue.role==='admin' && <DeleteOutlineRoundedIcon sx={{color:'red' , cursor:'pointer'}} fontSize="small" onClick={()=>handledeletequotation(quote)}/>}
                                                                </p>
                                                            </td>

                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                </div>
                                {/* table ends here */}
                        </div>
                        {/* list ends here */}
                        
                    </div>
                </div>
            </div>
            {/* popup to delete an item */}
            <div className={`view-manager-list-popup-delete ${workerdelete.active===true?'active-delete-popup':''}`}>
                <p>Are You Sure You want to close the quotation <span>{workerdelete.quoteid?workerdelete.quoteid:''}</span></p>
                <div>
                    <button onClick={()=>handleclosequatation()}>Yes</button>
                    <button onClick={()=>setworkerdelete(prev=>({
                        ...prev,
                        active:false,
                        quoteid:''
                    }))}>No</button>
                </div>
            </div>
            {/* here ia the back drop */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Viewquotation;