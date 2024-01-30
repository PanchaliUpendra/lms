import React,{useContext , useEffect, useState} from "react";
import './Meetingdetails.css';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import Sidenav from "../Sidenav/Sidenav";
import MyContext from "../../MyContext";
import { useParams , useNavigate } from "react-router-dom";
import { writeBatch} from "firebase/firestore"; 
import Error from "../../Error/Error";
import { createmeetings, leaddoc } from "../../Data/Docs";
import { onSnapshot } from "firebase/firestore";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { db } from "../../Firebase";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

function Meetingdetails(){
    const sharedvalue = useContext(MyContext);
    const {leadid} = useParams();
    const navigate = useNavigate();
    const batch = writeBatch(db);// Get a new write batch
    const [open, setOpen] = useState(false);
    const [meetingsdata,setmeetingsdata] = useState([]);
    //toggle the pop-up button
    const [createpopup , setcreatepopup] = useState(false);
    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    //next meeting data
    const [nextmeetingdetails,setnextmeetingdetails] = useState({
        date:'',
        title:'',
        subtitle:'',
        comment:''
    })
    //function handle create next meeting
    async function handlecreatenextmeeting(){
        setOpen(true)
        try{
            if(
                nextmeetingdetails.date!=='' &&
                nextmeetingdetails.title!=='' &&
                nextmeetingdetails.subtitle!=='' &&
                nextmeetingdetails.comment!==''
            ){
                if(leadid!==0){
                    await batch.update(createmeetings,{
                        [leadid]:[
                            {
                                date:nextmeetingdetails.date,
                                title:nextmeetingdetails.title,
                                subtitle:nextmeetingdetails.subtitle,
                                comment:nextmeetingdetails.comment,
                                addedby:sharedvalue.uid
                            },
                            ...meetingsdata
                        ]    
                    });

                    await batch.update(leaddoc,{
                        [leadid]:{
                            ...sharedvalue.leadsdata[leadid],
                            latesttitle:[nextmeetingdetails.title],
                            latestsubtitle:[nextmeetingdetails.subtitle],
                            latestcomment:[nextmeetingdetails.comment]
                        }
                    });
                    await batch.commit();
                }
            }else{
                alert('fill the feilds firest');
            }
        }catch(e){
            console.log('you got an error while updaing the next meeting ',e);
        }
        setOpen(false);
        setcreatepopup(false);
    }
    // toggle menu bar code ends here
    useEffect(()=>{
        if(sharedvalue.leadskeys.length>0 && sharedvalue.leadskeys.includes(leadid)){
            const fecthmeetingdetails = async() =>{
                try{
                    await onSnapshot(createmeetings,(doc)=>{
                        const tempmeetingdetails = doc.data();
                        setmeetingsdata(tempmeetingdetails[leadid]);
                    })
                }catch(e){
                    console.log('you got an error while fetching the meeting details',e);
                }
            }
            fecthmeetingdetails();//fetching the meeting details from database
        }

    },[sharedvalue.leadskeys,leadid]);
    return(
        <>
        {
            (sharedvalue.leadskeys.length>0 && sharedvalue.leadskeys.includes(leadid)===true) === true?
            <div className={`manlead-con ${createpopup===true?'manlead-con-inactive':''}`}>
                <Sidenav menutoggle={menutoggle} handlemenutoggle={handlemenutoggle}/>
                <div className='manage-con-inner'>

                    {/* inner navbar container */}
                    <div className='top-bar'>
                        <div className='top-nav-tog'>
                            <MenuIcon  onClick={()=>setmenutoggle(prev=>!prev)}/>
                        </div>
                        <div className='search-icon-top-nav'>
                            <SearchIcon />
                        </div>
                        <PersonIcon/>
                        <p>{sharedvalue.userdtl.email}</p>
                    </div>
                    {/* your createexpense starts from here */}
                    <div className='create-lead-con'>
                       
                        
                        <div className='each-lead-head-comes-here'>
                            <h1>Meeting Details</h1>
                        </div>
                        <div className='create-lead-head-button-comes-here'>
                            <button onClick={()=>navigate(-1)}>
                                <ChevronLeftIcon/>
                                Go Back
                            </button>
                        </div>
                        {/* inner form starts here */}
                        <div className="view-manager-list-con">
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            
                                            <th>Date</th>
                                            <th>title</th>
                                            <th>sub-title</th>
                                            <th>added by</th>
                                            <th>commments</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {meetingsdata.length>0 && meetingsdata.map((item,idx)=>(
                                            <tr key={idx}>
                                                <td>
                                                    <p className="view-manager-list-name">{item.date}</p>
                                                </td>
                                                <td>
                                                    <p className="view-manager-list-name">
                                                        {item.title}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="view-manager-list-name">
                                                        {item.subtitle}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="view-manager-list-name">
                                                        {sharedvalue.workersdata[item.addedby].name}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p className="view-manager-list-name">
                                                        {item.comment}
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {/* table ends here */}
                            <div className="create-next-meeting-btns">
                                <button onClick={()=>setcreatepopup(true)}>create next meeting</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :<Error/>
        }
        <div className={`create-next-meeting ${createpopup===true?'create-nxtmeet-popup-active':''}`}>
            <div className="create-next-meeting-btns-inner-form">
                {/* <button onClick={()=>setcreatepopup(false)}>create next meeting</button> */}
                <div>
                    <label>next meeting date</label>
                    <input type='date' value={nextmeetingdetails.date} onChange={(e)=>setnextmeetingdetails(prev=>({
                        ...prev,
                        date:e.target.value
                    }))}/>
                </div>
                <div>
                    <label>title</label>
                    <input type='text' value={nextmeetingdetails.title} onChange={(e)=>setnextmeetingdetails(prev=>({
                        ...prev,
                        title:e.target.value
                    }))}/>
                </div>
                <div>
                    <label>sub-title</label>
                    <input type='text' value={nextmeetingdetails.subtitle} onChange={(e)=>setnextmeetingdetails(prev=>({
                        ...prev,
                        subtitle:e.target.value
                    }))}/>
                </div>
                <div>
                    <label>comment</label>
                    <textarea type='text' value={nextmeetingdetails.comment} onChange={(e)=>setnextmeetingdetails(prev=>({
                        ...prev,
                        comment:e.target.value
                    }))}/>
                </div>
                <section className="cancle-create-create-next-meetings">
                    <button onClick={()=>setcreatepopup(false)}>cancel</button>
                    <button onClick={()=>handlecreatenextmeeting()}>create</button>
                </section>
             </div>
        </div>
        <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}


export default Meetingdetails;