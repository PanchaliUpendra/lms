import React, {useContext, useState } from "react";
import './ViewSpare.css';
// import SearchIcon from '@mui/icons-material/Search';
import Notify from "../../Notifications/Notify";
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { writeBatch , doc} from "firebase/firestore";
import { db } from "../../../Firebase";
import { updateDoc, deleteField } from "firebase/firestore";
import DownloadIcon from '@mui/icons-material/Download';
import Sparequote from "../../Managequotation/Sparequote";
import { PDFDownloadLink } from '@react-pdf/renderer';


function ViewSpare(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const batch = writeBatch(db);
    // search bar input 
    const [searchworker,setsearchworker]=useState('');
    //backdrop loading toggle
    const[showloading,setshowloading] = useState(false);
    //deleting lead
    const [workerdelete,setworkerdelete] = useState({
       active:false,
       spareid:''
   });
   const [dwnquote,setdwnquote] = useState({
    active:false,
    spareid:''
    });

    async function handledwnquote(spare){
        setshowloading(true);
        try{
            setdwnquote(prev=>({
                ...prev,
                spareid:spare
            }))
            setTimeout(() => {
                setdwnquote(prev=>({
                    ...prev,
                    active:true,
                }))
                setshowloading(false);
            }, 1800);
        }catch(e){
            alert('you got error while dwonloading...',e);
        }
        // setshowloading(false);
    }

    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

    //function closing the quotation starts here
    async function handleclosequatation(){
        setshowloading(true);
        try{
            if(workerdelete.spareid!==''){
                await batch.update(doc(db,"sparequotation",`${sharedvalue.sparesdata[workerdelete.spareid].docid}`),{
                    [workerdelete.spareid]:{
                        ...sharedvalue.sparesdata[workerdelete.spareid],
                        sparestatus:'closed'
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
    async function handledeletequotation(spareid){
        setshowloading(true);
        try{
            
            await updateDoc(doc(db,"sparequotation",`${sharedvalue.sparesdata[spareid].docid}`),{
                [spareid]:deleteField()
            });
            await batch.commit();
            sharedvalue.delete_spare_quote(spareid);
        }catch(e){
            console.log('you got an error while deleting the quotation',e);
        }
         setshowloading(false);
    }
    //function to delete the quotation ends here
    async function handledwnquoteafterclose(){
        try{
            setTimeout(() => {
                setdwnquote(prev=>({
                    ...prev,
                    active:false,
                    spareid:''
                }))
            },500);
        }catch(e){
            alert('you got an erro while closing...',e);
        }
    }
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
                            {/* <SearchIcon onClick={()=>navigate('/search')}/> */}
                            <Notify/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>View Sapre Quotation</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Company/SapreID" onChange={(e)=>setsearchworker(e.target.value)}/>
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
                                            <th>Company</th>
                                            <th>
                                            <p>machine</p>
                                            </th>
                                            <th>quotation type</th>
                                            <th>admin comment</th>
                                            <th>created by</th>
                                            <th>Spare.ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.spareskeys.length>0 &&
                                            sharedvalue.spareskeys
                                            .filter((item)=>(sharedvalue.sparesdata[item].sparecreatedby===sharedvalue.uid || sharedvalue.role==='admin'))
                                            .filter((item)=>JSON.stringify(item).includes(searchworker)||sharedvalue.sparesdata[item].companyname.toLowerCase().includes(searchworker.toLowerCase())||sharedvalue.sparesdata[item].othercompanyname.toLowerCase().includes(searchworker.toLowerCase()))
                                            .map((spare,idx)=>(
                                                <tr key={idx}>
                                                    {/* status */}
                                                    <td>
                                                        <p className={`view-manager-list-name 
                                                            ${sharedvalue.sparesdata[spare].sparestatus==='open'?'vmln-opended':sharedvalue.sparesdata[spare].sparestatus==='rework'?'vmln-reworked':sharedvalue.sparesdata[spare].sparestatus==='approved'?'vmln-approved':'vmln-closed'}`}
                                                        >
                                                            {sharedvalue.sparesdata[spare].sparestatus}
                                                        </p>
                                                    </td>
                                                    {/* action */}
                                                    <td>
                                                        <p className='view-manager-list-acttion-icon'>
                                                        { (sharedvalue.sparesdata[spare].sparestatus==='open' || sharedvalue.sparesdata[spare].sparestatus==='rework') && sharedvalue.uid===sharedvalue.sparesdata[spare].sparecreatedby && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/manageamc/updatespare/${spare}`)} />}
                                                        {sharedvalue.sparesdata[spare].sparestatus!=='closed' && sharedvalue.role==='admin' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}}  fontSize="small" onClick={()=>navigate(`/managespare/verifyspare/${spare}`)}/>}
                                                            {/* close button */}
                                                        {sharedvalue.uid===sharedvalue.sparesdata[spare].sparecreatedby && sharedvalue.sparesdata[spare].sparestatus==='approved' && <span className="close-quotation-btn" onClick={()=>setworkerdelete(prev=>({
                                                        ...prev,
                                                        active:true,
                                                        spareid:spare
                                                        }))} >close</span>}
                                                         {sharedvalue.sparesdata[spare].sparestatus==='closed' && sharedvalue.role==='admin' && <DeleteOutlineRoundedIcon sx={{color:'red' , cursor:'pointer'}} fontSize="small" onClick={()=>handledeletequotation(spare)}/>}
                                                         {
                                                        ((sharedvalue.uid===sharedvalue.sparesdata[spare].sparecreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.sparesdata[spare].sparestatus==='approved'||sharedvalue.sparesdata[spare].sparestatus==='closed' ) && 
                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" onClick={()=>handledwnquote(spare)} />
                                                        }
                                                        </p>
                                                        
                                                       
                                                    </td>
                                                    {/* company name */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.sparesdata[spare].companyname!==''?sharedvalue.sparesdata[spare].companyname:sharedvalue.sparesdata[spare].othercompanyname}
                                                        </p>
                                                    </td>
                                                    {/* machine  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.sparesdata[spare].sparereqmachine}
                                                        </p>
                                                    </td>
                                                    {/* quotation type  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.sparesdata[spare].sparequottype}
                                                        </p>
                                                    </td>
                                                    {/*  admin comment */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {sharedvalue.sparesdata[spare].spareadmincommt}
                                                        </p>
                                                    </td>
                                                    {/* created by */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {sharedvalue.workersdata[sharedvalue.sparesdata[spare].sparecreatedby].name}
                                                        </p>
                                                    </td>
                                                    {/*  spare id */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {spare}
                                                        </p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* popup to download the pdf */}
            <div className={`view-manager-list-popup-delete ${dwnquote.active===true?'active-delete-popup':''}`}>
                <p>Are you sure you want to download the pdf <span>{ dwnquote.spareid!==''?sharedvalue.sparesdata[dwnquote.spareid].companyname:''}</span></p>
                <div>
                    { 
                        dwnquote.spareid!==''   && <PDFDownloadLink document={<Sparequote spareid={dwnquote.spareid} sharedvalue={sharedvalue}/>} fileName={`${sharedvalue.sparesdata[dwnquote.spareid].companyname}`}>
                            <button onClick={()=>handledwnquoteafterclose()}>yes</button>
                        </PDFDownloadLink>
                    }
                    
                    {/* <button>Yes</button> */}
                    <button onClick={()=>setdwnquote(prev=>({
                        ...prev,
                        active:false,
                        spareid:''
                    }))}>No</button>
                </div>
            </div>
            {/* popup to close an item */}
            <div className={`view-manager-list-popup-delete ${workerdelete.active===true?'active-delete-popup':''}`}>
                <p>Are You Sure You want to close the spare quotation <span>{workerdelete.spareid?workerdelete.spareid:''}</span></p>
                <div>
                    <button onClick={()=>handleclosequatation()}>Yes</button>
                    <button onClick={()=>setworkerdelete(prev=>({
                        ...prev,
                        active:false,
                        spareid:''
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

export default ViewSpare;