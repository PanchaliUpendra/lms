import React, {useContext, useState } from "react";
import './ViewAmc.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../../Sidenav/Sidenav";
import MyContext from "../../../MyContext";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { writeBatch ,doc} from "firebase/firestore";
import { db } from "../../../Firebase";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { updateDoc, deleteField } from "firebase/firestore";
import DownloadIcon from '@mui/icons-material/Download';
import Amcquote from "../../Managequotation/Amcquote";
import { PDFDownloadLink } from '@react-pdf/renderer';
function ViewAmc(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();
    const batch = writeBatch(db);

    // search bar input 
    const [searchworker,setsearchworker]=useState('');

    const[showloading,setshowloading] = useState(false);
    //deleting lead
    const [workerdelete,setworkerdelete] = useState({
       active:false,
       amcid:''
    });
    const [dwnquote,setdwnquote] = useState({
        active:false,
        amcid:''
    });
    async function handledwnquote(amc){
        setshowloading(true);
        try{
            setdwnquote(prev=>({
                ...prev,
                amcid:amc
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
            if(workerdelete.amcid!==''){
                await batch.update(doc(db,"amcdoc",`${sharedvalue.amcdata[workerdelete.amcid].docid}`),{
                    [workerdelete.amcid]:{
                        ...sharedvalue.amcdata[workerdelete.amcid],
                        amcstatus:'closed'
                    }
                });
                await batch.commit();//commit all baches
                setworkerdelete(prev=>({
                    ...prev,
                    active:false,
                    amcid:''
                }))
            }
        }catch(e){
            console.log('you got an error while handling closing the quotation ',e);
        }
        setshowloading(false);
    }
    //function closing the quotation ends here

    //function to delete the quotation starts here
    async function handledeletequotation(amcid){
        setshowloading(true);
        try{
            
            await updateDoc(doc(db,"amcdoc",`${sharedvalue.amcdata[amcid].docid}`),{
                [amcid]:deleteField()
            });
            await batch.commit();
            sharedvalue.Delete_amc_quote(amcid);
        }catch(e){
            console.log('you got an error while deleting the quotation',e);
        }
         setshowloading(false);
    }
    //function to delete the quotation ends here

     //function to delete the quotation ends here
     async function handledwnquoteafterclose(){
        try{
            setTimeout(() => {
                setdwnquote(prev=>({
                    ...prev,
                    active:false,
                    amcid:''
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
                            <SearchIcon onClick={()=>navigate('/search')}/>
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createmanager starts from here */}
                    <div className='create-lead-con'>
                        <div className="create-header-starts-here">
                            <div className="new-ticket-header">
                                <h1>View AMC Quotation</h1>
                            </div>
                        </div>
                        {/* list starts from here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-of-all-search">
                                <div>
                                    <label>Search:</label>
                                    <input type='text' placeholder="Company/AMC-id" onChange={(e)=>setsearchworker(e.target.value)}/>
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
                                                <p>country |</p>
                                                <p>state |</p>
                                                <p>district</p>
                                            </th>
                                            <th>
                                            <p>machine</p>
                                            </th>
                                            <th>quotation type</th>
                                            <th>admin comment</th>
                                            <th>created by</th>
                                            <th>AMC.ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sharedvalue.amckeys.length>0 &&
                                            sharedvalue.amckeys
                                            .filter((item)=>(sharedvalue.amcdata[item].amccreatedby===sharedvalue.uid || sharedvalue.role==='admin'))
                                            .filter((item)=>JSON.stringify(item).includes(searchworker)||sharedvalue.amcdata[item].amccompanyname.toLowerCase().includes(searchworker.toLowerCase()))
                                            .map((amc,idx)=>(
                                                <tr key={idx}>
                                                    {/* status */}
                                                    <td>
                                                        <p className={`view-manager-list-name 
                                                            ${sharedvalue.amcdata[amc].amcstatus==='open'?'vmln-opended':sharedvalue.amcdata[amc].amcstatus==='rework'?'vmln-reworked':sharedvalue.amcdata[amc].amcstatus==='approved'?'vmln-approved':'vmln-closed'}`}
                                                        >
                                                            {sharedvalue.amcdata[amc].amcstatus}
                                                        </p>
                                                    </td>
                                                    {/* action */}
                                                    <td>
                                                        <p className='view-manager-list-acttion-icon'>
                                                        { (sharedvalue.amcdata[amc].amcstatus==='open' || sharedvalue.amcdata[amc].amcstatus==='rework') && sharedvalue.uid===sharedvalue.amcdata[amc].amccreatedby && <EditIcon fontSize="small" sx={{color:'green',cursor:'pointer'}} onClick={()=>navigate(`/manageamc/updateamc/${amc}`)} />}
                                                        {sharedvalue.amcdata[amc].amcstatus!=='closed' && sharedvalue.role==='admin' && <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}}  fontSize="small" onClick={()=>navigate(`/manageamc/verifyamc/${amc}`)}/>}
                                                        {/* close button */}
                                                        {sharedvalue.uid===sharedvalue.amcdata[amc].amccreatedby && sharedvalue.amcdata[amc].amcstatus==='approved' && <span className="close-quotation-btn" onClick={()=>setworkerdelete(prev=>({
                                                        ...prev,
                                                        active:true,
                                                        amcid:amc
                                                        }))} >close</span>}
                                                        {sharedvalue.amcdata[amc].amcstatus==='closed' && sharedvalue.role==='admin' && <DeleteOutlineRoundedIcon sx={{color:'red' , cursor:'pointer'}} fontSize="small" onClick={()=>handledeletequotation(amc)}/>}
                                                        {
                                                        ((sharedvalue.uid===sharedvalue.amcdata[amc].amccreatedby )|| (sharedvalue.role ==='admin')) ===true && (sharedvalue.amcdata[amc].amcstatus==='approved'||sharedvalue.amcdata[amc].amcstatus==='closed' ) && 
                                                        <DownloadIcon sx={{color:'black',cursor:'pointer'}}  fontSize="small" onClick={()=>handledwnquote(amc)} />
                                                        }
                                                        </p>
                                                    </td>
                                                    {/* company name */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amccompanyname}
                                                        </p>
                                                    </td>
                                                    {/* address */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amccountry} |
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcstate} |
                                                        </p>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcdistrict}
                                                        </p>
                                                    </td>
                                                    {/* machine  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcmachine}
                                                        </p>
                                                    </td>
                                                    {/* quotation type  */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.amcdata[amc].amcquottype}
                                                        </p>
                                                    </td>
                                                    {/*  admin comment */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {sharedvalue.amcdata[amc].amcadmincommt}
                                                        </p>
                                                    </td>
                                                    {/* created by */}
                                                    <td>
                                                        <p className="view-manager-list-name">
                                                            {sharedvalue.workersdata[sharedvalue.amcdata[amc].amccreatedby].name}
                                                        </p>
                                                    </td>
                                                    {/*  amc  id */}
                                                    <td>
                                                        <p className={`view-manager-list-name`}>
                                                            {amc}
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
                <p>Are you sure you want to download the pdf <span>{ dwnquote.amcid!==''?sharedvalue.amcdata[dwnquote.amcid].amccompanyname:''}</span></p>
                <div>
                    { 
                        dwnquote.amcid!==''   && <PDFDownloadLink document={<Amcquote amcid={dwnquote.amcid} sharedvalue={sharedvalue}/>} fileName={`${sharedvalue.amcdata[dwnquote.amcid].amccompanyname}`}>
                            <button onClick={()=>handledwnquoteafterclose()}>yes</button>
                        </PDFDownloadLink>
                    }
                    
                    {/* <button>Yes</button> */}
                    <button onClick={()=>setdwnquote(prev=>({
                        ...prev,
                        active:false,
                        amcid:''
                    }))}>No</button>
                </div>
            </div>
            {/* popup to close an item */}
            <div className={`view-manager-list-popup-delete ${workerdelete.active===true?'active-delete-popup':''}`}>
                <p>Are You Sure You want to close the Amc  <span>{workerdelete.amcid?workerdelete.amcid:''}</span></p>
                <div>
                    <button onClick={()=>handleclosequatation()}>Yes</button>
                    <button onClick={()=>setworkerdelete(prev=>({
                        ...prev,
                        active:false,
                        amcid:''
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

export default ViewAmc;