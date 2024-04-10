import React,{useContext, useState} from "react";
import './Documents.css';
import Sidenav from "../Sidenav/Sidenav";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import MyContext from "../../MyContext";
import { useNavigate , useParams} from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {  ref, deleteObject } from "firebase/storage";
import { storage , db} from "../../Firebase";
import { updateDoc, deleteField, writeBatch } from "firebase/firestore";
import { documentsdoc } from "../../Data/Docs";
function Documents(){
    const {category,subcategory} = useParams();
    const [grainsfilter,setgrainsfilter] = useState('');
    const [machinesmodel,setmachinesmodel] = useState('');
    const [softwareversions,setsoftwareversions] = useState('');

    // console.log('categ: ',category);
    // console.log('sub:',subcategory);
    const[showloading,setshowloading] = useState(false);
    const sharedvalue = useContext(MyContext);
    const batch = writeBatch(db);
    const navigate = useNavigate();

    const [activenavnum,setactivenavnum] = useState(0);

    //async function to delete the document
    async function handledeletedocument(docid){
        setshowloading(true)
        try{
            if(sharedvalue.documentsdata[docid].adocfileurl!==''){
                const docuRef = ref(storage,sharedvalue.documentsdata[docid].adocfileurl);
                deleteObject(docuRef).then(()=>{
                    console.log('deleted the image in storaGE SUCCESSFULLY');
                }).catch((error)=>{
                    console.log("you got an error while deleting the image in  storage",error); 
                });
            }
            await updateDoc(documentsdoc,{
                [docid]:deleteField()
            });
            await batch.commit();
        }catch(error){
            console.log('you got an error while deleting the document',error);
        }
        setshowloading(false);
    }

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
                               <div className="documentation-nav-con-each" onMouseEnter={()=>setactivenavnum(0)}  >
                                    <p onClick={()=>navigate('/documents/Installation Drawing/subcategory')}>Installation Drawing</p>
                                    
                                </div>
                               <div  className={`documentation-nav-con-each ${activenavnum===2?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(2)} >
                                    <p>Model Data</p>
                                    <ul onMouseEnter={()=>setactivenavnum(2)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li onClick={()=>navigate('/documents/Model Data/grains')}>Grains</li>
                                        <li onClick={()=>navigate('/documents/Model Data/machine model')}>Machine Model</li>
                                        <li onClick={()=>navigate('/documents/Model Data/software version')}>Software Version</li>
                                        <li onClick={()=>navigate('/documents/Model Data/others')}>Others</li>
                                    </ul>
                                </div>
                               <div className={`documentation-nav-con-each ${activenavnum===3?'doc-nce-active':''}`}  onMouseEnter={()=>setactivenavnum(3)}>
                                    <p>Utility Details</p>
                                    <ul onMouseEnter={()=>setactivenavnum(3)} onMouseLeave={()=>setactivenavnum(0)}>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/compressor details')}>compressor details</li>
                                        <li onClick={()=>navigate('/documents/Installation Drawing/electrical details')}>electrical details</li>
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

                        {
                            category==='Model Data' && subcategory==='grains' &&
                            <div className="sub-model-in-subcategory-div">
                                <label>Select Grains</label>
                                <select value={grainsfilter} onChange={(e)=>setgrainsfilter(e.target.value)}>
                                    <option value=''>Select Grains</option>
                                    <option value='urad dal'>urad dal</option>
                                    <option value='channa dal'>channa dal</option>
                                    <option value='toor dal'>toor dal</option>
                                    <option value='moong dal'>moong dal</option>
                                    <option value='other'>other</option>
                                </select>
                            </div>
                        }

                        {
                            category==='Model Data' && subcategory==='software version' &&
                            <div className="sub-model-in-subcategory-div">
                                <label>Select Software Version</label>
                                <select value={softwareversions} onChange={(e)=>setsoftwareversions(e.target.value)}>
                                    <option value=''>Select Software Version</option>
                                    <option value='370'>370</option>
                                    <option value='380'>380</option>
                                    <option value='396'>396</option>
                                    <option value='400'>400</option>
                                    <option value='NYT'>NYT</option>
                                    <option value='other'>other</option>
                                </select>
                            </div>
                        }

                        {
                            category==='Model Data' && subcategory==='machine model' &&
                            <div className="sub-model-in-subcategory-div">
                                <label>Select Machine Model</label>
                                <select value={machinesmodel} onChange={(e)=>setmachinesmodel(e.target.value)}>
                                    <option value=''>Select Machine Model</option>
                                    <option value='ULTIMA'>ULTIMA</option>
                                    <option value='ULTRA-S'>ULTRA-S</option>
                                    <option value='RGB'>RGB</option>
                                    <option value='FALCON'>FALCON</option>
                                </select>
                            </div>
                        }
                        
                        {/* training material will start from here */}
                        <div className="training-material-header">
                            <h1>Training Material</h1>
                            <p>This information provides the details of Training Material</p>
                        </div>
                        {/* table will shown here */}
                        {sharedvalue.documentskeys
                        .filter(item=>sharedvalue.documentsdata[item].adoccate.includes(`${category}`))
                        .filter(item=>(sharedvalue.documentsdata[item].adocsubcate!==''? sharedvalue.documentsdata[item].adocsubcate.includes(subcategory):true))
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
                                        .filter(item=>sharedvalue.documentsdata[item].adoccate.includes(category))
                                        .filter(item=>(sharedvalue.documentsdata[item].adocsubcate!==''? sharedvalue.documentsdata[item].adocsubcate.includes(subcategory):true))
                                        .filter(item=>((category==='Model Data' && subcategory==='grains')===true?sharedvalue.documentsdata[item].adocsubgrains.includes(grainsfilter):true))
                                        .filter(item=>((category==='Model Data' && subcategory==='machine model')===true?sharedvalue.documentsdata[item].adocmachinetype.includes(machinesmodel):true))
                                        .filter(item=>((category==='Model Data' && subcategory==='software version')===true?sharedvalue.documentsdata[item].adocsoftver.includes(softwareversions):true))
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
                                                        <div className="documents-actions-div">
                                                            <div>
                                                                {sharedvalue.documentsdata[item].adocfileurl!==''? <a href={sharedvalue.documentsdata[item].adocfileurl} rel="noreferrer" target="_blank">
                                                                <VisibilityIcon sx={{color:'#1A73E8',cursor:'pointer'}} fontSize="small"/>
                                                                </a>:'-'}
                                                            </div>
                                                            <div>
                                                                {
                                                                sharedvalue.role==='admin' && <DeleteOutlineRoundedIcon sx={{color:'red',cursor:'pointer'}} fontSize="small" onClick={()=>handledeletedocument(item)}/> 
                                                                }
                                                            </div>
                                                        </div>
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={showloading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}

export default Documents;