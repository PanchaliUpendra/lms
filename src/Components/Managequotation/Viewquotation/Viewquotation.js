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
// import ShareIcon from '@mui/icons-material/Share';
//download icon
import DownloadIcon from '@mui/icons-material/Download';

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {writeBatch} from "firebase/firestore";
import { db } from "../../../Firebase";
import { doc } from "firebase/firestore";

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
// import { createquotes } from "../../../Data/Docs";
import { updateDoc, deleteField } from "firebase/firestore";

// import { EmailShareButton } from "react-share";

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

    async function handledwnquote(quote){
        setshowloading(true);
        try{
            setdwnquote(prev=>({
                ...prev,
                quoteid:quote
            }))
            setTimeout(() => {
                setdwnquote(prev=>({
                    ...prev,
                    active:true,
                }))
                setshowloading(false);
            }, 1800);
        }catch(e){
            alert('you got error wwhile dwonloading...',e);
        }
        // setshowloading(false);
    }

    async function handledwnquoteafterclose(){
        try{
            setTimeout(() => {
                setdwnquote(prev=>({
                    ...prev,
                    active:false,
                    quoteid:''
                }))
            },500);
        }catch(e){
            alert('you got an erro while closing...',e);
        }
    }
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

    const [dwnquote,setdwnquote] = useState({
        active:false,
        quoteid:''
    });

    //function closing the quotation starts here
    async function handleclosequatation(){
        setshowloading(true);
        try{
            if(workerdelete.quoteid!==''){
                await batch.update(doc(db,"quotes",`${sharedvalue.quotesdata[workerdelete.quoteid].docid}`),{
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
            await updateDoc(doc(db,"quotes",`${sharedvalue.quotesdata[quoteid].docid}`),{
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
            <div className={`manlead-con ${(workerdelete.active===true || dwnquote.active===true)===true?'manlead-con-inactive':''}`} >
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
                                                    <th>status</th>
                                                    <th>action</th>
                                                    <th>quotation customer</th>
                                                    <th>
                                                         <p>machine model |</p>
                                                         <p>chute|</p>
                                                         <p>type</p>
                                                    </th>
                                                    <th>price</th>
                                                    {/* <th>usertype</th> */}
                                                    {/* <th>chute</th> */}
                                                    {/* <th>type</th> */}
                                                    <th>quotation type</th>
                                                    <th>payment</th>
                                                    <th>warranty</th>
                                                    <th>company name</th>
                                                    <th>add.info</th>
                                                    
                                                    <th>admin comment</th>
                                                    
                                                    <th>quote.ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    sharedvalue.quoteskeys.length>0 && 
                                                    sharedvalue.quoteskeys
                                                    .filter((item)=>(sharedvalue.quotesdata[item].quotcreatedby===sharedvalue.uid || sharedvalue.role==='admin'))
                                                    .filter((item)=>JSON.stringify(item).includes(searchworker)||sharedvalue.quotesdata[item].quotcustname.includes(searchworker)).map((quote,idx)=>(
                                                        <tr key={idx}>
                                                            {/* 14. status */}
                                                            <td>
                                                                <p className={`view-manager-list-name 
                                                                ${sharedvalue.quotesdata[quote].quotstatus==='open'?'vmln-opended':sharedvalue.quotesdata[quote].quotstatus==='rework'?'vmln-reworked':sharedvalue.quotesdata[quote].quotstatus==='approved'?'vmln-approved':'vmln-closed'}`}>
                                                                    {sharedvalue.quotesdata[quote].quotstatus}
                                                                </p>
                                                            </td>
                                                            {/* 15.  action*/}
                                                            <td>
                                                                <p className='view-manager-list-acttion-icon'>
                                                                     { (sharedvalue.quotesdata[quote].quotstatus==='open' || sharedvalue.quotesdata[quote].quotstatus==='rework') && sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/managequotation/updatequotation/${quote}`)} />}
                                                                    
                                                                    {/* {((sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby )|| (sharedvalue.role ==='admin')) ===true && sharedvalue.quotesdata[quote].quotstatus==='approved' && <EmailShareButton
                                                                        url={sharedvalue.leadsdata[sharedvalue.quotesdata[quote].quotlead].contpersonemail}
                                                                        subject="add your subject"
                                                                        body="here is the content of the body"
                                                                    >
                                                                        <ShareIcon sx={{ color: 'grey', cursor: 'pointer' }} fontSize="small" />
                                                                    </EmailShareButton> } */}
                                                                    {/* {
                                                                        dwnquote!==`${quote}` && ((sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='USD' && 
                                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" onClick={()=>setdwnquote(quote)} />
                                                                    
                                                                    }
                                                                    { dwnquote===`${quote}` && ((sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='USD' && <PDFDownloadLink document={<Comaasrgb quoteid={quote} sharedvalue={sharedvalue}/>} fileName={`${sharedvalue.quotesdata[quote].quotcustname}_${sharedvalue.quotesdata[quote].quotmachinetype}.pdf`}>
                                                                        <DownloadIcon sx={{color:'red',cursor:'pointer'}}  fontSize="small" />
                                                                    </PDFDownloadLink> }
                                                                    {
                                                                        dwnquote!==`${quote}` && ((sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='GST' && 
                                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" onClick={()=>setdwnquote(quote)}/>
                                                                    }
                                                                     { dwnquote===`${quote}` && ((sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='GST' && <PDFDownloadLink document={<Sruthitech quoteid={quote} sharedvalue={sharedvalue}/>} fileName={`${sharedvalue.quotesdata[quote].quotcustname}_${sharedvalue.quotesdata[quote].quotmachinetype}.pdf`}>
                                                                        <DownloadIcon sx={{color:'red',cursor:'pointer'}}  fontSize="small" />
                                                                    </PDFDownloadLink> } */}

                                                                    {
                                                                        ((sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='USD' && 
                                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" onClick={()=>handledwnquote(quote)} />
                                                                    }

                                                                    {
                                                                        ((sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.quotesdata[quote].quotstatus==='approved'||sharedvalue.quotesdata[quote].quotstatus==='closed' ) && sharedvalue.quotesdata[quote].quottype==='GST' && 
                                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" onClick={()=>handledwnquote(quote)} />
                                                                    }
                                                                   
                                                                    {sharedvalue.uid===sharedvalue.quotesdata[quote].quotcreatedby && sharedvalue.quotesdata[quote].quotstatus==='approved' && <span className="close-quotation-btn" onClick={()=>setworkerdelete(prev=>({
                                                                        ...prev,
                                                                        active:true,
                                                                        quoteid:quote
                                                                    }))} >close</span>} 
                                                           
                                                                    {sharedvalue.quotesdata[quote].quotstatus!=='closed' && sharedvalue.role==='admin' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}}  fontSize="small" onClick={()=>navigate(`/managequotation/verifyquotation/${quote}`)}/>}
                                                                    {/* {sharedvalue.quotesdata[quote].quotstatus==='closed' && sharedvalue.role==='admin' && <DeleteOutlineRoundedIcon sx={{color:'red' , cursor:'pointer'}} fontSize="small" onClick={()=>handledeletequotation(quote)}/>} */}
                                                                    <DeleteOutlineRoundedIcon sx={{color:'red' , cursor:'pointer'}} fontSize="small" onClick={()=>handledeletequotation(quote)}/>
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
                                                                    {sharedvalue.quotesdata[quote].quotmachinetype}{sharedvalue.quotesdata[quote].quotcap} |{sharedvalue.quotesdata[quote].quotprodtype}
                                                                </p>
                                                            </td>
                                                            {/* 4. price*/}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotprice}
                                                                </p>
                                                            </td>
                                                            {/* 5. usertype */}
                                                            {/* <td>
                                                                <p className="view-manager-list-name">
                                                                -
                                                                </p>
                                                            </td> */}
                                                            {/* 6.chute */}
                                                            {/* <td>
                                                                <p className="view-manager-list-name">
                                                                {sharedvalue.quotesdata[quote].quotcap}
                                                                </p>
                                                            </td> */}
                                                            {/* 8.product type */}
                                                            {/* <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quotprodtype}
                                                                </p>
                                                            </td> */}
                                                            {/* 7. Quotation type */}
                                                            {/* 7. Quotation type */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {sharedvalue.quotesdata[quote].quottype}
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
                                                            
                                                            {/* 14. admin comment */}
                                                            <td>
                                                                <p className={`view-manager-list-name`}>
                                                                    {sharedvalue.quotesdata[quote].quotadmincommt}
                                                                </p>
                                                            </td>
                                                            

                                                            {/* 1. quote id */}
                                                            <td>
                                                                <p className="view-manager-list-name">
                                                                    {quote}
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
            {/* popup to download the pdf */}
            <div className={`view-manager-list-popup-delete ${dwnquote.active===true?'active-delete-popup':''}`}>
                <p>Are you sure you want to download the pdf <span>{ dwnquote.quoteid!==''?`${sharedvalue.quotesdata[dwnquote.quoteid].quotcustname}_${sharedvalue.quotesdata[dwnquote.quoteid].quotmachinetype}.pdf`:''}</span></p>
                <div>
                    { dwnquote.quoteid!=='' && sharedvalue.quotesdata[dwnquote.quoteid].quottype==='USD'  && <PDFDownloadLink document={<Comaasrgb quoteid={dwnquote.quoteid} sharedvalue={sharedvalue}/>} fileName={`${sharedvalue.quotesdata[dwnquote.quoteid].quotcustname}_${sharedvalue.quotesdata[dwnquote.quoteid].quotmachinetype}.pdf`}>
                        <button onClick={()=>handledwnquoteafterclose()}>yes</button>
                    </PDFDownloadLink> }

                    {dwnquote.quoteid!=='' && sharedvalue.quotesdata[dwnquote.quoteid].quottype==='GST'  && 
                    <PDFDownloadLink document={<Sruthitech quoteid={dwnquote.quoteid} sharedvalue={sharedvalue}/>} fileName={`${sharedvalue.quotesdata[dwnquote.quoteid].quotcustname}_${sharedvalue.quotesdata[dwnquote.quoteid].quotmachinetype}.pdf`}>
                        <button onClick={()=>handledwnquoteafterclose()}>yes</button>
                    </PDFDownloadLink> 
                    }
                    
                    {/* <button>Yes</button> */}
                    <button onClick={()=>setdwnquote(prev=>({
                        ...prev,
                        active:false,
                        quoteid:''
                    }))}>No</button>
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