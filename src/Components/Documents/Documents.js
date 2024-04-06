import React,{useContext, useState} from "react";
import './Documents.css';
import Sidenav from "../Sidenav/Sidenav";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from "../../MyContext";
import { useNavigate } from "react-router-dom";

function Documents(){
    const sharedvalue = useContext(MyContext);
    const navigate = useNavigate();

    const [activenavnum,setactivenavnum] = useState(0);

    //code only for toggle the menu bar
    const [menutoggle,setmenutoggle] = useState(false);
    function handlemenutoggle(){
        setmenutoggle(prev=>!prev);
    }
    // toggle menu bar code ends here

   
    return(
        <>
            <div className="manlead-con">
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

                    {/* here your documentation container starts */}
                    <div className='documentation-con'>
                        <div className="documentation-nav">
                            <h1>documentation</h1>
                            <div className="documentation-nav-con" onMouseLeave={()=>setactivenavnum(0)}>
                               <div className={`documentation-nav-con-each ${activenavnum===1?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(1)} >
                                    <p>Training Material</p>
                                    <ul onMouseEnter={()=>setactivenavnum(1)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li>pdf</li>
                                        <li>video</li>
                                    </ul>
                                </div>
                               <div className={`documentation-nav-con-each ${activenavnum===2?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(2)}>
                                    <p>Installation Drawing</p>
                                    <ul onMouseEnter={()=>setactivenavnum(2)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li>select grains</li>
                                        <li>services</li>
                                        <li>others</li>
                                    </ul>
                                </div>
                               <div className="documentation-nav-con-each" onMouseEnter={()=>setactivenavnum(0)}>
                                    <p>Mode Data</p>
                                </div>
                               <div className={`documentation-nav-con-each ${activenavnum===3?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(3)}>
                                    <p>Utility Details</p>
                                    <ul onMouseEnter={()=>setactivenavnum(3)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li>compressor details</li>
                                        <li>UPS specifications</li>
                                        <li>Blower details</li>
                                        <li>Air piping details</li>
                                        <li>elevator details</li>
                                    </ul>
                                </div>
                               <div className="documentation-nav-con-each" onMouseEnter={()=>setactivenavnum(0)}>
                                    <p>Software</p>
                                </div>
                               <div className="documentation-nav-con-each" onMouseEnter={()=>setactivenavnum(0)}><p>Others</p></div>
                            </div>
                        </div>
                    </div>
                    {/* your documentation container ends here */}
                </div>
            </div>
        </>
    );
}

export default Documents;