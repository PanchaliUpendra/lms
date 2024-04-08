import React,{useContext, useState} from "react";
import './Documents.css';
import Sidenav from "../Sidenav/Sidenav";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from "../../MyContext";
import { useNavigate , useParams} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

function Documents(){
    const {category,subcategory} = useParams();
    console.log('categ: ',category);
    console.log('sub:',subcategory);
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
                               <div className={`documentation-nav-con-each ${activenavnum===1?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(1)} onClick={()=>navigate('/documents/Training Material/subcategory')} >
                                    <p>Training Material</p>
                                    <ul onMouseEnter={()=>setactivenavnum(1)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li>pdf</li>
                                        <li>video</li>
                                    </ul>
                                </div>
                               <div className={`documentation-nav-con-each ${activenavnum===2?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(2)} >
                                    <p>Installation Drawing</p>
                                    <ul onMouseEnter={()=>setactivenavnum(2)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/grains')}>grains</li>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/services')}>services</li>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/others')}>others</li>
                                    </ul>
                                </div>
                               <div className="documentation-nav-con-each" onMouseEnter={()=>setactivenavnum(0)}>
                                    <p>Mode Data</p>
                                </div>
                               <div className={`documentation-nav-con-each ${activenavnum===3?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(3)}>
                                    <p>Utility Details</p>
                                    <ul onMouseEnter={()=>setactivenavnum(3)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/compressor details')}>compressor details</li>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/UPS specifications')}>UPS specifications</li>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/Blower details')}>Blower details</li>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/Air piping details')}>Air piping details</li>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/elevator details')}>elevator details</li>
                                    </ul>
                                </div>
                               <div className="documentation-nav-con-each" onMouseEnter={()=>setactivenavnum(0)}>
                                    <p>Software</p>
                                </div>
                               <div className="documentation-nav-con-each" onMouseEnter={()=>setactivenavnum(0)}><p>Others</p></div>
                            </div>
                        </div>
                        
                        {/* training material will start from here */}
                        <div className="training-material-header">
                            <h1>Training Material</h1>
                            <p>This information provides the details of Training Material</p>
                        </div>

                        {/* table will shown here */}
                        {sharedvalue.documentskeys
                        .filter(item=>sharedvalue.documentsdata[item].adoccate.includes(`${category}`))
                        .filter(item=>(sharedvalue.documentsdata[item].adocsubcate!=='' && sharedvalue.documentsdata[item].adocsubcate.includes(subcategory)))
                        .length>0 &&
                        
                        <div className="documents-table">
                            <div className="view-list-table-con">
                                <table>
                                    <thead>
                                        <tr className="table-head-row">
                                            <th>si.no</th>
                                            <th>Documentation Name</th>
                                            <th>Description</th>
                                            <th>action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        sharedvalue.documentskeys
                                        .filter(item=>sharedvalue.documentsdata[item].adoccate.includes(`${category}`))
                                        .filter(item=>(sharedvalue.documentsdata[item].adocsubcate!=='' && sharedvalue.documentsdata[item].adocsubcate.includes(subcategory)))
                                        .map((item,idx)=>(
                                            <tr key={idx}>
                                                    <td>
                                                        <p className="view-manager-list-sino">
                                                            {Number(idx)+1}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-name">{sharedvalue.documentsdata[item].adocname}</p>
                                                    </td>
                                                    <td>
                                                        <p className="view-manager-list-email">
                                                            {sharedvalue.documentsdata[item].adocdes}
                                                        </p>
                                                    </td>
                                                    <td>
                                                        <p>
                                                        {sharedvalue.documentsdata[item].adocfileurl!==''? <a href={sharedvalue.documentsdata[item].adocfileurl} rel="noreferrer" target="_blank">
                                                            <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                            </a>:'-'}
                                                        </p>
                                                    </td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        }
                    </div>
                    {/* your documentation container ends here */}
                </div>
            </div>
        </>
    );
}

export default Documents;